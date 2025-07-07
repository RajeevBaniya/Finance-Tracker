// Budgets API
// Handles all budget CRUD operations

import { apiRequest } from "./api-client";

export const budgetsAPI = {
  // Get all budgets
  getAll: () => apiRequest("/budgets/getAll"),

  // Create a new budget
  create: (budget) =>
    apiRequest("/budgets", {
      method: "POST",
      body: JSON.stringify(budget),
    }),

  // Update a budget
  update: (id, budget) =>
    apiRequest(`/budgets/${id}`, {
      method: "PUT",
      body: JSON.stringify(budget),
    }),

  // Delete a budget
  delete: (id) =>
    apiRequest(`/budgets/${id}`, {
      method: "DELETE",
    }),
};
