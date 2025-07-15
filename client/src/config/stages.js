// Stage Configuration for FinTrack
// Change CURRENT_STAGE value to control which features are enabled for submission

export const CURRENT_STAGE = 3; // Change this for different submissions: 1, 2, or 3

export const FEATURES = {
  // Stage 1: Basic Transaction Tracking
  transactions: CURRENT_STAGE >= 1,
  monthlyChart: CURRENT_STAGE >= 1,
  basicValidation: CURRENT_STAGE >= 1,

  // Stage 2: Categories and Dashboard
  categories: CURRENT_STAGE >= 2,
  categoryChart: CURRENT_STAGE >= 2,
  dashboardCards: CURRENT_STAGE >= 2,
  summaryStats: CURRENT_STAGE >= 2,

  // Stage 3: Budgeting System
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

// Predefined categories for transactions
export const TRANSACTION_CATEGORIES = [
  { value: "food", label: "Food", icon: "🍕", color: "#3b82f6" },
  { value: "rent", label: "Rent", icon: "🏠", color: "#ef4444" },
  { value: "salary", label: "Salary", icon: "💰", color: "#10b981" },
  { value: "utilities", label: "Utilities", icon: "⚡", color: "#f59e0b" },
  {
    value: "entertainment",
    label: "Entertainment",
    icon: "🎬",
    color: "#8b5cf6",
  },
  { value: "other", label: "Other", icon: "📝", color: "#6b7280" },
];

// Payment methods
export const PAYMENT_METHODS = [
  { value: "credit_card", label: "Credit Card" },
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

// Currency options
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

// Currency formatting utility
export const formatCurrencyByCurrency = (amount, currencyCode) => {
  const currency = CURRENCIES.find((c) => c.value === currencyCode);

  // Default to USD if currency not found
  const defaultCurrency = currency || CURRENCIES[0];

  return new Intl.NumberFormat(defaultCurrency.locale, {
    style: "currency",
    currency: defaultCurrency.code,
  }).format(amount);
};
