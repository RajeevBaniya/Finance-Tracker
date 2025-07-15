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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConfirmationDialog } from "@/components/ui/dialog";
import { InlineLoadingSpinner } from "@/components/ui/loading-spinner";
import { CurrencySelector } from "@/components/ui/currency-selector";
import { Edit2, Trash2, Check, X } from "lucide-react";

export function TransactionList() {
  const {
    records,
    updateRecord,
    deleteRecord,
    formatCurrency,
    formatDate,
    loading,
    isReady,
  } = useFinancial();
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    recordId: null,
    loading: false,
  });

  // Start editing a record
  const startEdit = (record) => {
    setEditingId(record._id);
    setEditErrors({});
    setEditForm({
      description: record.description || "",
      amount:
        record.amount !== null && record.amount !== undefined
          ? record.amount.toString()
          : "0",
      category: record.category || "",
      paymentMethod: record.paymentMethod || "",
      currency: record.currency || "USD",
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
    setEditErrors({});
  };

  // Save changes
  const saveEdit = async (recordId) => {
    try {
      // Check if there are any edit errors
      if (editErrors.amount) {
        alert("Please fix the errors before saving");
        return;
      }

      // Validate amount before saving
      const cleanAmount = editForm.amount?.trim() || "0";
      const numberRegex = /^-?\d+(\.\d{1,2})?$/;

      if (!numberRegex.test(cleanAmount)) {
        alert("Please enter a valid number format (e.g., 100, -50, 25.50)");
        return;
      }

      const parsedAmount = parseFloat(cleanAmount);
      if (isNaN(parsedAmount)) {
        alert("Please enter a valid amount");
        return;
      }

      await updateRecord(recordId, {
        description: editForm.description?.trim() || "",
        amount: parsedAmount,
        category: editForm.category || "",
        paymentMethod: editForm.paymentMethod || "",
        currency: editForm.currency || "USD",
      });
      setEditingId(null);
      setEditForm({});
      setEditErrors({});
    } catch (error) {
      console.error("Error updating record:", error);
      alert("Failed to update transaction. Please try again.");
    }
  };

  // Show delete confirmation dialog
  const handleDelete = (recordId) => {
    setDeleteDialog({
      isOpen: true,
      recordId: recordId,
      loading: false,
    });
  };

  // Confirm delete
  const confirmDelete = async () => {
    setDeleteDialog((prev) => ({ ...prev, loading: true }));
    try {
      await deleteRecord(deleteDialog.recordId);
      setDeleteDialog({
        isOpen: false,
        recordId: null,
        loading: false,
      });
    } catch (error) {
      console.error("Error deleting record:", error);
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
      alert("Failed to delete transaction. Please try again.");
    }
  };

  // Close delete dialog
  const closeDeleteDialog = () => {
    setDeleteDialog({
      isOpen: false,
      recordId: null,
      loading: false,
    });
  };

  // Validate amount in edit form
  const validateAmount = (value) => {
    const cleanAmount = value?.trim() || "";
    const numberRegex = /^-?\d+(\.\d{1,2})?$/;

    if (!cleanAmount) {
      return "Amount is required";
    }

    if (!numberRegex.test(cleanAmount)) {
      return "Please enter a valid number (e.g., 100, -50, 25.50)";
    }

    const parsedAmount = parseFloat(cleanAmount);
    if (isNaN(parsedAmount)) {
      return "Please enter a valid amount";
    }

    if (Math.abs(parsedAmount) > 999999999) {
      return "Amount is too large";
    }

    return null;
  };

  // Handle amount change in edit form
  const handleAmountChange = (value) => {
    setEditForm((prev) => ({ ...prev, amount: value }));
    const error = validateAmount(value);
    setEditErrors((prev) => ({ ...prev, amount: error }));
  };

  // Show loading state only when authentication is not ready
  if (!isReady) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-3 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>Loading your transactions...</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <InlineLoadingSpinner text="Preparing your financial data..." />
        </CardContent>
      </Card>
    );
  }

  // Show loading state for data fetching
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-3 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>Loading your transactions...</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <InlineLoadingSpinner text="Fetching your transactions..." />
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!records || records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-3 lg:space-y-0">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div className="flex-1 min-w-0">
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  Manage your financial transactions
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-black mb-2">No transactions found</p>
            <p className="text-sm text-gray-600">
              Start by adding your first transaction above
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
                <CardTitle>Transactions</CardTitle>
                <CardDescription>
                  Manage your financial transactions
                  {records.length > 0 && ` (${records.length} transactions)`}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {records.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-black mb-2">No transactions found</p>
              <p className="text-sm text-gray-600">
                Start by adding your first transaction above
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border border-gray-400">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black font-semibold">
                      Description
                    </TableHead>
                    <TableHead className="text-black font-semibold">
                      Amount
                    </TableHead>
                    <TableHead className="text-black font-semibold">
                      Category
                    </TableHead>
                    <TableHead className="text-black font-semibold">
                      Payment Method
                    </TableHead>
                    <TableHead className="text-black font-semibold">
                      Date
                    </TableHead>
                    <TableHead className="text-black font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record._id}>
                      {editingId === record._id ? (
                        // Edit mode
                        <>
                          <TableCell>
                            <Input
                              value={editForm.description || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                              placeholder="Description"
                              className="min-w-[120px]"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <Input
                                value={editForm.amount || ""}
                                onChange={(e) =>
                                  handleAmountChange(e.target.value)
                                }
                                placeholder="0.00"
                                className={`min-w-[100px] ${
                                  editErrors.amount ? "border-red-500" : ""
                                }`}
                              />
                              {editErrors.amount && (
                                <p className="text-xs text-red-500">
                                  {editErrors.amount}
                                </p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={editForm.category || ""}
                              onValueChange={(value) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  category: value,
                                }))
                              }
                            >
                              <SelectTrigger className="min-w-[120px]">
                                <SelectValue placeholder="Category" />
                              </SelectTrigger>
                              <SelectContent>
                                {TRANSACTION_CATEGORIES.map((category) => (
                                  <SelectItem
                                    key={category.value}
                                    value={category.value}
                                  >
                                    {category.icon} {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={editForm.paymentMethod || ""}
                              onValueChange={(value) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  paymentMethod: value,
                                }))
                              }
                            >
                              <SelectTrigger className="min-w-[140px]">
                                <SelectValue placeholder="Payment Method" />
                              </SelectTrigger>
                              <SelectContent>
                                {PAYMENT_METHODS.map((method) => (
                                  <SelectItem
                                    key={method.value}
                                    value={method.value}
                                  >
                                    {method.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              value={
                                record.date
                                  ? new Date(record.date)
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
                              className="min-w-[140px]"
                              readOnly
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => saveEdit(record._id)}
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
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        // View mode
                        <>
                          <TableCell className="font-medium text-black">
                            {record.description}
                          </TableCell>
                          <TableCell>
                            <span
                              className={
                                record.amount >= 0
                                  ? "text-green-600 font-semibold"
                                  : "text-red-600 font-semibold"
                              }
                            >
                              {formatCurrency(record.amount)}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center text-black">
                              {
                                TRANSACTION_CATEGORIES.find(
                                  (cat) => cat.value === record.category
                                )?.icon
                              }{" "}
                              {
                                TRANSACTION_CATEGORIES.find(
                                  (cat) => cat.value === record.category
                                )?.label
                              }
                            </span>
                          </TableCell>
                          <TableCell className="text-black">
                            {
                              PAYMENT_METHODS.find(
                                (method) =>
                                  method.value === record.paymentMethod
                              )?.label
                            }
                          </TableCell>
                          <TableCell className="text-black">
                            {formatDate(record.date)}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(record)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(record._id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        loading={deleteDialog.loading}
      />
    </>
  );
}
