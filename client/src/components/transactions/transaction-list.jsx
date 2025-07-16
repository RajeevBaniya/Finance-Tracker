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
      fromAccount: record.fromAccount || "",
      toAccount: record.toAccount || "",
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
        fromAccount: editForm.fromAccount?.trim() || "",
        toAccount: editForm.toAccount?.trim() || "",
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
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black font-semibold min-w-[150px] px-3">
                      Description
                    </TableHead>
                    <TableHead className="text-black font-semibold min-w-[110px] px-2">
                      Amount
                    </TableHead>
                    <TableHead className="text-black font-semibold min-w-[120px] px-2">
                      Category
                    </TableHead>
                    <TableHead className="text-black font-semibold min-w-[130px] px-2">
                      Payment Method
                    </TableHead>
                    <TableHead className="text-black font-semibold min-w-[90px] px-2">
                      From
                    </TableHead>
                    <TableHead className="text-black font-semibold min-w-[90px] px-2">
                      To
                    </TableHead>
                    <TableHead className="text-black font-semibold min-w-[100px] px-2">
                      Date
                    </TableHead>
                    <TableHead className="text-black font-semibold min-w-[90px] px-2 text-center">
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
                          <TableCell className="min-w-[150px] px-3">
                            <Input
                              value={editForm.description || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                              placeholder="Description"
                              className="w-full text-sm h-8"
                            />
                          </TableCell>
                          <TableCell className="min-w-[110px] px-2">
                            <div className="space-y-1">
                              <Input
                                value={editForm.amount || ""}
                                onChange={(e) =>
                                  handleAmountChange(e.target.value)
                                }
                                placeholder="0.00"
                                className={`w-full text-sm h-8 ${
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
                          <TableCell className="min-w-[120px] px-2">
                            <Select
                              value={editForm.category || ""}
                              onValueChange={(value) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  category: value,
                                }))
                              }
                            >
                              <SelectTrigger className="w-full text-sm h-8">
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
                          <TableCell className="min-w-[130px] px-2">
                            <Select
                              value={editForm.paymentMethod || ""}
                              onValueChange={(value) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  paymentMethod: value,
                                }))
                              }
                            >
                              <SelectTrigger className="w-full text-sm h-8">
                                <SelectValue placeholder="Method" />
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
                          <TableCell className="min-w-[90px] px-2">
                            <Input
                              value={editForm.fromAccount || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  fromAccount: e.target.value,
                                }))
                              }
                              placeholder="From"
                              className="w-full text-sm h-8"
                            />
                          </TableCell>
                          <TableCell className="min-w-[90px] px-2">
                            <Input
                              value={editForm.toAccount || ""}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  toAccount: e.target.value,
                                }))
                              }
                              placeholder="To"
                              className="w-full text-sm h-8"
                            />
                          </TableCell>
                          <TableCell className="min-w-[100px] px-2">
                            <Input
                              type="date"
                              value={
                                record.date
                                  ? new Date(record.date)
                                      .toISOString()
                                      .split("T")[0]
                                  : ""
                              }
                              className="w-full text-sm h-8"
                              readOnly
                            />
                          </TableCell>
                          <TableCell className="min-w-[90px] px-2">
                            <div className="flex justify-center gap-1">
                              <Button
                                size="sm"
                                onClick={() => saveEdit(record._id)}
                                className="bg-green-600 hover:bg-green-700 h-7 w-7 p-0"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={cancelEdit}
                                className="h-7 w-7 p-0"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        // View mode
                        <>
                          <TableCell className="font-medium text-black min-w-[150px] px-3">
                            <div className="truncate text-sm">
                              {record.description}
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[110px] px-2">
                            <span
                              className={`text-sm font-semibold ${
                                record.amount >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {formatCurrency(record.amount)}
                            </span>
                          </TableCell>
                          <TableCell className="min-w-[120px] px-2">
                            <span className="inline-flex items-center text-black text-sm">
                              {
                                TRANSACTION_CATEGORIES.find(
                                  (cat) => cat.value === record.category
                                )?.icon
                              }{" "}
                              <span className="truncate ml-1">
                                {
                                  TRANSACTION_CATEGORIES.find(
                                    (cat) => cat.value === record.category
                                  )?.label
                                }
                              </span>
                            </span>
                          </TableCell>
                          <TableCell className="text-black min-w-[130px] px-2">
                            <div className="truncate text-sm">
                              {
                                PAYMENT_METHODS.find(
                                  (method) =>
                                    method.value === record.paymentMethod
                                )?.label
                              }
                            </div>
                          </TableCell>
                          <TableCell className="text-black text-sm min-w-[90px] px-2">
                            <div className="truncate">
                              {record.fromAccount || "-"}
                            </div>
                          </TableCell>
                          <TableCell className="text-black text-sm min-w-[90px] px-2">
                            <div className="truncate">
                              {record.toAccount || "-"}
                            </div>
                          </TableCell>
                          <TableCell className="text-black min-w-[100px] px-2">
                            <div className="text-sm">
                              {formatDate(record.date)}
                            </div>
                          </TableCell>
                          <TableCell className="min-w-[90px] px-2">
                            <div className="flex justify-center gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEdit(record)}
                                className="h-7 w-7 p-0"
                              >
                                <Edit2 className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(record._id)}
                                className="text-red-600 hover:text-red-700 h-7 w-7 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
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
