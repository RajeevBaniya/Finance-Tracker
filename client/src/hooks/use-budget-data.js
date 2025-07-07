// Custom hook for budget data management
// Handles CRUD operations for budgets

import { useState, useCallback } from "react";
import { budgetsAPI } from "@/lib/budget-api";

export function useBudgetData() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all budgets
  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await budgetsAPI.getAll();
      setBudgets(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching budgets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new budget
  const addBudget = useCallback(async (budget) => {
    try {
      setError(null);
      const newBudget = await budgetsAPI.create(budget);
      setBudgets((prev) => [...prev, newBudget]);
      return newBudget;
    } catch (err) {
      setError(err.message);
      console.error("Error adding budget:", err);
      throw err;
    }
  }, []);

  // Update existing budget
  const updateBudget = useCallback(async (id, updatedBudget) => {
    try {
      setError(null);
      const updated = await budgetsAPI.update(id, updatedBudget);
      setBudgets((prev) =>
        prev.map((budget) => (budget._id === id ? updated : budget))
      );
      return updated;
    } catch (err) {
      setError(err.message);
      console.error("Error updating budget:", err);
      throw err;
    }
  }, []);

  // Delete budget
  const deleteBudget = useCallback(async (id) => {
    try {
      setError(null);
      await budgetsAPI.delete(id);
      setBudgets((prev) => prev.filter((budget) => budget._id !== id));
    } catch (err) {
      setError(err.message);
      console.error("Error deleting budget:", err);
      throw err;
    }
  }, []);

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
