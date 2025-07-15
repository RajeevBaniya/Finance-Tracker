// Custom hook for financial calculations
// Extracted from financial-context.js for better separation of concerns

import { useMemo } from "react";
import { dataUtils } from "@/lib/data-utils";

export function useFinancialCalculations(records) {
  const calculations = useMemo(() => {
    if (!records || records.length === 0) {
      return {
        totalAmount: 0,
        totalIncome: 0,
        totalExpenses: 0,
        categoryData: [],
        monthlyData: [],
        recentTransactions: [],
        savingsRate: 0,
      };
    }

    // Basic calculations
    const totalAmount = dataUtils.calculateTotal(records);
    const categoryData = dataUtils.groupByCategory(records);
    const monthlyData = dataUtils.groupByMonth(records);

    // Calculate income vs expenses
    const incomeRecords = records.filter((r) => r.amount > 0);
    const expenseRecords = records.filter((r) => r.amount < 0);
    const totalIncome = dataUtils.calculateTotal(incomeRecords);
    const totalExpenses = Math.abs(dataUtils.calculateTotal(expenseRecords));

    // Recent transactions (last 5)
    const recentTransactions = records
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    // Calculate savings rate
    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    return {
      totalAmount,
      totalIncome,
      totalExpenses,
      categoryData,
      monthlyData,
      recentTransactions,
      savingsRate,
    };
  }, [records]);

  return calculations;
}
