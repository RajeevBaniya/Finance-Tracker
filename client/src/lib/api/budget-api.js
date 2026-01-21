


import { createAuthenticatedApiRequest } from "./api-client";

export function createBudgetsAPI(getToken) {
  const authenticatedApiRequest = createAuthenticatedApiRequest(getToken);

  return {

    getAll: () => authenticatedApiRequest("/budgets/getAll"),

    create: (budget) =>
      authenticatedApiRequest("/budgets", {
        method: "POST",
        body: JSON.stringify(budget),
      }),

    update: (id, budget) =>
      authenticatedApiRequest(`/budgets/${id}`, {
        method: "PUT",
        body: JSON.stringify(budget),
      }),

    delete: (id) =>
      authenticatedApiRequest(`/budgets/${id}`, {
        method: "DELETE",
      }),
  };
}
