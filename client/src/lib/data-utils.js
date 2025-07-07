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
      const remaining = Math.max(0, budget.amount - spent);
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

      return {
        category: budget.category,
        budgeted: budget.amount,
        spent,
        remaining,
        percentage: Math.min(100, percentage),
        status:
          percentage > 100 ? "over" : percentage > 80 ? "warning" : "good",
      };
    });
  },

  // Calculate spending insights
  calculateSpendingInsights: (records, budgets) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    // Current month expenses
    const currentMonthExpenses = records.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === currentMonth &&
        recordDate.getFullYear() === currentYear &&
        record.amount < 0
      );
    });

    // Previous month expenses for comparison
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthExpenses = records.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        recordDate.getMonth() === prevMonth &&
        recordDate.getFullYear() === prevYear &&
        record.amount < 0
      );
    });

    const totalCurrentExpenses = Math.abs(
      dataUtils.calculateTotal(currentMonthExpenses)
    );
    const totalPrevExpenses = Math.abs(
      dataUtils.calculateTotal(prevMonthExpenses)
    );
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);

    const monthlyChange =
      totalPrevExpenses > 0
        ? ((totalCurrentExpenses - totalPrevExpenses) / totalPrevExpenses) * 100
        : 0;

    return {
      totalSpent: totalCurrentExpenses,
      totalBudget,
      budgetRemaining: Math.max(0, totalBudget - totalCurrentExpenses),
      monthlyChange,
      averageDailySpending: totalCurrentExpenses / new Date().getDate(),
      categoriesOverBudget: budgets.filter((budget) => {
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
