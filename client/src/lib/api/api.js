// Legacy API exports for backwards compatibility
// Re-exports from modular API files to maintain existing imports

// Import from new modular files
export { financialRecordsAPI } from "./financial-api";
export { budgetsAPI } from "./budget-api";
export { dataUtils } from "../data-utils";
export { apiRequest, API_BASE_URL } from "./api/api-client";
