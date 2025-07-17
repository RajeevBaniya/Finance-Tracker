"use client";

import React, { useState } from "react";
import { useFinancial } from "@/features/financial";
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
import { Plus, Loader2 } from "lucide-react";

export function TransactionForm() {
  const { addRecord, selectedCurrency } = useFinancial(); // Get global currency
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

  // Removed useEffect that was syncing with selectedCurrency

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    // Enhanced amount validation - only positive numbers allowed
    if (!formData.amount || formData.amount.trim() === "") {
      newErrors.amount = "Amount is required";
    } else {
      // Only allow positive numbers since we handle the sign automatically
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      // Calculate the final amount based on transaction type
      let finalAmount = parseFloat(formData.amount);
      if (formData.transactionType === "expense") {
        finalAmount = -Math.abs(finalAmount); // Ensure it's negative for expenses
      } else {
        finalAmount = Math.abs(finalAmount); // Ensure it's positive for deposits
      }

      const newRecord = {
        date: new Date(formData.date).toISOString(),
        description: formData.description.trim(),
        amount: finalAmount,
        category: formData.category,
        paymentMethod: formData.paymentMethod,
        currency: selectedCurrency, // Use global currency
        fromAccount: formData.fromAccount.trim(),
        toAccount: formData.toAccount.trim(),
      };

      await addRecord(newRecord);

      // Reset form
      setFormData({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        paymentMethod: "",
        transactionType: "deposit", // Reset to default transaction type
        fromAccount: "",
        toAccount: "",
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg sm:text-xl">Add Transaction</CardTitle>
        <CardDescription className="text-sm">
          Record a new financial transaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* Description */}
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

          {/* Date */}
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

          {/* Type and Amount - Single Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Transaction Type */}
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

            {/* Amount */}
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

          {/* From and To - Single Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* From */}
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

            {/* To */}
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

          {/* Category */}
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

          {/* Payment Method */}
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

          {/* Submit Button */}
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
  );
}
