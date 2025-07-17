"use client";

import React, { useState } from "react";
import { useBudget } from "@/features/budget";
import { useFinancial } from "@/features/financial";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmationDialog } from "@/components/ui/dialog";
import { CurrencySelector } from "@/components/ui/currency-selector";
import { Edit2, Trash2, Check, X, Target } from "lucide-react";

export function BudgetList() {
  const { budgets, updateBudget, deleteBudget } = useBudget();
  const { formatCurrency, totalAmount } = useFinancial();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    budgetId: null,
    loading: false,
  });

  // Validate edit form
  const validateEdit = (amount, budgetId = null) => {
    const newErrors = {};

    // Enhanced amount validation
    if (!amount || amount.trim() === "") {
      newErrors.amount = "Budget amount is required";
    } else {
      // Check for invalid number formats like +-7000, --500, ++200, abc123
      const cleanAmount = amount.trim();
      const numberRegex = /^\d+(\.\d{1,2})?$/; // Only allow positive numbers for budgets

      if (!numberRegex.test(cleanAmount)) {
        newErrors.amount = "Please enter a valid positive number";
      } else {
        const parsedAmount = parseFloat(cleanAmount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
          newErrors.amount = "Budget amount must be greater than zero";
        } else if (parsedAmount > 999999999) {
          newErrors.amount = "Budget amount is too large";
        } else if (budgetId) {
          // For editing: calculate available funds including current budget amount
          const currentBudget = budgets.find((b) => b._id === budgetId);
          const currentBudgetAmount = currentBudget ? currentBudget.amount : 0;
          const availableForEdit = totalAmount + currentBudgetAmount;

          if (parsedAmount > availableForEdit) {
            newErrors.amount = `Budget amount exceeds available funds. You have ${formatCurrency(
              availableForEdit
            )} available (including current budget) but trying to budget ${formatCurrency(
              parsedAmount
            )}.`;
          }
        }
      }
    }

    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Start editing a budget
  const startEdit = (budget) => {
    setEditingId(budget._id);
    setEditForm({
      amount: budget.amount !== null ? budget.amount.toString() : "0",
    });
    setEditErrors({});
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setEditErrors({});
  };

  // Save changes
  const saveEdit = async (budgetId) => {
    if (!validateEdit(editForm.amount, budgetId)) {
      return;
    }

    // Find the original budget to get category, month, year
    const originalBudget = budgets.find((b) => b._id === budgetId);

    try {
      await updateBudget(budgetId, {
        amount: parseFloat(editForm.amount),
        category: originalBudget.category,
        month: originalBudget.month,
        year: originalBudget.year,
      });
      setEditingId(null);
      setEditForm({});
      setEditErrors({});
    } catch (error) {
      console.error("Error updating budget:", error);
    }
  };

  // Show delete confirmation dialog
  const handleDelete = (budgetId) => {
    setDeleteDialog({
      isOpen: true,
      budgetId: budgetId,
      loading: false,
    });
  };

  // Confirm delete
  const confirmDelete = async () => {
    setDeleteDialog((prev) => ({ ...prev, loading: true }));
    try {
      await deleteBudget(deleteDialog.budgetId);
      setDeleteDialog({
        isOpen: false,
        budgetId: null,
        loading: false,
      });
    } catch (error) {
      console.error("Error deleting budget:", error);
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
      alert("Failed to delete budget. Please try again.");
    }
  };

  // Close delete dialog
  const closeDeleteDialog = () => {
    if (!deleteDialog.loading) {
      setDeleteDialog({
        isOpen: false,
        budgetId: null,
        loading: false,
      });
    }
  };

  // Get category details
  const getCategoryDetails = (categoryValue) => {
    return (
      TRANSACTION_CATEGORIES.find((cat) => cat.value === categoryValue) || {
        label: categoryValue,
        icon: "📝",
        color: "#6b7280",
      }
    );
  };

  if (!budgets || budgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-3 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Your Budgets
                </CardTitle>
                <CardDescription>Manage your category budgets</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-black mb-2">No budgets set</p>
            <p className="text-sm text-gray-600">
              Create your first budget to start tracking spending
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-3 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Your Budgets
                </CardTitle>
                <CardDescription>
                  {budgets.length} budget{budgets.length !== 1 ? "s" : ""}{" "}
                  active
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden lg:block rounded-md border border-gray-400">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Budget Amount</TableHead>
                  <TableHead>Month/Year</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgets.map((budget) => (
                  <TableRow key={budget._id}>
                    {/* Category */}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getCategoryDetails(budget.category).icon}</span>
                        <span className="font-medium">
                          {getCategoryDetails(budget.category).label}
                        </span>
                      </div>
                    </TableCell>

                    {/* Budget Amount */}
                    <TableCell>
                      {editingId === budget._id ? (
                        <div className="space-y-1">
                          <Input
                            type="text"
                            value={editForm.amount}
                            onChange={(e) => {
                              const value = e.target.value;
                              setEditForm((prev) => ({
                                ...prev,
                                amount: value,
                              }));
                              // Real-time validation
                              validateEdit(value, budget._id);
                            }}
                            className={`w-full ${
                              editErrors.amount ? "border-red-500" : ""
                            }`}
                            placeholder="Enter budget amount"
                          />
                          {editErrors.amount && (
                            <p className="text-xs text-red-500">
                              {editErrors.amount}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="font-semibold text-blue-600">
                          {formatCurrency(
                            budget.amount !== null ? budget.amount : 0
                          )}
                        </span>
                      )}
                    </TableCell>

                    {/* Month/Year */}
                    <TableCell>
                      <span className="text-sm text-black">
                        {budget.month || new Date().getMonth() + 1}/
                        {budget.year || new Date().getFullYear()}
                      </span>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {editingId === budget._id ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => saveEdit(budget._id)}
                              disabled={!!editErrors.amount}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(budget)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(budget._id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden space-y-4">
            {budgets.map((budget) => (
              <div
                key={budget._id}
                className="bg-finance-card border border-gray-300 rounded-lg p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span>{getCategoryDetails(budget.category).icon}</span>
                  <span className="font-medium text-foreground">
                    {getCategoryDetails(budget.category).label}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Budget Amount:
                    </span>
                    {editingId === budget._id ? (
                      <div className="space-y-1 w-1/2">
                        <Input
                          type="text"
                          value={editForm.amount}
                          onChange={(e) => {
                            const value = e.target.value;
                            setEditForm((prev) => ({
                              ...prev,
                              amount: value,
                            }));
                            validateEdit(value, budget._id);
                          }}
                          className={`w-full ${
                            editErrors.amount ? "border-red-500" : ""
                          }`}
                          placeholder="Enter budget amount"
                        />
                        {editErrors.amount && (
                          <p className="text-xs text-red-500">
                            {editErrors.amount}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(
                          budget.amount !== null ? budget.amount : 0
                        )}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Month/Year:
                    </span>
                    <span className="text-sm">
                      {budget.month || new Date().getMonth() + 1}/
                      {budget.year || new Date().getFullYear()}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  {editingId === budget._id ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => saveEdit(budget._id)}
                        disabled={!!editErrors.amount}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={cancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEdit(budget)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(budget._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Budget"
        message="Are you sure you want to delete this budget? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        loading={deleteDialog.loading}
      />
    </>
  );
}
