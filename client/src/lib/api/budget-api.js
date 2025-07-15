// Budgets API
// Handles all budget CRUD operations with authentication

import { createAuthenticatedApiRequest } from "./api-client";

// Create authenticated budgets API
export function createBudgetsAPI(getToken) {
  const authenticatedApiRequest = createAuthenticatedApiRequest(getToken);

  return {
    // Get all budgets
    getAll: () => authenticatedApiRequest("/budgets/getAll"),

    // Create a new budget
    create: (budget) =>
      authenticatedApiRequest("/budgets", {
        method: "POST",
        body: JSON.stringify(budget),
      }),

    // Update a budget
    update: (id, budget) =>
      authenticatedApiRequest(`/budgets/${id}`, {
        method: "PUT",
        body: JSON.stringify(budget),
      }),

    // Delete a budget
    delete: (id) =>
      authenticatedApiRequest(`/budgets/${id}`, {
        method: "DELETE",
      }),
  };
}
