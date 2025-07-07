// Custom hook for financial data management
// Handles CRUD operations for financial records

import { useState, useCallback } from "react";
import { financialRecordsAPI } from "@/lib/financial-api";

export function useFinancialData() {
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all records
  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await financialRecordsAPI.getAll();
      setAllRecords(data);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching records:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add new record
  const addRecord = useCallback(async (record) => {
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
  }, []);

  // Update existing record
  const updateRecord = useCallback(async (id, updatedRecord) => {
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
  }, []);

  // Delete record
  const deleteRecord = useCallback(async (id) => {
    try {
      setError(null);
      await financialRecordsAPI.delete(id);
      setAllRecords((prev) => prev.filter((record) => record._id !== id));
    } catch (err) {
      setError(err.message);
      console.error("Error deleting record:", err);
      throw err;
    }
  }, []);

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
