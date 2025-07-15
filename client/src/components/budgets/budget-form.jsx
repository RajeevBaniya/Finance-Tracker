"use client";

import { useState } from "react";
import { useBudget } from "@/context/budget-context.jsx";
import { useFinancial } from "@/context/financial-context.jsx";
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
  const { addBudget, availableCategories, budgets } = useBudget();
  const { formatCurrency } = useFinancial();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    category: "",
    amount: "",
  });

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
