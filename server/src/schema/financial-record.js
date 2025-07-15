import mongoose from "mongoose";

const financialRecordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  currency: { type: String, required: true, default: "USD" },
});

// Create indexes for better query performance
financialRecordSchema.index({ userId: 1 });
financialRecordSchema.index({ userEmail: 1 });

const FinancialRecordModel = mongoose.model(
  "FinancialRecord",
  financialRecordSchema
);

export default FinancialRecordModel;
