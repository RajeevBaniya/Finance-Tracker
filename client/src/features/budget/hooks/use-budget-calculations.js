
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

    const currencyBudgets = budgets.filter((budget) => {

      if (budget.currency !== selectedCurrency) return false;


      const budgetMonth = (budget.month || new Date().getMonth() + 1) - 1;
      const budgetYear = budget.year || new Date().getFullYear();

      return budgetMonth === selectedMonth && budgetYear === selectedYear;
    });

    const allCurrencyBudgets = budgets.filter(
      (budget) => budget.currency === selectedCurrency
    );

    const budgetComparison = dataUtils.calculateBudgetComparison(
      records,
      allCurrencyBudgets,
      selectedMonth,
      selectedYear
    );

    const spendingInsights = dataUtils.calculateSpendingInsights(
      records,
      allCurrencyBudgets,
      selectedCategory,
      selectedMonth,
      selectedYear
    );

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
