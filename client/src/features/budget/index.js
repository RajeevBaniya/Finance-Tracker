/**
 * BUDGET FEATURE EXPORTS
 *
 * Centralizes exports for all budget-related functionality
 * Makes importing easier: import { useBudget, BudgetProvider } from '@/features/budget'
 */

// Context exports
export { BudgetProvider, useBudget } from "./context/budget-context.jsx";

// Hook exports
export { useBudgetData } from "./hooks/use-budget-data";
export { useBudgetCalculations } from "./hooks/use-budget-calculations";
