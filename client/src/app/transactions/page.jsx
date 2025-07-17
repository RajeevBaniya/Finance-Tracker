"use client";

import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionList } from "@/components/transactions/transaction-list";
import { CurrencySelector } from "@/components/ui/currency-selector";
import { MonthPicker } from "@/components/ui/month-picker";
import { useFinancial } from "@/features/financial";

export default function TransactionsPage() {
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } =
    useFinancial();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Month Picker and Currency Selector */}
      <div className="flex flex-col sm:flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
        <h1 className="text-2xl font-bold text-gray-900 flex-shrink-0">
          Transactions
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between lg:justify-end gap-3">
          <div className="w-auto sm:w-48">
            <MonthPicker
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />
          </div>
          <div className="flex-shrink-0">
            <CurrencySelector />
          </div>
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
