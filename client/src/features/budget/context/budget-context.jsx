
"use client";

import { createContext, useContext, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useFinancial } from "../../financial/context/financial-context.jsx";
import { useBudgetData } from "../hooks/use-budget-data";
import { useBudgetCalculations } from "../hooks/use-budget-calculations";

const BudgetContext = createContext(undefined);

export const BudgetProvider = ({ children }) => {
  const { userId, isLoaded } = useAuth();
  const { records, selectedCurrency, selectedMonth, selectedYear } =
    useFinancial();
  const [selectedCategory, setSelectedCategory] = useState(null);
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
    selectedCategory,
    selectedMonth,
    selectedYear
  );
  const addBudget = async (budget) => {
    const budgetWithCurrency = { ...budget, currency: selectedCurrency };
    return await addBudgetAPI(budgetWithCurrency);
  };
  const overallLoading = !isLoaded || (isLoaded && userId && loading);

  const contextValue = {
    budgets: currencyBudgets,
    allBudgets,
    loading: overallLoading,
    error,
    selectedCategory,
    setSelectedCategory,
    budgetComparison,
    spendingInsights,
    availableCategories,
    addBudget,
    updateBudget: updateBudgetAPI,
    deleteBudget: deleteBudgetAPI,
    fetchBudgets,
    getBudgetForCategory: (category) =>
      getBudgetForCategory(category, selectedCurrency),
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
