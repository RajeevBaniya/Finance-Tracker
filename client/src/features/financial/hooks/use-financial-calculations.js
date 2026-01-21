

import { useMemo } from "react";
import { dataUtils } from "@/shared/utils/data-utils";

export function useFinancialCalculations(records, selectedMonth, selectedYear) {
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
        allTimeData: {
          totalAmount: 0,
          totalIncome: 0,
          totalExpenses: 0,
        },
      };
    }
    const monthFilteredRecords = records.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === selectedMonth &&
        recordDate.getFullYear() === selectedYear
      );
    });
    const totalAmount = dataUtils.calculateTotal(monthFilteredRecords);
    const categoryData = dataUtils.groupByCategory(monthFilteredRecords);
    const monthlyData = dataUtils.groupByMonth(records); // Still show all months for chart
    const incomeRecords = monthFilteredRecords.filter((r) => r.amount > 0);
    const expenseRecords = monthFilteredRecords.filter((r) => r.amount < 0);
    const totalIncome = dataUtils.calculateTotal(incomeRecords);
    const totalExpenses = Math.abs(dataUtils.calculateTotal(expenseRecords));
    const recentTransactions = monthFilteredRecords
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
    const savingsRate =
      totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;
    const allTimeAmount = dataUtils.calculateTotal(records);
    const allTimeIncomeRecords = records.filter((r) => r.amount > 0);
    const allTimeExpenseRecords = records.filter((r) => r.amount < 0);
    const allTimeTotalIncome = dataUtils.calculateTotal(allTimeIncomeRecords);
    const allTimeTotalExpenses = Math.abs(
      dataUtils.calculateTotal(allTimeExpenseRecords)
    );

    return {
      totalAmount,
      totalIncome,
      totalExpenses,
      categoryData,
      monthlyData,
      recentTransactions,
      savingsRate,
      allTimeData: {
        totalAmount: allTimeAmount,
        totalIncome: allTimeTotalIncome,
        totalExpenses: allTimeTotalExpenses,
      },
    };
  }, [records, selectedMonth, selectedYear]);

  return calculations;
}
