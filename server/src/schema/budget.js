import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: "USD" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the updatedAt field before saving
budgetSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const BudgetModel = mongoose.model("Budget", budgetSchema);

export default BudgetModel;
