"use client";

import React, { useState } from "react";
import { useFinancial } from "@/features/financial/context/financial-context";
import { useBudget } from "@/features/budget/context/budget-context";
import {
  TRANSACTION_CATEGORIES,
  PAYMENT_METHODS,
  TRANSACTION_TYPES,
} from "@/config/stages";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Loader2, AlertCircle, AlertTriangle, X } from "lucide-react";

export function TransactionForm() {
  const { 
    addRecord, 
    selectedCurrency, 
    totalIncome, 
    totalExpenses, 
    formatCurrency 
  } = useFinancial();
  const { budgetComparison } = useBudget();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [budgetWarning, setBudgetWarning] = useState({
    isOpen: false,
    budgetInfo: null,
    pendingRecord: null,
  });

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
    category: "",
    paymentMethod: "",
    transactionType: "deposit", // Default to deposit
    fromAccount: "",
    toAccount: "",
  });

  const availableBalance = totalIncome - totalExpenses;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.amount || formData.amount.trim() === "") {
      newErrors.amount = "Amount is required";
    } else {

      const cleanAmount = formData.amount.trim();
      const numberRegex = /^\d+(\.\d{1,2})?$/; // Only allow positive number formats

      if (!numberRegex.test(cleanAmount)) {
        newErrors.amount = "Please enter a positive number (e.g., 100, 25.50)";
      } else {
        const parsedAmount = parseFloat(cleanAmount);
        if (isNaN(parsedAmount) || parsedAmount === 0) {
          newErrors.amount = "Amount cannot be zero or invalid";
        } else if (parsedAmount > 999999999) {
          newErrors.amount = "Amount is too large";
        }

        if (formData.transactionType === "expense") {

          if (totalIncome <= 0) {
            newErrors.transactionType = "You must add deposits before adding expenses";
          } else if (parsedAmount > availableBalance) {
            newErrors.amount = `Insufficient funds. Available balance: ${formatCurrency(availableBalance)}`;
          }
        }
      }
    }

    if (!formData.date) {
      newErrors.date = "Please select a date";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Please select a payment method";
    }

    if (!formData.transactionType) {
      newErrors.transactionType = "Please select transaction type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const checkBudgetExceeded = (category, expenseAmount) => {

    const categoryBudget = budgetComparison.find(
      (budget) => budget.category.toLowerCase() === category.toLowerCase()
    );

    if (!categoryBudget) {
      return { exceeded: false, budgetInfo: null };
    }

    const currentSpent = categoryBudget.spent || 0;
    const newTotalSpent = currentSpent + expenseAmount;

    if (newTotalSpent > categoryBudget.budgeted) {
      const overAmount = newTotalSpent - categoryBudget.budgeted;
      return {
        exceeded: true,
        budgetInfo: {
          category,
          expenseAmount,
          overAmount,
          currentSpent,
          budgeted: categoryBudget.budgeted,
          newTotalSpent,
        },
      };
    }

    return { exceeded: false, budgetInfo: null };
  };

  const addTransactionRecord = async (recordData) => {
    try {
      setLoading(true);
      await addRecord(recordData);

      setFormData({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        paymentMethod: "",
        transactionType: "deposit",
        fromAccount: "",
        toAccount: "",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    let finalAmount = parseFloat(formData.amount);
    if (formData.transactionType === "expense") {
      finalAmount = -Math.abs(finalAmount);
    } else {
      finalAmount = Math.abs(finalAmount);
    }

    const newRecord = {
      date: new Date(formData.date).toISOString(),
      description: formData.description.trim(),
      amount: finalAmount,
      category: formData.category,
      paymentMethod: formData.paymentMethod,
      currency: selectedCurrency,
      fromAccount: formData.fromAccount.trim(),
      toAccount: formData.toAccount.trim(),
    };

    if (formData.transactionType === "expense") {
      const expenseAmount = Math.abs(finalAmount);
      const budgetCheck = checkBudgetExceeded(formData.category, expenseAmount);

      if (budgetCheck.exceeded) {

        setBudgetWarning({
          isOpen: true,
          budgetInfo: budgetCheck.budgetInfo,
          pendingRecord: newRecord,
        });
        return; // Don't add yet, wait for user confirmation
      }
    }

    await addTransactionRecord(newRecord);
  };

  const handleBudgetWarningConfirm = async () => {
    if (budgetWarning.pendingRecord) {
      await addTransactionRecord(budgetWarning.pendingRecord);
    }
    setBudgetWarning({ isOpen: false, budgetInfo: null, pendingRecord: null });
  };

  const handleBudgetWarningCancel = () => {
    setBudgetWarning({ isOpen: false, budgetInfo: null, pendingRecord: null });
    setLoading(false);
  };

  return (
    <>
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg sm:text-xl">Add Transaction</CardTitle>
        <CardDescription className="text-sm">
          Record a new financial transaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        {}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Financial Status</span>
          </div>
          <div className="text-xs">
            <div>
              <span className="text-gray-600">Net Savings:</span>
              <span className={`ml-1 font-medium ${availableBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(availableBalance)}
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {}
          <div className="space-y-2">
            <Label
              htmlFor="transaction-description"
              className="text-sm font-medium text-black"
            >
              Description
            </Label>
            <Input
              id="transaction-description"
              name="description"
              type="text"
              placeholder="Enter transaction description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`h-10 ${errors.description ? "border-red-500" : ""}`}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {}
          <div className="space-y-1.5">
            <Label htmlFor="date" className="text-sm font-medium text-black">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className={`w-full ${errors.date ? "border-red-500" : ""}`}
            />
            {errors.date && (
              <p className="text-xs sm:text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {}
            <div className="space-y-1.5">
              <Label
                htmlFor="transactionType"
                className="text-sm font-medium text-black"
              >
                Type
              </Label>
              <Select
                value={formData.transactionType}
                onValueChange={(value) =>
                  handleInputChange("transactionType", value)
                }
              >
                <SelectTrigger
                  className={`w-full ${
                    errors.transactionType ? "border-red-500" : ""
                  }`}
                >
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TRANSACTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.transactionType && (
                <p className="text-xs sm:text-sm text-red-500">
                  {errors.transactionType}
                </p>
              )}
            </div>

            {}
            <div className="space-y-1.5">
              <Label
                htmlFor="amount"
                className="text-sm font-medium text-black"
              >
                Amount
              </Label>
              <Input
                id="amount"
                type="text"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className={`w-full ${errors.amount ? "border-red-500" : ""}`}
              />
              {errors.amount && (
                <p className="text-xs sm:text-sm text-red-500">
                  {errors.amount}
                </p>
              )}
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {}
            <div className="space-y-1.5">
              <Label
                htmlFor="fromAccount"
                className="text-sm font-medium text-black"
              >
                From (Optional)
              </Label>
              <Input
                id="fromAccount"
                type="text"
                placeholder="e.g., My Bank Account, Cash, etc."
                value={formData.fromAccount}
                onChange={(e) =>
                  handleInputChange("fromAccount", e.target.value)
                }
                className="w-full"
              />
            </div>

            {}
            <div className="space-y-1.5">
              <Label
                htmlFor="toAccount"
                className="text-sm font-medium text-black"
              >
                To (Optional)
              </Label>
              <Input
                id="toAccount"
                type="text"
                placeholder="e.g., John Doe, Store Name, etc."
                value={formData.toAccount}
                onChange={(e) => handleInputChange("toAccount", e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          {}
          <div className="space-y-1.5">
            <Label
              htmlFor="category"
              className="text-sm font-medium text-black"
            >
              Category
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger
                className={`w-full ${errors.category ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {TRANSACTION_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs sm:text-sm text-red-500">
                {errors.category}
              </p>
            )}
          </div>

          {}
          <div className="space-y-1.5">
            <Label
              htmlFor="paymentMethod"
              className="text-sm font-medium text-black"
            >
              Payment Method
            </Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) =>
                handleInputChange("paymentMethod", value)
              }
            >
              <SelectTrigger
                className={`w-full ${
                  errors.paymentMethod ? "border-red-500" : ""
                }`}
              >
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    <span className="flex items-center gap-2">
                      <span>{method.icon}</span>
                      {method.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentMethod && (
              <p className="text-xs sm:text-sm text-red-500">
                {errors.paymentMethod}
              </p>
            )}
          </div>

          {}
          <Button type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Transaction
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>

    {}
    {budgetWarning.isOpen && budgetWarning.budgetInfo && (
      <Dialog isOpen={budgetWarning.isOpen} onClose={handleBudgetWarningCancel}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-finance-light flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Budget Exceeded Warning
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBudgetWarningCancel}
              className="h-8 w-8 p-0 hover:bg-finance-border text-finance-secondary hover:text-finance-light"
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <DialogContent>
          <div className="space-y-4">
            <p className="text-finance-secondary text-sm">
              This expense of{" "}
              <span className="font-semibold text-red-400">
                {formatCurrency(budgetWarning.budgetInfo.expenseAmount)}
              </span>{" "}
              will exceed your{" "}
              <span className="font-semibold text-finance-light">
                {budgetWarning.budgetInfo.category}
              </span>{" "}
              budget by{" "}
              <span className="font-semibold text-red-400">
                {formatCurrency(budgetWarning.budgetInfo.overAmount)}
              </span>
              .
            </p>

            <div className="bg-finance-surface rounded-lg p-3 border border-finance-border space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-finance-secondary">Current spending:</span>
                <span className="text-finance-light font-medium">
                  {formatCurrency(budgetWarning.budgetInfo.currentSpent)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-finance-secondary">Budget:</span>
                <span className="text-blue-400 font-medium">
                  {formatCurrency(budgetWarning.budgetInfo.budgeted)}
                </span>
              </div>
              <div className="flex justify-between border-t border-finance-border pt-2">
                <span className="text-finance-secondary">After this expense:</span>
                <span className="text-red-400 font-semibold">
                  {formatCurrency(budgetWarning.budgetInfo.newTotalSpent)}
                </span>
              </div>
            </div>

            <p className="text-finance-secondary text-sm">
              Do you want to continue with this transaction?
            </p>
          </div>
        </DialogContent>

        <DialogFooter>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 space-y-2 space-y-reverse sm:space-y-0">
            <Button
              variant="outline"
              onClick={handleBudgetWarningCancel}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              No, Cancel
            </Button>
            <Button
              onClick={handleBudgetWarningConfirm}
              disabled={loading}
              className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              {loading ? "Processing..." : "Yes, Continue"}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    )}
  </>
  );
}
