"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function MonthPicker({
  selectedMonth,
  selectedYear,
  onMonthChange,
  onYearChange,
  availableMonths = [],
}) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const [stableMonth, setStableMonth] = useState(selectedMonth);
  const [stableYear, setStableYear] = useState(selectedYear);

  useEffect(() => {
    setStableMonth(selectedMonth);
    setStableYear(selectedYear);
  }, [selectedMonth, selectedYear]);

  const availableYears = [];
  for (let i = 0; i <= currentYear - 2010; i++) {
    availableYears.push(currentYear - i);
  }

  const handlePrevMonth = () => {
    if (stableMonth === 0) {
      const newMonth = 11;
      const newYear = stableYear - 1;
      setStableMonth(newMonth);
      setStableYear(newYear);
      onMonthChange(newMonth);
      onYearChange(newYear);
    } else {
      const newMonth = stableMonth - 1;
      setStableMonth(newMonth);
      onMonthChange(newMonth);
    }
  };

  const handleNextMonth = () => {
    if (stableMonth === 11) {
      const newMonth = 0;
      const newYear = stableYear + 1;
      setStableMonth(newMonth);
      setStableYear(newYear);
      onMonthChange(newMonth);
      onYearChange(newYear);
    } else {
      const newMonth = stableMonth + 1;
      setStableMonth(newMonth);
      onMonthChange(newMonth);
    }
  };

  const isCurrentMonth =
    stableMonth === currentMonth && stableYear === currentYear;
  const isFutureMonth =
    stableYear > currentYear ||
    (stableYear === currentYear && stableMonth > currentMonth);

  return (
    <div className="inline-flex items-center gap-0.5 sm:gap-0.5 bg-white border rounded-lg p-0.5 sm:p-0.5 shadow-sm max-w-fit">
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePrevMonth}
        className="h-7 w-7 sm:h-6 sm:w-6 p-0 hover:bg-gray-100 flex-shrink-0"
      >
        <ChevronLeft className="h-3 w-3" />
      </Button>

      <div className="flex items-center gap-1.5 sm:gap-1.5 px-1.5">
        <Calendar className="h-3.5 w-3.5 text-gray-500 flex-shrink-0" />
        <Select
          value={stableMonth.toString()}
          onValueChange={(value) => {
            const newMonth = parseInt(value);
            setStableMonth(newMonth);
            onMonthChange(newMonth);
          }}
        >
          <SelectTrigger className="border-0 shadow-none h-7 sm:h-6 w-auto min-w-[42px] sm:min-w-[40px] max-w-[45px] sm:max-w-[45px] p-0 focus:ring-0 flex items-center justify-center">
            <SelectValue>
              <span className="text-sm sm:text-xs font-medium text-gray-700 text-center">
                {months[stableMonth].slice(0, 3)}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={index} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={stableYear.toString()}
          onValueChange={(value) => {
            const newYear = parseInt(value);
            setStableYear(newYear);
            onYearChange(newYear);
          }}
        >
          <SelectTrigger className="border-0 shadow-none h-7 sm:h-6 w-auto min-w-[48px] sm:min-w-[46px] max-w-[55px] sm:max-w-[55px] p-0 focus:ring-0 flex items-center justify-center">
            <SelectValue>
              <span className="text-sm sm:text-xs font-medium text-gray-700 text-center">
                {stableYear}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleNextMonth}
        disabled={isFutureMonth}
        className="h-7 w-7 sm:h-6 sm:w-6 p-0 hover:bg-gray-100 disabled:opacity-50 flex-shrink-0"
      >
        <ChevronRight className="h-3 w-3" />
      </Button>
    </div>
  );
}
