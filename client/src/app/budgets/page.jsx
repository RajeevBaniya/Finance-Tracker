"use client";

import { BudgetForm } from "@/components/budgets/budget-form";
import { BudgetList } from "@/components/budgets/budget-list";
import { BudgetComparisonChart } from "@/components/budgets/budget-comparison-chart";
import { SpendingInsights } from "@/components/budgets/spending-insights";
import { CurrencySelector } from "@/components/ui/currency-selector";
import { useState } from "react";

export default function BudgetsPage() {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900"></h1>
        </div>
        {/* Currency selector - always visible, responsive positioning */}
        <div className="flex-shrink-0">
          <CurrencySelector />
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
