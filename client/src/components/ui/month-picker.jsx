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

  // Generate available years (current year and previous 5 years)
  const availableYears = [];
  for (let i = 0; i < 6; i++) {
    availableYears.push(currentYear - i);
  }

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      onMonthChange(11);
      onYearChange(selectedYear - 1);
    } else {
      onMonthChange(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      onMonthChange(0);
      onYearChange(selectedYear + 1);
    } else {
      onMonthChange(selectedMonth + 1);
    }
  };

  const isCurrentMonth =
    selectedMonth === currentMonth && selectedYear === currentYear;
  const isFutureMonth =
    selectedYear > currentYear ||
    (selectedYear === currentYear && selectedMonth > currentMonth);

  return (
    <div className="inline-flex items-center gap-0.5 sm:gap-1 bg-white border rounded-lg p-0.5 sm:p-1 shadow-sm max-w-fit">
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePrevMonth}
        className="h-7 w-7 sm:h-6 sm:w-6 p-0 hover:bg-gray-100 flex-shrink-0"
      >
        <ChevronLeft className="h-3 w-3" />
      </Button>

      <div className="flex items-center gap-1 sm:gap-0.5 px-1">
        <Calendar className="h-3 w-3 text-gray-500 flex-shrink-0" />
        <Select
          value={selectedMonth.toString()}
          onValueChange={(value) => onMonthChange(parseInt(value))}
        >
          <SelectTrigger className="border-0 shadow-none h-7 sm:h-6 w-auto min-w-[60px] sm:min-w-[55px] max-w-[60px] sm:max-w-[55px] p-0 focus:ring-0">
            <SelectValue>
              <span className="text-sm sm:text-xs font-medium text-gray-700">
                {months[selectedMonth].slice(0, 3)}
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
          value={selectedYear.toString()}
          onValueChange={(value) => onYearChange(parseInt(value))}
        >
          <SelectTrigger className="border-0 shadow-none h-7 sm:h-6 w-auto min-w-[50px] sm:min-w-[45px] max-w-[50px] sm:max-w-[45px] p-0 focus:ring-0">
            <SelectValue>
              <span className="text-sm sm:text-xs font-medium text-gray-700">
                {selectedYear}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
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
