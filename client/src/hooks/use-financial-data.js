// Custom hook for financial data management
// Handles CRUD operations for financial records with user authentication

import { useState, useCallback, useEffect, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { createFinancialRecordsAPI } from "@/lib/api/financial-api";

export function useFinancialData() {
  const { getToken, userId, isLoaded } = useAuth();
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create stable API instance - only recreate when getToken changes
  const financialRecordsAPI = useMemo(() => {
    return getToken ? createFinancialRecordsAPI(getToken) : null;
  }, [getToken]);

  // Fetch all records with optimized dependencies
  const fetchRecords = useCallback(async () => {
    // Don't fetch if auth is not loaded yet
    if (!isLoaded) {
      return;
    }

    // If no user or API, clear data and set loading to false
    if (!financialRecordsAPI || !userId) {
      setAllRecords([]);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await financialRecordsAPI.getAll();
      setAllRecords(data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching records:", err);
      // Clear records on error
      setAllRecords([]);
    } finally {
      setLoading(false);
    }
  }, [financialRecordsAPI, userId, isLoaded]);

  // Add new record
  const addRecord = useCallback(
    async (record) => {
      if (!financialRecordsAPI) {
        throw new Error("Authentication required");
      }

      try {
        setError(null);
        const newRecord = await financialRecordsAPI.create(record);
        setAllRecords((prev) => [...prev, newRecord]);
        return newRecord;
      } catch (err) {
        setError(err.message);
        console.error("Error adding record:", err);
        throw err;
      }
    },
    [financialRecordsAPI]
  );

  // Update existing record
  const updateRecord = useCallback(
    async (id, updatedRecord) => {
      if (!financialRecordsAPI) {
        throw new Error("Authentication required");
      }

      try {
        setError(null);
        const updated = await financialRecordsAPI.update(id, updatedRecord);
        setAllRecords((prev) =>
          prev.map((record) => (record._id === id ? updated : record))
        );
        return updated;
      } catch (err) {
        setError(err.message);
        console.error("Error updating record:", err);
        throw err;
      }
    },
    [financialRecordsAPI]
  );

  // Delete record
  const deleteRecord = useCallback(
    async (id) => {
      if (!financialRecordsAPI) {
        throw new Error("Authentication required");
      }

      try {
        setError(null);
        await financialRecordsAPI.delete(id);
        setAllRecords((prev) => prev.filter((record) => record._id !== id));
      } catch (err) {
        setError(err.message);
        console.error("Error deleting record:", err);
        throw err;
      }
    },
    [financialRecordsAPI]
  );

  // Fetch data when dependencies change
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return {
    allRecords,
    loading,
    error,
    fetchRecords,
    addRecord,
    updateRecord,
    deleteRecord,
  };
}
