"use client";

import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionList } from "@/components/transactions/transaction-list";
import { CurrencySelector } from "@/components/ui/currency-selector";

export default function TransactionsPage() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Responsive layout */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900"></h1>
        </div>
        {/* Currency selector - always visible, responsive positioning */}
        <div className="flex-shrink-0">
          <CurrencySelector />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Transaction Form - Takes 4 columns on large screens */}
        <div className="lg:col-span-4 w-full">
          <TransactionForm />
        </div>

        {/* Transaction List - Takes 8 columns on large screens */}
        <div className="lg:col-span-8 w-full">
          <TransactionList />
        </div>
      </div>
    </div>
  );
}
