"use client";

import { createContext, useContext, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useFinancial } from "./financial-context.jsx";
import { useBudgetData } from "@/hooks/use-budget-data";
import { useBudgetCalculations } from "@/hooks/use-budget-calculations";

const BudgetContext = createContext(undefined);

export const BudgetProvider = ({ children }) => {
  const { userId, isLoaded } = useAuth();
  const { records, selectedCurrency } = useFinancial();
  const [selectedCategory, setSelectedCategory] = useState(null);

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
  } = useBudgetCalculations(
    records,
    allBudgets,
    selectedCurrency,
    selectedCategory
  );

  // Enhanced add budget function - use the selected currency from context
  const addBudget = async (budget) => {
    // Use the currently selected currency for new budgets
    const budgetWithCurrency = { ...budget, currency: selectedCurrency };
    return await addBudgetAPI(budgetWithCurrency);
  };

  // Show overall loading state when user is not loaded or when budget data is loading
  const overallLoading = !isLoaded || (isLoaded && userId && loading);

  const contextValue = {
    // Data
    budgets: currencyBudgets,
    allBudgets,
    loading: overallLoading,
    error,

    // Category selection
    selectedCategory,
    setSelectedCategory,

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

    // Status helpers
    isAuthenticated: !!userId,
    isReady: isLoaded,
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
