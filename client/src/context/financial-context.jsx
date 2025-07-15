"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { formatCurrencyByCurrency } from "@/config/stages";
import { dataUtils } from "@/lib/data-utils";
import { useFinancialData } from "@/hooks/use-financial-data";
import { useFinancialCalculations } from "@/hooks/use-financial-calculations";

const FinancialContext = createContext(undefined);

export const FinancialProvider = ({ children }) => {
  const { userId, isLoaded } = useAuth();
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

  // Filter records by selected currency - memoized for performance
  const records = useMemo(
    () => allRecords.filter((record) => record.currency === selectedCurrency),
    [allRecords, selectedCurrency]
  );

  // Use custom hook for calculations - memoized
  const calculations = useFinancialCalculations(records);

  // Enhanced add record function - use the currency from the record itself
  const addRecord = async (record) => {
    // Don't override currency - use whatever was passed from the form
    return await addRecordAPI(record);
  };

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

  // Show overall loading state when user is not loaded or when financial data is loading
  const overallLoading = !isLoaded || (isLoaded && userId && loading);

  const contextValue = {
    // Data
    records,
    allRecords,
    loading: overallLoading,
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

    // Status helpers
    isAuthenticated: !!userId,
    isReady: isLoaded && isHydrated,
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
