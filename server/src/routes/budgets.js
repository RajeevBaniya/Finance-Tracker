import express from "express";
import BudgetModel from "../schema/budget.js";

const router = express.Router();

const getUserInfo = (req) => {
  const userId = req.auth.userId;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  return {
    userId: userId,


    userEmail: `user-${userId}@example.com`,
    userName: `User ${userId.slice(-8)}`,
  };
};

const validateBudgetData = (data) => {
  const errors = [];

  if (data.amount === undefined || data.amount === null) {
    errors.push("Budget amount is required");
  } else if (typeof data.amount !== "number" || isNaN(data.amount)) {
    errors.push("Budget amount must be a valid number");
  } else if (data.amount <= 0) {
    errors.push("Budget amount must be greater than zero");
  } else if (data.amount > 999999999) {
    errors.push("Budget amount is too large");
  }

  if (!data.category || typeof data.category !== "string") {
    errors.push("Category is required and must be a string");
  }

  if (
    data.month !== undefined &&
    (typeof data.month !== "number" || data.month < 1 || data.month > 12)
  ) {
    errors.push("Month must be a number between 1 and 12");
  }

  if (
    data.year !== undefined &&
    (typeof data.year !== "number" || data.year < 1900 || data.year > 3000)
  ) {
    errors.push("Year must be a valid year");
  }

  return errors;
};

router.get("/getAll", async (req, res) => {
  try {

    const budgets = await BudgetModel.find({ userId: req.auth.userId });
    res.status(200).send(budgets);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const budgetData = req.body;

    const validationErrors = validateBudgetData(budgetData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors,
      });
    }

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

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    const validationErrors = validateBudgetData(updateData);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors,
      });
    }

    const userInfo = getUserInfo(req);

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

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

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
