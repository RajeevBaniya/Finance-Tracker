import mongoose from "mongoose";

const financialRecordSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  paymentMethod: { type: String, required: true },
  currency: { type: String, required: true, default: "USD" },
});

const FinancialRecordModel = mongoose.model(
  "FinancialRecord",
  financialRecordSchema
);

export default FinancialRecordModel;
