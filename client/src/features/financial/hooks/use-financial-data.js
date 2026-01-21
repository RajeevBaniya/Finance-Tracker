

import { useState, useCallback, useEffect, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { createFinancialRecordsAPI } from "@/lib/api/financial-api";

export function useFinancialData() {
  const { getToken, userId, isLoaded } = useAuth();
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const financialRecordsAPI = useMemo(() => {
    return getToken ? createFinancialRecordsAPI(getToken) : null;
  }, [getToken]);

  const fetchRecords = useCallback(async () => {

    if (!isLoaded) {
      return;
    }

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

      setAllRecords([]);
    } finally {
      setLoading(false);
    }
  }, [financialRecordsAPI, userId, isLoaded]);

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
