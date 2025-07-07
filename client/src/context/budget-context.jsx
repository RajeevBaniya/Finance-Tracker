"use client";

import { createContext, useContext, useEffect } from "react";
import { useFinancial } from "./financial-context.jsx";
import { useBudgetData } from "@/hooks/use-budget-data";
import { useBudgetCalculations } from "@/hooks/use-budget-calculations";

const BudgetContext = createContext(undefined);

export const BudgetProvider = ({ children }) => {
  // Get financial data for calculations
  const { records, selectedCurrency } = useFinancial();

  // Use custom hooks for budget data and calculations
  const {
    budgets: allBudgets,
    loading,
    error,
    fetchBudgets,
    addBudget: addBudgetAPI,
    updateBudget: updateBudgetAPI,
    deleteBudget: deleteBudgetAPI,
    getBudgetForCategory,
  } = useBudgetData();

  const {
    budgetComparison,
    spendingInsights,
    availableCategories,
    currencyBudgets,
  } = useBudgetCalculations(records, allBudgets, selectedCurrency);

  // Enhanced add budget function that includes currency
  const addBudget = async (budget) => {
    const budgetWithCurrency = { ...budget, currency: selectedCurrency };
    return await addBudgetAPI(budgetWithCurrency);
  };

  // Load budgets on mount
  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const contextValue = {
    // Data
    budgets: currencyBudgets,
    allBudgets,
    loading,
    error,

    // Computed values from calculations hook
    budgetComparison,
    spendingInsights,
    availableCategories,

    // Actions
    addBudget,
    updateBudget: updateBudgetAPI,
    deleteBudget: deleteBudgetAPI,
    fetchBudgets,
    getBudgetForCategory: (category) =>
      getBudgetForCategory(category, selectedCurrency),
  };

  return (
    <BudgetContext.Provider value={contextValue}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }
  return context;
};
