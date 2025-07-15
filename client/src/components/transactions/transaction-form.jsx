"use client";

import { useState } from "react";
import { useFinancial } from "@/context/financial-context.jsx";
import {
  TRANSACTION_CATEGORIES,
  PAYMENT_METHODS,
  CURRENCIES,
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
  const { addRecord } = useFinancial(); // Removed selectedCurrency dependency
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Default currency for the form (independent from global currency)
  const DEFAULT_FORM_CURRENCY = "USD";

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
    category: "",
    paymentMethod: "",
    currency: DEFAULT_FORM_CURRENCY, // Use form's own default currency
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

    // Enhanced amount validation
    if (!formData.amount || formData.amount.trim() === "") {
      newErrors.amount = "Amount is required";
    } else {
      // Check for invalid number formats like +-7000, --500, ++200, abc123
      const cleanAmount = formData.amount.trim();
      const numberRegex = /^-?\d+(\.\d{1,2})?$/; // Only allow valid number formats

      if (!numberRegex.test(cleanAmount)) {
        newErrors.amount =
          "Please enter a valid number (e.g., 100, -50, 25.50)";
      } else {
        const parsedAmount = parseFloat(cleanAmount);
        if (isNaN(parsedAmount) || parsedAmount === 0) {
          newErrors.amount = "Amount cannot be zero or invalid";
        } else if (Math.abs(parsedAmount) > 999999999) {
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

    if (!formData.currency) {
      newErrors.currency = "Please select a currency";
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

      const newRecord = {
        date: new Date(formData.date).toISOString(),
        description: formData.description.trim(),
        amount: parseFloat(formData.amount),
        category: formData.category,
        paymentMethod: formData.paymentMethod,
        currency: formData.currency,
      };

      await addRecord(newRecord);

      // Reset form
      setFormData({
        description: "",
        amount: "",
        date: new Date().toISOString().split("T")[0],
        category: "",
        paymentMethod: "",
        currency: DEFAULT_FORM_CURRENCY, // Reset to form's default currency
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

          {/* Amount with Currency */}
          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-sm font-medium text-black">
              Amount
            </Label>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              {/* Currency Selector */}
              <Select
                value={formData.currency}
                onValueChange={(value) => handleInputChange("currency", value)}
              >
                <SelectTrigger className="w-[90px] sm:w-[120px]">
                  <SelectValue placeholder="Currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency.value} value={currency.value}>
                      <span className="flex items-center gap-2">
                        <span>{currency.symbol}</span>
                        <span>{currency.value}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Amount Input */}
              <Input
                id="amount"
                type="text"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className={`flex-1 ${errors.amount ? "border-red-500" : ""}`}
              />
            </div>
            {(errors.amount || errors.currency) && (
              <p className="text-xs sm:text-sm text-red-500">
                {errors.amount || errors.currency}
              </p>
            )}
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
