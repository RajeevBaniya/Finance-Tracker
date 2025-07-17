// Financial context: manages month/year/currency selection and provides computed values
"use client";

import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { formatCurrencyByCurrency } from "@/config/stages";
import { dataUtils } from "@/shared/utils/data-utils";
import { useFinancialData } from "../hooks/use-financial-data";
import { useFinancialCalculations } from "../hooks/use-financial-calculations";

const FinancialContext = createContext(undefined);

export const FinancialProvider = ({ children }) => {
  const { userId, isLoaded } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [isHydrated, setIsHydrated] = useState(false);

  // Month filtering state - initialize with current date
  const [selectedMonth, setSelectedMonth] = useState(() =>
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState(() =>
    new Date().getFullYear()
  );
  const [userHasManuallyChanged, setUserHasManuallyChanged] = useState(false);

  // Auto-update to current month/year when date changes (for production)
  useEffect(() => {
    const checkDateChange = () => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      // Only auto-update if user hasn't manually changed the month
      // This ensures new day = new month, but respects user choices
      if (!userHasManuallyChanged) {
        setSelectedMonth(currentMonth);
        setSelectedYear(currentYear);
      }
    };

    // Check every hour to catch date changes (like July 30 → August 1)
    const interval = setInterval(checkDateChange, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [userHasManuallyChanged]);

  // Custom month setters that track manual changes
  const handleSetSelectedMonth = (month) => {
    setSelectedMonth(month);
    setUserHasManuallyChanged(true);
    // Reset manual flag after 24 hours so next day auto-updates
    setTimeout(() => setUserHasManuallyChanged(false), 24 * 60 * 60 * 1000);
  };

  const handleSetSelectedYear = (year) => {
    setSelectedYear(year);
    setUserHasManuallyChanged(true);
    // Reset manual flag after 24 hours so next day auto-updates
    setTimeout(() => setUserHasManuallyChanged(false), 24 * 60 * 60 * 1000);
  };

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

  // Filter records by selected currency AND selected month/year - memoized for performance
  const records = useMemo(
    () =>
      allRecords.filter((record) => {
        // Filter by currency
        if (record.currency !== selectedCurrency) return false;

        // Filter by selected month and year
        const recordDate = new Date(record.date);
        return (
          recordDate.getMonth() === selectedMonth &&
          recordDate.getFullYear() === selectedYear
        );
      }),
    [allRecords, selectedCurrency, selectedMonth, selectedYear]
  );

  // All records for selected currency (for all-time calculations) - memoized for performance
  const allCurrencyRecords = useMemo(
    () => allRecords.filter((record) => record.currency === selectedCurrency),
    [allRecords, selectedCurrency]
  );

  // Use custom hook for calculations with month filtering - memoized
  const calculations = useFinancialCalculations(
    allCurrencyRecords, // Use all currency records for calculations
    selectedMonth,
    selectedYear
  );

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
    records, // Month and currency filtered records
    allRecords, // All records (no filtering)
    allCurrencyRecords, // Currency filtered records (all months)
    loading: overallLoading,
    error,

    // Currency
    selectedCurrency,
    setSelectedCurrency,

    // Month filtering
    selectedMonth,
    selectedYear,
    setSelectedMonth: handleSetSelectedMonth,
    setSelectedYear: handleSetSelectedYear,

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
