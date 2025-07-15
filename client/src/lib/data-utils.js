// Data processing utilities
export const dataUtils = {
  // Calculate total amount from records
  calculateTotal: (records) => {
    return records.reduce((total, record) => total + (record.amount || 0), 0);
  },

  // Group records by category (case-insensitive)
  groupByCategory: (records) => {
    const grouped = records.reduce((acc, record) => {
      // Normalize category: trim, convert to proper case (first letter uppercase)
      const rawCategory = record.category || "Other";
      const normalizedCategory = rawCategory.trim().toLowerCase();
      const displayCategory =
        normalizedCategory.charAt(0).toUpperCase() +
        normalizedCategory.slice(1);

      if (!acc[normalizedCategory]) {
        acc[normalizedCategory] = {
          category: displayCategory,
          total: 0,
          count: 0,
          records: [],
        };
      }
      acc[normalizedCategory].total += record.amount || 0;
      acc[normalizedCategory].count += 1;
      acc[normalizedCategory].records.push(record);
      return acc;
    }, {});

    return Object.values(grouped);
  },

  // Group records by month for chart data
  groupByMonth: (records) => {
    const grouped = records.reduce((acc, record) => {
      const date = new Date(record.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthName, amount: 0, count: 0 };
      }
      acc[monthKey].amount += record.amount || 0;
      acc[monthKey].count += 1;
      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(a.month) - new Date(b.month)
    );
  },

  // Format currency
  formatCurrency: (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  },

  // Format date
  formatDate: (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  // Calculate spending vs budget comparison
  calculateBudgetComparison: (records, budgets) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Filter records for current month
    const currentMonthRecords = records.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear &&
        record.amount < 0
      ); // Only expenses
    });

    // Group spending by category
    const spendingByCategory = dataUtils.groupByCategory(currentMonthRecords);

    // Create comparison data
    return budgets.map((budget) => {
      const spending = spendingByCategory.find(
        (cat) => cat.category.toLowerCase() === budget.category.toLowerCase()
      );
      const spent = Math.abs(spending?.total || 0);
      const remaining = budget.amount - spent; // Allow negative remaining
      const percentage = (spent / budget.amount) * 100; // Don't cap percentage

      return {
        category: budget.category,
        budgeted: budget.amount,
        spent,
        remaining,
        percentage, // Don't cap at 100
        status:
          percentage > 100 ? "over" : percentage > 80 ? "warning" : "good",
      };
    });
  },

  // Calculate spending insights
  calculateSpendingInsights: (records, budgets, selectedCategory = null) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Filter records by category if selected
    const categoryFilter = (record) => {
      if (selectedCategory) {
        return record.category.toLowerCase() === selectedCategory.toLowerCase();
      }
      return true;
    };

    // Current month expenses for selected category
    const currentMonthExpenses = records.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear &&
        record.amount < 0 &&
        categoryFilter(record)
      );
    });

    // Get budget for selected category
    const relevantBudgets = selectedCategory
      ? budgets.filter(
          (budget) =>
            budget.category.toLowerCase() === selectedCategory.toLowerCase()
        )
      : budgets;

    const totalCurrentExpenses = Math.abs(
      dataUtils.calculateTotal(currentMonthExpenses)
    );
    const totalBudget = relevantBudgets.reduce(
      (sum, budget) => sum + budget.amount,
      0
    );

    return {
      totalSpent: totalCurrentExpenses,
      totalBudget,
      budgetRemaining: totalBudget - totalCurrentExpenses, // Allow negative remaining
      categoriesOverBudget: relevantBudgets.filter((budget) => {
        const categorySpending = currentMonthExpenses
          .filter(
            (record) =>
              record.category.toLowerCase() === budget.category.toLowerCase()
          )
          .reduce((sum, record) => sum + Math.abs(record.amount), 0);
        return categorySpending > budget.amount;
      }).length,
    };
  },
};
