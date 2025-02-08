import express from "express";
import { authMiddleware } from "../middleware.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// GET /expenses/:budgetId - Retrieve expenses for a specific budget.
router.get("/expenses/:budgetId", authMiddleware, async (req, res) => {
  try {
    const { email } = req.user;
    if (!email) {
      return res.status(400).json({ msg: "Invalid email provided" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { budgets: true },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const { budgetId } = req.params;
    const idInNumber = Number(budgetId)
    // Check if the provided budgetId belongs to the user.
    // if (!user.budgets || !user.budgets.find(budget => budget.id === Number(budgetId))) { //////////////////////////////////////////
    //   return res.status(403).json({ msg: "Budget not found for this user" });
    // }
    const foundBudget = user.budgets && user.budgets.find(budget => budget.id === idInNumber);
    if (!foundBudget) {
      return res.status(403).json({ msg: "Budget not found for this user" });
    }


    const expenses = await prisma.expense.findMany({
      where: { budgetId: idInNumber },
    });

    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ msg: "No expenses found for this budget" });
    }

    return res.status(200).json({
      msg: "List of expenses",
      budget: {
        name: foundBudget.name,
        totalAmount: foundBudget.totalAmount,
      },
      Expenses: expenses,
    });
  } catch (error) {
    console.error("Error in GET /expenses:", error.message);
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

// POST /addExpense/:budgetId - Add a new expense for a specific budget.
router.post("/addExpense/:budgetId", authMiddleware, async (req, res) => {
  try {
    const { email } = req.user;
    const { name, amount } = req.body;
    const { budgetId } = req.params;

    // Validate required fields
    if (!email || !name || !amount || !budgetId) {
      return res
        .status(400)
        .json({ msg: "Email, name, amount, and budgetId are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { budgets: true },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Verify the budget belongs to the user.
    if (!user.budgets || !user.budgets.find(budget => budget.id === Number(budgetId))) {
      return res.status(403).json({ msg: "Budget does not belong to this user" });
    }

    // Create new expense linked to the specified budget
    const newExpense = await prisma.expense.create({
      data: {
        name,
        amount: amount,
        budgetId: Number(budgetId),
      },
    });

    return res.status(201).json({
      msg: "Expense added successfully",
      expense: newExpense,
    });
  } catch (error) {
    console.error("Error in POST /addExpense:", error.message);
    return res
      .status(500)
      .json({ msg: "Server Error", error: error.message });
  }
});

router.post("/removeExpense/:budgetId/:expenseId", authMiddleware, async (req, res) => {
  try {
    const { email } = req.user;
    const { budgetId, expenseId } = req.params;

    // Validate required input
    if (!email || !budgetId || !expenseId) {
      return res
        .status(400)
        .json({ msg: "Email, budgetId, and expenseId are required" });
    }

    // Find the user and include their budgets
    const user = await prisma.user.findUnique({
      where: { email },
      include: { budgets: true },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Verify that the specified budget belongs to the user.
    if (!user.budgets || !user.budgets.find((budget) => budget.id === Number(budgetId))) {
      return res.status(403).json({ msg: "Budget does not belong to this user" });
    }

    // Find the expense using expenseId and budgetId.
    const expense = await prisma.expense.findFirst({
      where: {
        id: Number(expenseId),
        budgetId: Number(budgetId),
      },
    });

    if (!expense) {
      return res.status(404).json({ msg: "Expense not found" });
    }

    // Delete the expense.
    await prisma.expense.delete({
      where: { id: expense.id },
    });

    // Fetch the updated list of expenses for the budget.
    const updatedExpenses = await prisma.expense.findMany({
      where: { budgetId: Number(budgetId) },
    });

    return res.status(200).json({
      msg: "Expense removed successfully",
      expenses: updatedExpenses,
    });
  } catch (error) {
    console.error("Error in POST /removeExpense:", error.message);
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
});

export default router;
