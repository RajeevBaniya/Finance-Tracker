


import { createAuthenticatedApiRequest } from "./api-client";

export function createFinancialRecordsAPI(getToken) {
  const authenticatedApiRequest = createAuthenticatedApiRequest(getToken);

  return {

    getAll: () => authenticatedApiRequest("/financial-records/getAll"),

    create: (record) =>
      authenticatedApiRequest("/financial-records", {
        method: "POST",
        body: JSON.stringify(record),
      }),

    update: (id, record) =>
      authenticatedApiRequest(`/financial-records/${id}`, {
        method: "PUT",
        body: JSON.stringify(record),
      }),

    delete: (id) =>
      authenticatedApiRequest(`/financial-records/${id}`, {
        method: "DELETE",
      }),
  };
}

import { apiRequest } from "./api-client";

export const financialRecordsAPI = {

  getAll: () => apiRequest("/financial-records/getAll"),

  create: (record) =>
    apiRequest("/financial-records", {
      method: "POST",
      body: JSON.stringify(record),
    }),

  update: (id, record) =>
    apiRequest(`/financial-records/${id}`, {
      method: "PUT",
      body: JSON.stringify(record),
    }),

  delete: (id) =>
    apiRequest(`/financial-records/${id}`, {
      method: "DELETE",
    }),
};
