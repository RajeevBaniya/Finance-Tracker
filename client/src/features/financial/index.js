/**
 * FINANCIAL FEATURE EXPORTS
 *
 * Centralizes exports for all financial-related functionality
 * Makes importing easier: import { useFinancial, FinancialProvider } from '@/features/financial'
 */

// Context exports
export {
  FinancialProvider,
  useFinancial,
} from "./context/financial-context.jsx";

// Hook exports
export { useFinancialData } from "./hooks/use-financial-data";
export { useFinancialCalculations } from "./hooks/use-financial-calculations";
