// Custom hook for budget data management
// Handles CRUD operations for budgets with user authentication

import { useState, useCallback, useEffect, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { createBudgetsAPI } from "@/lib/api/budget-api";

export function useBudgetData() {
  const { getToken, userId, isLoaded, isSignedIn } = useAuth();
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  // Create stable API instance - only recreate when getToken changes
  const budgetsAPI = useMemo(() => {
    return getToken ? createBudgetsAPI(getToken) : null;
  }, [getToken]);

  // Fetch all budgets with optimized dependencies
  const fetchBudgets = useCallback(
    async (force = false) => {
      // Don't fetch if auth is not loaded yet
      if (!isLoaded) {
        return;
      }

      // If no user or API, clear data and set loading to false
      if (!budgetsAPI || !userId || !isSignedIn) {
        setBudgets([]);
        setLoading(false);
        setError(null);
        return;
      }

      // Prevent multiple rapid fetches unless forced
      const now = Date.now();
      if (!force && now - lastFetchTime < 2000) {
        // 2 second debounce
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
        // Only clear budgets on auth errors
        if (err.message.includes("Authentication")) {
          setBudgets([]);
        }
      } finally {
        setLoading(false);
      }
    },
    [budgetsAPI, userId, isLoaded, isSignedIn, lastFetchTime]
  );

  // Add new budget with retry logic
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
        // If it's an auth error, try to refresh the data
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

  // Update existing budget with retry logic
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
        // If it's an auth error, try to refresh the data
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

  // Delete budget with retry logic
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
        // If it's an auth error, try to refresh the data
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

  // Get budget for specific category
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

  // Fetch data when dependencies change
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
