"use client";

import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionList } from "@/components/transactions/transaction-list";
import { CurrencySelector } from "@/components/ui/currency-selector";

export default function TransactionsPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive layout */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Transactions
          </h1>
        </div>
        <div className="self-start sm:self-auto">
          <CurrencySelector />
        </div>
      </div>

      {/* Form and List Layout - Responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Transaction Form */}
        <div className="lg:col-span-1 order-1 lg:order-1">
          <TransactionForm />
        </div>

        {/* Transaction List */}
        <div className="lg:col-span-3 order-2 lg:order-2">
          <TransactionList />
        </div>
      </div>
    </div>
  );
}
