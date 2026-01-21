


export const CURRENT_STAGE = 3; // Change this for different submissions: 1, 2, or 3

export const FEATURES = {

  transactions: CURRENT_STAGE >= 1,
  monthlyChart: CURRENT_STAGE >= 1,
  basicValidation: CURRENT_STAGE >= 1,

  categories: CURRENT_STAGE >= 2,
  categoryChart: CURRENT_STAGE >= 2,
  dashboardCards: CURRENT_STAGE >= 2,
  summaryStats: CURRENT_STAGE >= 2,

  budgeting: CURRENT_STAGE >= 3,
  budgetComparison: CURRENT_STAGE >= 3,
  spendingInsights: CURRENT_STAGE >= 3,
  advancedAnalytics: CURRENT_STAGE >= 3,
};

export const STAGE_INFO = {
  1: {
    name: "Basic Transaction Tracking",
    description:
      "Add/Edit/Delete transactions, Transaction list view, Monthly expenses bar chart, Basic form validation",
    features: ["transactions", "monthlyChart", "basicValidation"],
  },
  2: {
    name: "Categories & Dashboard",
    description:
      "All Stage 1 features + Predefined categories, Category-wise pie chart, Dashboard with summary cards",
    features: [
      "transactions",
      "monthlyChart",
      "basicValidation",
      "categories",
      "categoryChart",
      "dashboardCards",
      "summaryStats",
    ],
  },
  3: {
    name: "Budgeting System",
    description:
      "All Stage 2 features + Set monthly category budgets, Budget vs actual comparison chart, Simple spending insights",
    features: [
      "transactions",
      "monthlyChart",
      "basicValidation",
      "categories",
      "categoryChart",
      "dashboardCards",
      "summaryStats",
      "budgeting",
      "budgetComparison",
      "spendingInsights",
      "advancedAnalytics",
    ],
  },
};

export const TRANSACTION_CATEGORIES = [
  { value: "salary", label: "Salary", icon: "💰", color: "#10b981" },
  { value: "freelance", label: "Freelance", icon: "💼", color: "#059669" },
  { value: "investment", label: "Investment", icon: "📈", color: "#0891b2" },
  { value: "rent", label: "Rent", icon: "🏠", color: "#ef4444" },
  { value: "groceries", label: "Groceries", icon: "🛒", color: "#dc2626" },
  {
    value: "transportation",
    label: "Transportation",
    icon: "🚗",
    color: "#ea580c",
  },
  { value: "food", label: "Food", icon: "🍕", color: "#3b82f6" },
  { value: "utilities", label: "Utilities", icon: "⚡", color: "#f59e0b" },
  {
    value: "entertainment",
    label: "Entertainment",
    icon: "🎬",
    color: "#8b5cf6",
  },
  { value: "healthcare", label: "Healthcare", icon: "🏥", color: "#db2777" },
  { value: "shopping", label: "Shopping", icon: "🛍️", color: "#be185d" },
  { value: "education", label: "Education", icon: "📚", color: "#7c3aed" },
  { value: "travel", label: "Travel", icon: "✈️", color: "#0369a1" },
  { value: "other", label: "Other", icon: "📝", color: "#6b7280" },
];

export const PAYMENT_METHODS = [
  { value: "credit_card", label: "Credit Card" },
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

export const TRANSACTION_TYPES = [
  { value: "deposit", label: "Deposit", icon: "💰", description: "Money coming in (Income)" },
  { value: "expense", label: "Expense", icon: "💸", description: "Money going out (Expense)" },
];

export const CURRENCIES = [
  {
    value: "USD",
    label: "US Dollar",
    symbol: "$",
    code: "USD",
    locale: "en-US",
  },
  {
    value: "INR",
    label: "Indian Rupee",
    symbol: "₹",
    code: "INR",
    locale: "en-IN",
  },
];

export const formatCurrencyByCurrency = (amount, currencyCode) => {
  const currency = CURRENCIES.find((c) => c.value === currencyCode);

  const defaultCurrency = currency || CURRENCIES[0];

  return new Intl.NumberFormat(defaultCurrency.locale, {
    style: "currency",
    currency: defaultCurrency.code,
  }).format(amount);
};
