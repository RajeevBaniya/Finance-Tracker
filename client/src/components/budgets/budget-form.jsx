"use client";

import React, { useState, useEffect } from "react";
import { useBudget } from "@/features/budget/context/budget-context";
import { useFinancial } from "@/features/financial/context/financial-context";
import { TRANSACTION_CATEGORIES } from "@/config/stages";
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
import { PlusCircle } from "lucide-react";

export function BudgetForm() {
  const { addBudget, availableCategories, budgets, budgetComparison } = useBudget();
  const { formatCurrency, allTimeData } = useFinancial();

  // Use all-time data for budget validation (budgets should be based on overall available funds)
  const { totalAmount, totalIncome, totalExpenses } = allTimeData;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [availableBudget, setAvailableBudget] = useState(totalAmount);

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
  });

  // Calculate available budget based on both planned budgets and actual spending
  useEffect(() => {
    // Start with Total Income as Net Savings
    let availableFunds = totalIncome;

    // Get current month and year
    const currentMonth = new Date().getMonth() + 1; // 1-12
    const currentYear = new Date().getFullYear();

    // Process each budget category
    budgets.forEach((budget) => {
      if (budget.month === currentMonth && budget.year === currentYear) {
        // Find actual spending for this category
        const categorySpending = budgetComparison.find(
          (comp) => comp.category === budget.category
        );

        if (categorySpending && categorySpending.spent > 0) {
          // Subtract actual spending (whether it exceeds budget or not)
          availableFunds -= categorySpending.spent;
        } else {
          // No spending yet, subtract the planned budget amount
          availableFunds -= budget.amount;
        }
      }
    });

    // Available budget reflects both planned allocations and actual spending
    setAvailableBudget(availableFunds);
  }, [totalIncome, budgets, budgetComparison]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) {
      newErrors.category = "Please select a category";
    } else {
      // Check for duplicate budget
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const existingBudget = budgets.find(
        (budget) =>
          budget.category === formData.category &&
          budget.month === currentMonth &&
          budget.year === currentYear
      );

      if (existingBudget) {
        newErrors.category =
          "A budget for this category already exists for the current month";
      }
    }

    // Enhanced amount validation
    if (!formData.amount || formData.amount.trim() === "") {
      newErrors.amount = "Budget amount is required";
    } else {
      // Check for invalid number formats like +-7000, --500, ++200, abc123
      const cleanAmount = formData.amount.trim();
      const numberRegex = /^\d+(\.\d{1,2})?$/; // Only allow positive numbers for budgets

      if (!numberRegex.test(cleanAmount)) {
        newErrors.amount =
          "Please enter a valid positive number (e.g., 100, 25.50)";
      } else {
        const parsedAmount = parseFloat(cleanAmount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
          newErrors.amount = "Budget amount must be greater than zero";
        } else if (parsedAmount > 999999999) {
          newErrors.amount = "Budget amount is too large";
        } else if (parsedAmount > availableBudget) {
          // Check if budget amount exceeds available funds
          newErrors.amount = `Budget amount exceeds available funds. You have ${formatCurrency(
            availableBudget
          )} available but trying to budget ${formatCurrency(parsedAmount)}.`;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      await addBudget({
        category: formData.category,
        amount: parseFloat(formData.amount),
        month: new Date().getMonth() + 1, // Current month (1-12)
        year: new Date().getFullYear(),
      });

      // No need to update available budget as it's now tied directly to totalAmount

      // Reset form
      setFormData({ category: "", amount: "" });
      setErrors({});
    } catch (error) {
      console.error("Error adding budget:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const getCategoryDetails = (categoryValue) => {
    return (
      TRANSACTION_CATEGORIES.find((cat) => cat.value === categoryValue) || {
        label: categoryValue,
        icon: "📝",
      }
    );
  };

  // Check if user has any income before allowing budget creation
  if (!totalIncome || totalIncome <= 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Set Budget
          </CardTitle>
          <CardDescription>Add income before creating budgets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">No income found</p>
            <p className="text-xs text-gray-500 mb-4">
              You need to add at least one deposit (income) transaction before
              you can create budgets.
            </p>
            <p className="text-xs text-blue-600">
              Go to Transactions → Add Transaction → Select "Deposit" → Add your
              income
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if user has available money left for budgeting after expenses
  if (totalAmount <= 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Set Budget
          </CardTitle>
          <CardDescription>No available funds for budgeting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-sm text-gray-700 mb-2">No funds available</p>
            <p className="text-xs text-gray-500 mb-3">
              Your current balance is {formatCurrency(totalAmount)}. You've
              spent all your income.
            </p>
            <div className="text-xs bg-gray-50 p-3 rounded-lg border mb-4">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Total Income:</span>
                  <span className="text-green-600">
                    {formatCurrency(totalIncome)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Expenses:</span>
                  <span className="text-red-600">
                    {formatCurrency(totalExpenses)}
                  </span>
                </div>
                <div className="flex justify-between font-medium border-t pt-1">
                  <span>Available for Budget:</span>
                  <span
                    className={
                      totalAmount > 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-xs text-blue-600">
              Add more income (deposits) to create budgets
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (availableCategories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Set Budget
          </CardTitle>
          <CardDescription>
            All categories already have budgets set
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            You have set budgets for all available categories. You can edit
            existing budgets in the list below.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <PlusCircle className="h-5 w-5" />
          Set Budget
        </CardTitle>
        <CardDescription className="text-sm">
          Create a monthly budget for a category
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="budget-category"
                className="text-sm font-medium text-black"
              >
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange("category", value)}
                name="category"
              >
                <SelectTrigger
                  id="budget-category"
                  className={`h-10 ${errors.category ? "border-red-500" : ""}`}
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((category) => (
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
                <p className="text-xs text-red-500">{errors.category}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="budget-amount"
                className="text-sm font-medium text-black"
              >
                Monthly Budget Amount
              </Label>
              <Input
                id="budget-amount"
                name="amount"
                type="text"
                placeholder="Enter budget amount"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className={`h-10 ${errors.amount ? "border-red-500" : ""}`}
              />

              {/* Available Funds Info - Always show this */}
              <div className="flex items-center justify-between text-xs bg-blue-50 p-2 rounded border border-blue-200">
                <span className="text-blue-700">Available for Budget:</span>
                <span className="font-semibold text-blue-800">
                  {formatCurrency(availableBudget)}
                </span>
              </div>

              {errors.amount && (
                <p className="text-xs text-red-500">{errors.amount}</p>
              )}
            </div>
          </div>

          {formData.amount && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-sm font-medium text-blue-800">
                Budget Preview:
              </span>
              <span className="text-sm font-semibold text-blue-900">
                {formatCurrency(parseFloat(formData.amount) || 0)}
              </span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={
                loading ||
                !formData.category ||
                !formData.amount ||
                Object.keys(errors).some((key) => errors[key])
              }
              className="px-6 py-2 h-10 text-sm font-medium transition-all duration-200"
            >
              {loading ? "Creating Budget..." : "Create Budget"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}