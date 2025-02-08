import express from "express";
import { authMiddleware } from "../middleware.js";
import { PrismaClient } from "@prisma/client";
const router = express.Router();

const prisma = new PrismaClient();

router.get("/budgets", authMiddleware, async (req, res) => {
  try {
    const { email } = req.user;
    if (!email) {
      return res.status(400).json({ msg: "Enter correct email" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { budgets: true },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json({
      msg: "List of Budgets",
      user: {
        name: user.name,
        email: user.email,
      },
      budgets: user.budgets,
    });
  } catch (error) {
    return res.status(500).json({
      msg: "Server Error",
      error: error.message,
    });
  }
});

router.post("/addBudget", authMiddleware, async (req, res) => {
  const { email } = req.user;
  const { totalAmount, name } = req.body;
  const user = await prisma.user.findUnique({
    where: { email },
    include: { budgets: true },
  });
  try {
    if (!email || !name || !totalAmount) {
      return res
        .status(400)
        .json({ msg: "Email, name and amount are required" });
    } else {
      const newBudget = await prisma.budget.create({
        data: {
          name,
          totalAmount: totalAmount,
          userId: user.id, // ✅ Link budget to user
        },
      });

      return res.status(201).json({
        msg: "Budget added successfully",
        budgetAdded: newBudget,
      });
    }
  } catch (error) {
    return res.status(408).json({
      msg: "Server Error",
    });
  }
});

router.delete("/deleteBudget/:budgetId", authMiddleware, async (req, res) => {
  const { email } = req.user;
  const { budgetId } = req.params;
  const user = await prisma.user.findUnique({
    where: { email },
    include: { budgets: true },
  });
  try {
    if (!email) {
      return res.status(400).json({ msg: "Email is required" });
    } else {
      const budget = await prisma.budget.findUnique({
        where: { id: Number(budgetId) },
      });
      if (!budget || budget.userId !== user.id) {
        return res
          .status(404)
          .json({ msg: "Budget not found or does not belong to user" });
      }
      await prisma.budget.delete({
        where: { id: Number(budgetId) },
      });
      const updatedUser = await prisma.user.findUnique({
        where: { email },
        include: { budgets: true },
      });
      return res.status(200).json({
        msg: "Budget removed successfully",
        budgets: updatedUser.budgets, // ✅ Updated budgets list
      });
    }
  } catch (error) {
    return res.status(408).json({
      msg: "Server Error",
    });
  }
});

export default router;
