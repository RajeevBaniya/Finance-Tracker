// Financial Records API
// Handles all financial record CRUD operations

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
