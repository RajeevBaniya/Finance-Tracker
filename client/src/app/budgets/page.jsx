"use client";

import { BudgetForm } from "@/components/budgets/budget-form";
import { BudgetList } from "@/components/budgets/budget-list";
import { BudgetComparisonChart } from "@/components/budgets/budget-comparison-chart";
import { SpendingInsights } from "@/components/budgets/spending-insights";
import { CurrencySelector } from "@/components/ui/currency-selector";
import { MonthPicker } from "@/components/ui/month-picker";
import { useFinancial } from "@/features/financial";
import { useState } from "react";

export default function BudgetsPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { selectedMonth, selectedYear, setSelectedMonth, setSelectedYear } =
    useFinancial();

  return (
    <div className="space-y-6">
      {/* Header with Month Picker and Currency Selector */}
      <div className="flex flex-col sm:flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
        <h1 className="text-2xl font-bold text-gray-900 flex-shrink-0">
          Budgets
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

      {/* Form and Chart Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Budget Form - Left Column */}
        <div className="xl:col-span-1 space-y-6">
          <BudgetForm />
          <BudgetList />
        </div>

        {/* Budget Comparison Chart - Right Column */}
        <div className="xl:col-span-1">
          <BudgetComparisonChart
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        </div>
      </div>

      {/* Spending Insights - Full Width */}
      <div>
        <SpendingInsights selectedCategory={selectedCategory} />
      </div>
    </div>
  );
}
