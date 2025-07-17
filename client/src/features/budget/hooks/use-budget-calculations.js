// Hook for budget calculations and analytics

import { useMemo } from "react";
import { dataUtils } from "@/shared/utils/data-utils";
import { TRANSACTION_CATEGORIES } from "@/config/stages";

export function useBudgetCalculations(
  records,
  budgets,
  selectedCurrency,
  selectedCategory = null,
  selectedMonth,
  selectedYear
) {
  const calculations = useMemo(() => {
    if (!records || !budgets) {
      return {
        budgetComparison: [],
        spendingInsights: {},
        availableCategories: TRANSACTION_CATEGORIES,
      };
    }

    // Filter budgets by selected currency, month, and year
    const currencyBudgets = budgets.filter((budget) => {
      // Filter by currency
      if (budget.currency !== selectedCurrency) return false;

      // Filter by selected month and year
      // Convert month from 1-12 to 0-11 for comparison with selectedMonth (which is 0-11)
      const budgetMonth = (budget.month || new Date().getMonth() + 1) - 1;
      const budgetYear = budget.year || new Date().getFullYear();

      return budgetMonth === selectedMonth && budgetYear === selectedYear;
    });

    // Also keep all currency budgets for comparison calculations (unfiltered by month)
    const allCurrencyBudgets = budgets.filter(
      (budget) => budget.currency === selectedCurrency
    );

    // Calculate budget comparison data (use all currency budgets for comparison)
    const budgetComparison = dataUtils.calculateBudgetComparison(
      records,
      allCurrencyBudgets,
      selectedMonth,
      selectedYear
    );

    // Calculate spending insights (use all currency budgets for insights)
    const spendingInsights = dataUtils.calculateSpendingInsights(
      records,
      allCurrencyBudgets,
      selectedCategory,
      selectedMonth,
      selectedYear
    );

    // Get available categories (categories that don't have budgets yet for current month)
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
  }, [
    records,
    budgets,
    selectedCurrency,
    selectedCategory,
    selectedMonth,
    selectedYear,
  ]);

  return calculations;
}
