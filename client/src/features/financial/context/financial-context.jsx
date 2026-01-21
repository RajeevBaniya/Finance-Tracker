
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

  const [selectedMonth, setSelectedMonth] = useState(() =>
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState(() =>
    new Date().getFullYear()
  );
  const [userHasManuallyChanged, setUserHasManuallyChanged] = useState(false);

  useEffect(() => {
    const checkDateChange = () => {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();


      if (!userHasManuallyChanged) {
        setSelectedMonth(currentMonth);
        setSelectedYear(currentYear);
      }
    };

    const interval = setInterval(checkDateChange, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [userHasManuallyChanged]);

  const handleSetSelectedMonth = (month) => {
    setSelectedMonth(month);
    setUserHasManuallyChanged(true);

    setTimeout(() => setUserHasManuallyChanged(false), 24 * 60 * 60 * 1000);
  };

  const handleSetSelectedYear = (year) => {
    setSelectedYear(year);
    setUserHasManuallyChanged(true);

    setTimeout(() => setUserHasManuallyChanged(false), 24 * 60 * 60 * 1000);
  };

  const {
    allRecords,
    loading,
    error,
    fetchRecords,
    addRecord: addRecordAPI,
    updateRecord: updateRecordAPI,
    deleteRecord: deleteRecordAPI,
  } = useFinancialData();

  const records = useMemo(
    () =>
      allRecords.filter((record) => {

        if (record.currency !== selectedCurrency) return false;

        const recordDate = new Date(record.date);
        return (
          recordDate.getMonth() === selectedMonth &&
          recordDate.getFullYear() === selectedYear
        );
      }),
    [allRecords, selectedCurrency, selectedMonth, selectedYear]
  );

  const allCurrencyRecords = useMemo(
    () => allRecords.filter((record) => record.currency === selectedCurrency),
    [allRecords, selectedCurrency]
  );

  const calculations = useFinancialCalculations(
    allCurrencyRecords, // Use all currency records for calculations
    selectedMonth,
    selectedYear
  );

  const addRecord = async (record) => {

    return await addRecordAPI(record);
  };

  useEffect(() => {
    setIsHydrated(true);
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("selectedCurrency", selectedCurrency);
    }
  }, [selectedCurrency, isHydrated]);

  const overallLoading = !isLoaded || (isLoaded && userId && loading);

  const contextValue = {

    records, // Month and currency filtered records
    allRecords, // All records (no filtering)
    allCurrencyRecords, // Currency filtered records (all months)
    loading: overallLoading,
    error,

    selectedCurrency,
    setSelectedCurrency,

    selectedMonth,
    selectedYear,
    setSelectedMonth: handleSetSelectedMonth,
    setSelectedYear: handleSetSelectedYear,

    ...calculations,

    addRecord,
    updateRecord: updateRecordAPI,
    deleteRecord: deleteRecordAPI,
    fetchRecords,

    formatCurrency: (amount) =>
      formatCurrencyByCurrency(amount, selectedCurrency),
    formatDate: dataUtils.formatDate,

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
