import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userEmail: { type: String, required: true },
  userName: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  currency: { type: String, required: true, default: "USD" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

budgetSchema.index({ userId: 1 });
budgetSchema.index({ userEmail: 1 });
budgetSchema.index({ category: 1, month: 1, year: 1 });

budgetSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const BudgetModel = mongoose.model("Budget", budgetSchema);

export default BudgetModel;
