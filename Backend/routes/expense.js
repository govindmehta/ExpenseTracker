import express from "express";
import { authMiddleware } from "../middleware.js";
import { PrismaClient } from "@prisma/client";
const router = express.Router();

const prisma = new PrismaClient();

router.get("/expenses", authMiddleware, async (req, res) => {
  const { email } = req.user;
  const user = await prisma.user.findUnique({
    where: { email },
    include: { budgets: true },
  });
  if (user.budgets.length === 0) {
    return res.status(404).json({ msg: "No Budgets found for this user" });
  }
  try {
    if (!email) {
      return res.status(400).json({ msg: "Enter correct email" });
    } else {
      const budgetId = user.budgets[0].id;
      const expenses = await prisma.expense.findMany({
        where: { budgetId }, // ✅ Correct way to find expenses by budgetId
      });
      if (expenses.length === 0) {
        return res.status(404).json({ msg: "No expenses found" });
      }
      return res.status(200).json({
        msg: "List of expenses",
        Expenses: expenses,
      });
    }
  } catch (error) {
    return res.status(408).json({
      msg: "Server Error",
    });
  }
});

router.post("/addExpense", authMiddleware, async (req, res) => {
  try {
    const { email } = req.user;
    const {  name, amount } = req.body; // ✅ Get data from req.body

    // ✅ Validate required fields
    if (!email || !name || !amount) {
      return res
        .status(400)
        .json({ msg: "Email, name, and amount are required" });
    }

    // ✅ Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { budgets: true }, // ✅ Fetch user's budgets
    });

    if (user.budgets.length === 0) {
      return res.status(404).json({ msg: "No budget found for this user" });
    }

    const budgetId = user.budgets[0].id;

    // ✅ Create new expense linked to user
    const newExpense = await prisma.expense.create({
      data: {
        name,
        amount: amount,
        budgetId: budgetId, // ✅ Auto-fetch budgetId
      },
    });

    return res.status(201).json({
      msg: "Expense added successfully",
      expense: newExpense,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

router.post("/removeExpense", authMiddleware, async (req, res) => {
  try {
    const { email, name, amount } = req.body; // ✅ Extract data from request body

    // ✅ Validate input
    if (!email || !name || !amount) {
      return res
        .status(400)
        .json({ msg: "Email, name, and amount are required" });
    }

    // ✅ Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { budgets: true }, // Include budgets to verify relationship
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.budgets.length === 0) {
      return res.status(404).json({ msg: "No budgets found for this user" });
    }

    // ✅ Get the first budgetId (or modify this logic if the user has multiple budgets)
    const budgetId = user.budgets[0].id;

    // ✅ Find the expense using name and amount
    const expense = await prisma.expense.findFirst({
      where: {
        name,
        amount: amount,
        budgetId: budgetId, // Ensure it belongs to the user's budget
      },
    });

    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    // ✅ Delete the expense
    await prisma.expense.delete({
      where: { id: expense.id },
    });

    // ✅ Fetch updated expenses
    const updatedExpenses = await prisma.expense.findMany({
      where: { budgetId },
    });

    return res.status(200).json({
      msg: "Expense removed successfully",
      expenses: updatedExpenses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      msg: "Server Error",
      error: error.message,
    });
  }
});

export default router;
