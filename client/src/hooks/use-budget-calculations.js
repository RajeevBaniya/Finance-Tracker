// Custom hook for budget calculations
// Extracted from budget-context.js for better separation of concerns

import { useMemo } from "react";
import { dataUtils } from "@/lib/data-utils";
import { TRANSACTION_CATEGORIES } from "@/config/stages";

export function useBudgetCalculations(
  records,
  budgets,
  selectedCurrency,
  selectedCategory = null
) {
  const calculations = useMemo(() => {
    if (!records || !budgets) {
      return {
        budgetComparison: [],
        spendingInsights: {},
        availableCategories: TRANSACTION_CATEGORIES,
      };
    }

    // Filter budgets by selected currency
    const currencyBudgets = budgets.filter(
      (budget) => budget.currency === selectedCurrency
    );

    // Calculate budget comparison data
    const budgetComparison = dataUtils.calculateBudgetComparison(
      records,
      currencyBudgets
    );

    // Calculate spending insights
    const spendingInsights = dataUtils.calculateSpendingInsights(
      records,
      currencyBudgets,
      selectedCategory
    );

    // Get available categories (categories that don't have budgets yet)
    const availableCategories = TRANSACTION_CATEGORIES.filter(
      (category) =>
        !currencyBudgets.some(
          (budget) =>
            budget.category.toLowerCase() === category.value.toLowerCase()
        )
    );

    return {
      budgetComparison,
      spendingInsights,
      availableCategories,
      currencyBudgets,
    };
  }, [records, budgets, selectedCurrency, selectedCategory]);

  return calculations;
}
