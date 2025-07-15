import express from "express";
import BudgetModel from "../schema/budget.js";

const router = express.Router();

// Get user information from authenticated request
const getUserInfo = (req) => {
  const userId = req.auth.userId;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return {
    userId: userId,
    // For now, we'll use the userId as a fallback for email and name
    // These can be enhanced later if needed
    userEmail: `user-${userId}@example.com`,
    userName: `User ${userId.slice(-8)}`,
  };
};

// Validation helper function
const validateBudgetData = (data) => {
  const errors = [];

  // Validate amount
  if (data.amount === undefined || data.amount === null) {
    errors.push("Budget amount is required");
  } else if (typeof data.amount !== "number" || isNaN(data.amount)) {
    errors.push("Budget amount must be a valid number");
  } else if (data.amount <= 0) {
    errors.push("Budget amount must be greater than zero");
  } else if (data.amount > 999999999) {
    errors.push("Budget amount is too large");
  }

  // Validate category
  if (!data.category || typeof data.category !== "string") {
    errors.push("Category is required and must be a string");
  }

  // Validate month (optional, but if provided must be valid)
  if (
    data.month !== undefined &&
    (typeof data.month !== "number" || data.month < 1 || data.month > 12)
  ) {
    errors.push("Month must be a number between 1 and 12");
  }

  // Validate year (optional, but if provided must be valid)
  if (
    data.year !== undefined &&
    (typeof data.year !== "number" || data.year < 1900 || data.year > 3000)
  ) {
    errors.push("Year must be a valid year");
  }

  return errors;
};

// Get all budgets for authenticated user
router.get("/getAll", async (req, res) => {
  try {
    // Filter budgets by authenticated user's ID
    const budgets = await BudgetModel.find({ userId: req.auth.userId });
    res.status(200).send(budgets);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create a new budget
router.post("/", async (req, res) => {
  try {
    const budgetData = req.body;

    // Validate the budget data
    const validationErrors = validateBudgetData(budgetData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors,
      });
    }

    // Get user info and create budget
    const userInfo = getUserInfo(req);
    const newBudget = new BudgetModel({
      ...budgetData,
      ...userInfo,
    });

    const savedBudget = await newBudget.save();
    res.status(200).send(savedBudget);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update a budget
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    // Validate the budget data
    const validationErrors = validateBudgetData(updateData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors,
      });
    }

    // Get user info
    const userInfo = getUserInfo(req);

    // Update only budgets that belong to the authenticated user
    const budget = await BudgetModel.findOneAndUpdate(
      { _id: id, userId: userInfo.userId },
      { ...updateData, ...userInfo },
      { new: true }
    );

    if (!budget) {
      return res
        .status(404)
        .send({ error: "Budget not found or access denied" });
    }

    res.status(200).send(budget);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete a budget
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Delete only budgets that belong to the authenticated user
    const budget = await BudgetModel.findOneAndDelete({
      _id: id,
      userId: req.auth.userId,
    });

    if (!budget) {
      return res
        .status(404)
        .send({ error: "Budget not found or access denied" });
    }

    res.status(200).send(budget);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
