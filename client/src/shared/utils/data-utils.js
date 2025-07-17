// Shared data utilities for calculations and grouping

import { TRANSACTION_CATEGORIES } from "@/config/stages";

// Calculate total amount from an array of records
export const calculateTotal = (records) => {
  if (!records || !Array.isArray(records)) return 0;
  return records.reduce((total, record) => total + (record.amount || 0), 0);
};

// Group records by category for chart visualization
export const groupByCategory = (records) => {
  if (!records || !Array.isArray(records)) return [];

  const categoryMap = new Map();

  records.forEach((record) => {
    const category = record.category || "Uncategorized";
    const amount = Math.abs(record.amount || 0); // Use absolute value for display

    if (categoryMap.has(category)) {
      const existing = categoryMap.get(category);
      existing.amount += amount;
      existing.count += 1;
    } else {
      // Get category details for display
      const categoryDetails = getCategoryDetails(category);

      categoryMap.set(category, {
        category,
        amount,
        count: 1,
        color: categoryDetails.color,
        icon: categoryDetails.icon,
      });
    }
  });

  return Array.from(categoryMap.values());
};

// Group records by month for monthly trends
export const groupByMonth = (records) => {
  if (!records || !Array.isArray(records)) return [];

  const monthMap = new Map();

  records.forEach((record) => {
    const date = new Date(record.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    const monthName = date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });

    if (!monthMap.has(monthKey)) {
      monthMap.set(monthKey, {
        month: monthName,
        income: 0,
        expenses: 0,
        total: 0,
      });
    }

    const monthData = monthMap.get(monthKey);
    const amount = record.amount || 0;

    if (amount > 0) {
      monthData.income += amount;
    } else {
      monthData.expenses += Math.abs(amount);
    }
    monthData.total += amount;
  });

  return Array.from(monthMap.values()).sort((a, b) =>
    a.month.localeCompare(b.month)
  );
};

// Calculate budget vs actual comparison
export const calculateBudgetComparison = (
  records,
  budgets,
  selectedMonth,
  selectedYear
) => {
  if (!records || !budgets) return [];

  // Filter records for the selected month/year
  const monthRecords = records.filter((record) => {
    const recordDate = new Date(record.date);
    return (
      recordDate.getMonth() === selectedMonth &&
      recordDate.getFullYear() === selectedYear
    );
  });

  // Calculate spending by category for the month
  const spendingByCategory = new Map();
  monthRecords.forEach((record) => {
    if (record.amount < 0) {
      // Only expenses
      const category = record.category || "Uncategorized";
      const amount = Math.abs(record.amount);
      spendingByCategory.set(
        category,
        (spendingByCategory.get(category) || 0) + amount
      );
    }
  });

  // Filter budgets for the selected month/year and calculate comparison
  return budgets
    .filter((budget) => {
      const budgetMonth = (budget.month || new Date().getMonth() + 1) - 1; // Convert to 0-11
      const budgetYear = budget.year || new Date().getFullYear();
      return budgetMonth === selectedMonth && budgetYear === selectedYear;
    })
    .map((budget) => {
      const category = budget.category;
      const budgeted = budget.amount || 0;
      const spent = spendingByCategory.get(category) || 0;
      const remaining = budgeted - spent;
      const percentage = budgeted > 0 ? (spent / budgeted) * 100 : 0;

      let status = "good";
      if (percentage > 100) {
        status = "over";
      } else if (percentage > 80) {
        status = "warning";
      }

      return {
        category,
        budgeted,
        spent,
        remaining,
        percentage,
        status,
      };
    });
};

// Calculate spending insights and patterns
export const calculateSpendingInsights = (
  records,
  budgets,
  selectedCategory,
  selectedMonth,
  selectedYear
) => {
  if (!records || !budgets) return {};

  const comparison = calculateBudgetComparison(
    records,
    budgets,
    selectedMonth,
    selectedYear
  );

  // Filter by category if specified
  const filteredComparison = selectedCategory
    ? comparison.filter((item) => item.category === selectedCategory)
    : comparison;

  const totalBudget = filteredComparison.reduce(
    (sum, item) => sum + item.budgeted,
    0
  );
  const totalSpent = filteredComparison.reduce(
    (sum, item) => sum + item.spent,
    0
  );
  const budgetRemaining = totalBudget - totalSpent;
  const categoriesOverBudget = filteredComparison.filter(
    (item) => item.status === "over"
  ).length;

  return {
    totalBudget,
    totalSpent,
    budgetRemaining,
    categoriesOverBudget,
    budgetUtilization: totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0,
  };
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

// Get category details (icon, color, etc.)
export const getCategoryDetails = (categoryValue) => {
  const category = TRANSACTION_CATEGORIES.find(
    (cat) => cat.value.toLowerCase() === categoryValue.toLowerCase()
  );

  return (
    category || {
      label: categoryValue,
      icon: "📝",
      color: "#6b7280",
      value: categoryValue,
    }
  );
};

// Utility object for easy importing
export const dataUtils = {
  calculateTotal,
  groupByCategory,
  groupByMonth,
  calculateBudgetComparison,
  calculateSpendingInsights,
  formatDate,
  getCategoryDetails,
};
