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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmationDialog } from "@/components/ui/dialog";
import { Edit2, Trash2, Check, X, Target } from "lucide-react";

export function BudgetList() {
  const { budgets, updateBudget, deleteBudget } = useBudget();
  const { formatCurrency } = useFinancial();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    budgetId: null,
    loading: false,
  });

  // Validate edit form
  const validateEdit = (amount) => {
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
    if (!validateEdit(editForm.amount)) {
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
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Budgets
          </CardTitle>
          <CardDescription>Manage your category budgets</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-finance-lightText mb-2">No budgets set</p>
            <p className="text-sm text-gray-400">
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
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Your Budgets
          </CardTitle>
          <CardDescription>
            {budgets.length} budget{budgets.length !== 1 ? "s" : ""} active
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block rounded-md border">
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
                              validateEdit(value);
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
                      <span className="text-sm text-finance-lightText">
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
                              variant="outline"
                              onClick={() => saveEdit(budget._id)}
                              disabled={!!editErrors.amount}
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

          {/* Mobile Card View (show only on screens smaller than lg) */}
          <div className="lg:hidden md:block md:space-y-4 space-y-4">
            {budgets.map((budget) => (
              <div
                key={budget._id}
                className="bg-finance-card border border-finance-border rounded-lg p-4 shadow-sm text-finance-lightText"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span>{getCategoryDetails(budget.category).icon}</span>
                    <span className="font-medium">
                      {getCategoryDetails(budget.category).label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingId === budget._id ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => saveEdit(budget._id)}
                          disabled={!!editErrors.amount}
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
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-finance-lightText">
                      Budget Amount:
                    </span>
                    {editingId === budget._id ? (
                      <div className="flex-1 ml-4">
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
                            validateEdit(value);
                          }}
                          className={`w-full ${
                            editErrors.amount ? "border-red-500" : ""
                          }`}
                          placeholder="Enter budget amount"
                        />
                        {editErrors.amount && (
                          <p className="text-xs text-red-500 mt-1">
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
                    <span className="text-sm text-finance-lightText">
                      Month/Year:
                    </span>
                    <span className="text-sm text-finance-lightText">
                      {budget.month || new Date().getMonth() + 1}/
                      {budget.year || new Date().getFullYear()}
                    </span>
                  </div>
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
