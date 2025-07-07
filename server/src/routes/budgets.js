import express from "express";
import BudgetModel from "../schema/budget.js";

const router = express.Router();

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

// Get all budgets
router.get("/getAll", async (req, res) => {
  try {
    const budgets = await BudgetModel.find({});
    res.status(200).send(budgets);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Create a new budget
router.post("/", async (req, res) => {
  try {
    const newBudgetBody = req.body;

    // Validate the budget data
    const validationErrors = validateBudgetData(newBudgetBody);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors,
      });
    }

    const newBudget = new BudgetModel(newBudgetBody);
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
    const newBudgetBody = req.body;

    // Validate the budget data
    const validationErrors = validateBudgetData(newBudgetBody);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors,
      });
    }

    const budget = await BudgetModel.findByIdAndUpdate(id, newBudgetBody, {
      new: true,
    });

    if (!budget) return res.status(404).send();

    res.status(200).send(budget);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Delete a budget
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const budget = await BudgetModel.findByIdAndDelete(id);
    if (!budget) return res.status(404).send();
    res.status(200).send(budget);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
