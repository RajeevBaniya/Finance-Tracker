

import { useState, useCallback, useEffect, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { createBudgetsAPI } from "@/lib/api/budget-api";

export function useBudgetData() {
  const { getToken, userId, isLoaded, isSignedIn } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const budgetsAPI = useMemo(() => {
    return getToken ? createBudgetsAPI(getToken) : null;
  }, [getToken]);
  const fetchBudgets = useCallback(
    async (force = false) => {
      if (!isLoaded) {
        return;
      }
      if (!budgetsAPI || !userId || !isSignedIn) {
        setBudgets([]);
        setLoading(false);
        setError(null);
        return;
      }
      const now = Date.now();
      if (!force && now - lastFetchTime < 2000) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await budgetsAPI.getAll();
        setBudgets(data || []);
        setLastFetchTime(now);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching budgets:", err);
        if (err.message.includes("Authentication")) {
          setBudgets([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [budgetsAPI, userId, isLoaded, isSignedIn, lastFetchTime]
  );
  const addBudget = useCallback(
    async (budget) => {
      if (!budgetsAPI || !isSignedIn) {
        throw new Error("Authentication required");
      }

      try {
        setError(null);
        const newBudget = await budgetsAPI.create(budget);
        setBudgets((prev) => [...prev, newBudget]);
        return newBudget;
      } catch (err) {
        if (err.message.includes("Authentication")) {
          await fetchBudgets(true);
        }
        setError(err.message);
        console.error("Error adding budget:", err);
        throw err;
      }
    },
    [budgetsAPI, isSignedIn, fetchBudgets]
  );
  const updateBudget = useCallback(
    async (id, updatedBudget) => {
      if (!budgetsAPI || !isSignedIn) {
        throw new Error("Authentication required");
      }

      try {
        setError(null);
        const updated = await budgetsAPI.update(id, updatedBudget);
        setBudgets((prev) =>
          prev.map((budget) => (budget._id === id ? updated : budget))
        );
        return updated;
      } catch (err) {
        if (err.message.includes("Authentication")) {
          await fetchBudgets(true);
        }
        setError(err.message);
        console.error("Error updating budget:", err);
        throw err;
      }
    },
    [budgetsAPI, isSignedIn, fetchBudgets]
  );
  const deleteBudget = useCallback(
    async (id) => {
      if (!budgetsAPI || !isSignedIn) {
        throw new Error("Authentication required");
      }

      try {
        setError(null);
        await budgetsAPI.delete(id);
        setBudgets((prev) => prev.filter((budget) => budget._id !== id));
      } catch (err) {
        if (err.message.includes("Authentication")) {
          await fetchBudgets(true);
        }
        setError(err.message);
        console.error("Error deleting budget:", err);
        throw err;
      }
    },
    [budgetsAPI, isSignedIn, fetchBudgets]
  );
  const getBudgetForCategory = useCallback(
    (category, selectedCurrency) => {
      return budgets
        .filter((budget) => budget.currency === selectedCurrency)
        .find(
          (budget) => budget.category.toLowerCase() === category.toLowerCase()
        );
    },
    [budgets]
  );
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchBudgets();
    }
  }, [fetchBudgets, isLoaded, isSignedIn]);

  return {
    budgets,
    loading,
    error,
    fetchBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetForCategory,
  };
}
