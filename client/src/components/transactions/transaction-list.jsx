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
import { Edit2, Trash2, Check, X } from "lucide-react";

export function TransactionList() {
  const {
    records,
    updateRecord,
    deleteRecord,
    formatCurrency,
    formatDate,
    loading,
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
    if (!deleteDialog.loading) {
      setDeleteDialog({
        isOpen: false,
        recordId: null,
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

  // Get payment method label
  const getPaymentMethodLabel = (value) => {
    return (
      PAYMENT_METHODS.find((method) => method.value === value)?.label || value
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Loading your transactions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!records || records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>Your transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-finance-lightText mb-2">No transactions found</p>
            <p className="text-sm text-gray-400">
              Add your first transaction to get started
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
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            {records.length} transaction{records.length !== 1 ? "s" : ""} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Mobile Card Layout */}
          <div className="block sm:hidden space-y-3">
            {records.map((record) => (
              <div key={record._id} className="p-4 border rounded-lg space-y-3">
                {/* Top Row - Description and Actions */}
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    {editingId === record._id ? (
                      <Input
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="text-sm"
                        placeholder="Description"
                      />
                    ) : (
                      <h3 className="font-medium text-sm truncate">
                        {record.description}
                      </h3>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(record.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {editingId === record._id ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => saveEdit(record._id)}
                          className="h-8 w-8 p-0"
                          disabled={Object.keys(editErrors).some(
                            (key) => editErrors[key]
                          )}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(record)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(record._id)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="text-xs text-gray-500">Amount</label>
                  {editingId === record._id ? (
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
                          const numberRegex = /^-?\d+(\.\d{1,2})?$/;
                          if (value.trim() === "") {
                            setEditErrors((prev) => ({
                              ...prev,
                              amount: "Amount is required",
                            }));
                          } else if (!numberRegex.test(value.trim())) {
                            setEditErrors((prev) => ({
                              ...prev,
                              amount: "Invalid format",
                            }));
                          } else {
                            setEditErrors((prev) => ({
                              ...prev,
                              amount: null,
                            }));
                          }
                        }}
                        className={`text-sm ${
                          editErrors.amount ? "border-red-500" : ""
                        }`}
                        placeholder="Enter amount"
                      />
                      {editErrors.amount && (
                        <p className="text-xs text-red-500">
                          {editErrors.amount}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p
                      className={`font-semibold text-sm ${
                        record.amount >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(record.amount)}
                    </p>
                  )}
                </div>

                {/* Category and Payment Method Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Category</label>
                    {editingId === record._id ? (
                      <Select
                        value={editForm.category}
                        onValueChange={(value) =>
                          setEditForm((prev) => ({
                            ...prev,
                            category: value,
                          }))
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {TRANSACTION_CATEGORIES.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
                              <span className="flex items-center gap-2">
                                <span>{category.icon}</span>
                                {category.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-1 text-sm">
                        <span>{getCategoryDetails(record.category).icon}</span>
                        <span className="truncate">
                          {getCategoryDetails(record.category).label}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Payment</label>
                    {editingId === record._id ? (
                      <Select
                        value={editForm.paymentMethod}
                        onValueChange={(value) =>
                          setEditForm((prev) => ({
                            ...prev,
                            paymentMethod: value,
                          }))
                        }
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_METHODS.map((method) => (
                            <SelectItem key={method.value} value={method.value}>
                              {method.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm truncate">
                        {getPaymentMethodLabel(record.paymentMethod)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Payment Method
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    Currency
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record._id}>
                    {/* Description */}
                    <TableCell>
                      {editingId === record._id ? (
                        <Input
                          value={editForm.description}
                          onChange={(e) =>
                            setEditForm((prev) => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          className="w-full"
                        />
                      ) : (
                        <div className="font-medium">{record.description}</div>
                      )}
                    </TableCell>

                    {/* Amount */}
                    <TableCell>
                      {editingId === record._id ? (
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
                              const numberRegex = /^-?\d+(\.\d{1,2})?$/;
                              if (value.trim() === "") {
                                setEditErrors((prev) => ({
                                  ...prev,
                                  amount: "Amount is required",
                                }));
                              } else if (!numberRegex.test(value.trim())) {
                                setEditErrors((prev) => ({
                                  ...prev,
                                  amount:
                                    "Invalid format (e.g., 100, -50, 25.50)",
                                }));
                              } else {
                                setEditErrors((prev) => ({
                                  ...prev,
                                  amount: null,
                                }));
                              }
                            }}
                            className={`w-full ${
                              editErrors.amount ? "border-red-500" : ""
                            }`}
                            placeholder="Enter amount"
                          />
                          {editErrors.amount && (
                            <p className="text-xs text-red-500">
                              {editErrors.amount}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span
                          className={`font-semibold ${
                            record.amount >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {formatCurrency(record.amount)}
                        </span>
                      )}
                    </TableCell>

                    {/* Category */}
                    <TableCell>
                      {editingId === record._id ? (
                        <Select
                          value={editForm.category}
                          onValueChange={(value) =>
                            setEditForm((prev) => ({
                              ...prev,
                              category: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TRANSACTION_CATEGORIES.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                <span className="flex items-center gap-2">
                                  <span>{category.icon}</span>
                                  {category.label}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>
                            {getCategoryDetails(record.category).icon}
                          </span>
                          <span>
                            {getCategoryDetails(record.category).label}
                          </span>
                        </div>
                      )}
                    </TableCell>

                    {/* Payment Method */}
                    <TableCell className="hidden md:table-cell text-finance-lightText">
                      {editingId === record._id ? (
                        <Select
                          value={editForm.paymentMethod}
                          onValueChange={(value) =>
                            setEditForm((prev) => ({
                              ...prev,
                              paymentMethod: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
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
                      ) : (
                        <span className="text-sm text-finance-lightText">
                          {getPaymentMethodLabel(record.paymentMethod)}
                        </span>
                      )}
                    </TableCell>

                    {/* Currency */}
                    <TableCell className="hidden lg:table-cell text-finance-lightText">
                      {editingId === record._id ? (
                        <Select
                          value={editForm.currency}
                          onValueChange={(value) =>
                            setEditForm((prev) => ({
                              ...prev,
                              currency: value,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CURRENCIES.map((currency) => (
                              <SelectItem
                                key={currency.value}
                                value={currency.value}
                              >
                                <span className="flex items-center gap-1">
                                  <span>{currency.symbol}</span>
                                  <span>{currency.value}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-sm text-finance-lightText">
                          {record.currency || "USD"}
                        </span>
                      )}
                    </TableCell>

                    {/* Date */}
                    <TableCell className="hidden lg:table-cell text-sm text-finance-lightText">
                      {formatDate(record.date)}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      {editingId === record._id ? (
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => saveEdit(record._id)}
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
                      ) : (
                        <div className="flex gap-1 justify-end">
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
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialog.isOpen}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        loading={deleteDialog.loading}
      />
    </>
  );
}
