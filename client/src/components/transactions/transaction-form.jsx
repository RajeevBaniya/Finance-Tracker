"use client";

import { useState, useEffect } from "react";
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
  const { addRecord, selectedCurrency } = useFinancial();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
    category: "",
    paymentMethod: "",
    currency: selectedCurrency,
  });

  // Update form currency when selected currency changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, currency: selectedCurrency }));
  }, [selectedCurrency]);

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
        currency: selectedCurrency,
      });
    } catch (error) {
      console.error("Error adding transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
        <CardDescription>Record a new financial transaction</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              type="text"
              placeholder="Enter transaction description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              className={errors.date ? "border-red-500" : ""}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date}</p>
            )}
          </div>

          {/* Amount with Currency */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex gap-2">
              {/* Currency Selector */}
              <Select
                value={formData.currency}
                onValueChange={(value) => handleInputChange("currency", value)}
              >
                <SelectTrigger className="w-[100px] sm:w-[120px]">
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
              <p className="text-sm text-red-500">
                {errors.amount || errors.currency}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value)}
            >
              <SelectTrigger
                className={errors.category ? "border-red-500" : ""}
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
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) =>
                handleInputChange("paymentMethod", value)
              }
            >
              <SelectTrigger
                className={errors.paymentMethod ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentMethod && (
              <p className="text-sm text-red-500">{errors.paymentMethod}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Transaction...
              </>
            ) : (
              "Add Transaction"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
