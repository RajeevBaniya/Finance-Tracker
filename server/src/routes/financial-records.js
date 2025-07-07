import express from "express";
import FinancialRecordModel from "../schema/financial-record.js";

const router = express.Router();

router.get("/getAll", async (req, res) => {
  try {
    const records = await FinancialRecordModel.find({});
    res.status(200).send(records);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/", async (req, res) => {
  try {
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

    const newRecord = new FinancialRecordModel(newRecordBody);
    const savedRecord = await newRecord.save();

    res.status(200).send(savedRecord);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newRecordBody = req.body;

    // Server-side validation for updates
    if (
      newRecordBody.description !== undefined &&
      newRecordBody.description.trim() === ""
    ) {
      return res.status(400).send({ error: "Description cannot be empty" });
    }

    if (
      newRecordBody.amount !== undefined &&
      (newRecordBody.amount === null || isNaN(newRecordBody.amount))
    ) {
      return res.status(400).send({ error: "Valid amount is required" });
    }

    if (
      newRecordBody.amount !== undefined &&
      Math.abs(newRecordBody.amount) > 999999999
    ) {
      return res.status(400).send({ error: "Amount is too large" });
    }

    const record = await FinancialRecordModel.findByIdAndUpdate(
      id,
      newRecordBody,
      { new: true }
    );

    if (!record) return res.status(404).send();

    res.status(200).send(record);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const record = await FinancialRecordModel.findByIdAndDelete(id);
    if (!record) return res.status(404).send();
    res.status(200).send(record);
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
