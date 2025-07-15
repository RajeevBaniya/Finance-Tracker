import express from "express";
import FinancialRecordModel from "../schema/financial-record.js";

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

// Create a new financial record
router.post("/", async (req, res) => {
  try {
    const userInfo = getUserInfo(req);
    const newRecord = new FinancialRecordModel({
      ...req.body,
      ...userInfo,
    });
    const savedRecord = await newRecord.save();
    res.status(200).send(savedRecord);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Get all financial records for the authenticated user
router.get("/getAll", async (req, res) => {
  try {
    const records = await FinancialRecordModel.find({
      userId: req.auth.userId,
    });
    res.status(200).send(records);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newRecordBody = req.body;

    // Server-side validation
    if (!newRecordBody.description || newRecordBody.description.trim() === "") {
      return res.status(400).send({ error: "Description is required" });
    }

    if (
      newRecordBody.amount === null ||
      newRecordBody.amount === undefined ||
      isNaN(newRecordBody.amount)
    ) {
      return res.status(400).send({ error: "Valid amount is required" });
    }

    if (Math.abs(newRecordBody.amount) > 999999999) {
      return res.status(400).send({ error: "Amount is too large" });
    }

    if (!newRecordBody.category || !newRecordBody.paymentMethod) {
      return res
        .status(400)
        .send({ error: "Category and payment method are required" });
    }

    // Update only records that belong to the authenticated user
    const record = await FinancialRecordModel.findOneAndUpdate(
      { _id: id, userId: req.auth.userId },
      newRecordBody,
      { new: true }
    );

    if (!record) {
      return res
        .status(404)
        .send({ error: "Record not found or access denied" });
    }

    res.status(200).send(record);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Delete only records that belong to the authenticated user
    const record = await FinancialRecordModel.findOneAndDelete({
      _id: id,
      userId: req.auth.userId,
    });

    if (!record) {
      return res
        .status(404)
        .send({ error: "Record not found or access denied" });
    }

    res.status(200).send(record);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
