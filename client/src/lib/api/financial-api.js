// Financial Records API
// Handles all financial record CRUD operations with authentication

import { createAuthenticatedApiRequest } from "./api-client";

// Create authenticated financial records API
export function createFinancialRecordsAPI(getToken) {
  const authenticatedApiRequest = createAuthenticatedApiRequest(getToken);

  return {
    // Get all financial records
    getAll: () => authenticatedApiRequest("/financial-records/getAll"),

    // Create a new financial record
    create: (record) =>
      authenticatedApiRequest("/financial-records", {
        method: "POST",
        body: JSON.stringify(record),
      }),

    // Update a financial record
    update: (id, record) =>
      authenticatedApiRequest(`/financial-records/${id}`, {
        method: "PUT",
        body: JSON.stringify(record),
      }),

    // Delete a financial record
    delete: (id) =>
      authenticatedApiRequest(`/financial-records/${id}`, {
        method: "DELETE",
      }),
  };
}

// Legacy export for backward compatibility (will use default apiRequest)
import { apiRequest } from "./api-client";

export const financialRecordsAPI = {
  // Get all financial records
  getAll: () => apiRequest("/financial-records/getAll"),

  // Create a new financial record
  create: (record) =>
    apiRequest("/financial-records", {
      method: "POST",
      body: JSON.stringify(record),
    }),

  // Update a financial record
  update: (id, record) =>
    apiRequest(`/financial-records/${id}`, {
      method: "PUT",
      body: JSON.stringify(record),
    }),

  // Delete a financial record
  delete: (id) =>
    apiRequest(`/financial-records/${id}`, {
      method: "DELETE",
    }),
};
