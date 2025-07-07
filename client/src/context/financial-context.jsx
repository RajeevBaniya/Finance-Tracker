"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { formatCurrencyByCurrency } from "@/config/stages";
import { dataUtils } from "@/lib/data-utils";
import { useFinancialData } from "@/hooks/use-financial-data";
import { useFinancialCalculations } from "@/hooks/use-financial-calculations";

const FinancialContext = createContext(undefined);

export const FinancialProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [isHydrated, setIsHydrated] = useState(false);

  // Use custom hooks for data management and calculations
  const {
    allRecords,
    loading,
    error,
    fetchRecords,
    addRecord: addRecordAPI,
    updateRecord: updateRecordAPI,
    deleteRecord: deleteRecordAPI,
  } = useFinancialData();

  // Filter records by selected currency
  const records = useMemo(
    () => allRecords.filter((record) => record.currency === selectedCurrency),
    [allRecords, selectedCurrency]
  );

  // Use custom hook for calculations
  const calculations = useFinancialCalculations(records);

  // Enhanced add record function that includes currency
  const addRecord = async (record) => {
    const recordWithCurrency = { ...record, currency: selectedCurrency };
    return await addRecordAPI(recordWithCurrency);
  };

  // Load records on mount
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  // Handle hydration and load saved currency
  useEffect(() => {
    setIsHydrated(true);
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  // Save currency selection to localStorage when it changes (only after hydration)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("selectedCurrency", selectedCurrency);
    }
  }, [selectedCurrency, isHydrated]);

  const contextValue = {
    // Data
    records,
    allRecords,
    loading,
    error,

    // Currency
    selectedCurrency,
    setSelectedCurrency,

    // Computed values from calculations hook
    ...calculations,

    // Actions
    addRecord,
    updateRecord: updateRecordAPI,
    deleteRecord: deleteRecordAPI,
    fetchRecords,

    // Utilities
    formatCurrency: (amount) =>
      formatCurrencyByCurrency(amount, selectedCurrency),
    formatDate: dataUtils.formatDate,
  };

  return (
    <FinancialContext.Provider value={contextValue}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error("useFinancial must be used within a FinancialProvider");
  }
  return context;
};
