"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBudget } from "@/features/budget/context/budget-context";
import { useFinancial } from "@/features/financial/context/financial-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";

export function BudgetComparisonChart({
  selectedCategory,
  setSelectedCategory,
}) {
  const { budgetComparison, loading } = useBudget();
  const { formatCurrency, allTimeData, totalIncome } = useFinancial();

  // Use all-time data for budget availability warnings
  const { totalAmount } = allTimeData;

  // Filter budget comparison data based on selected category
  const filteredBudgetData =
    budgetComparison?.filter(
      (item) => item.category.toLowerCase() === selectedCategory.toLowerCase()
    ) || [];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <div className="space-y-1 text-sm">
            <p className="text-blue-600">
              Budgeted: {formatCurrency(data.budgeted)}
            </p>
            <p className="text-red-600">Spent: {formatCurrency(data.spent)}</p>
            <p className="text-green-600">
              Remaining: {formatCurrency(data.remaining)}
            </p>
            <p className="text-gray-600">
              Progress: {data.percentage.toFixed(1)}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Budget vs Actual
          </CardTitle>
          <CardDescription>Loading budget comparison...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-gray-100 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  // Check if user has income before showing budget comparison
  if (!totalIncome || totalIncome <= 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Budget vs Actual
          </CardTitle>
          <CardDescription>Add income to start budgeting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-black mb-2">No income found</p>
            <p className="text-sm text-gray-600">
              Add deposits first to create and compare budgets
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Only hide if no existing budgets - users should see comparisons for existing budgets
  // even if they can't create new ones

  if (!budgetComparison || budgetComparison.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Budget vs Actual
          </CardTitle>
          <CardDescription>Your spending vs budget comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-black mb-2">No budget data available</p>
            <p className="text-sm text-gray-600">
              Set up budgets to see spending comparisons
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Budget vs Actual
            </CardTitle>
            <CardDescription>
              Compare your spending against set budgets
            </CardDescription>
          </div>
          <div className="sm:min-w-[180px]">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {budgetComparison?.map((item) => (
                  <SelectItem key={item.category} value={item.category}>
                    {item.category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      {/* Low funds notification when viewing existing budgets */}
      {totalAmount <= 0 && budgetComparison && budgetComparison.length > 0 && (
        <div className="mx-6 mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-orange-600">⚠️</span>
            <span className="text-orange-800">
              <strong>No funds available for new budgets</strong> - Current
              balance: {formatCurrency(totalAmount)}. Add more income to create
              additional budgets.
            </span>
          </div>
        </div>
      )}

      <CardContent>
        {!selectedCategory ? (
          <div className="text-center py-8 bg-finance-card rounded-lg border border-gray-300">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-black mb-2">
              Please select a category to view comparison
            </p>
            <p className="text-sm text-gray-600">
              Choose a category from the dropdown above
            </p>
          </div>
        ) : filteredBudgetData.length === 0 ? (
          <div className="text-center py-8 bg-finance-card rounded-lg border border-gray-300">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-black mb-2">No data for selected category</p>
            <p className="text-sm text-gray-600">
              Try selecting a different category
            </p>
          </div>
        ) : (
          <>
            <div className="h-64 sm:h-80 ">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredBudgetData}
                  margin={{
                    top: 20,
                    right: 15,
                    left: 10,
                    bottom: 5,
                  }}
                  barCategoryGap="2%"
                  barGap={5}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="category"
                    tick={{ fontSize: 10 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#374151" }}
                    tickFormatter={(value) => formatCurrency(value)}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar
                    dataKey="budgeted"
                    fill="#3b82f6"
                    name="Budgeted"
                    radius={[2, 2, 0, 0]}
                    maxBarSize={60}
                  />
                  <Bar
                    dataKey="spent"
                    fill="#ef4444"
                    name="Spent"
                    radius={[2, 2, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Status indicators */}
            <div className="mt-4 space-y-2">
              {filteredBudgetData.map((item) => (
                <div
                  key={item.category}
                  className="flex flex-col text-black sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg bg-gray-50/80 border border-gray-100 gap-2"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        item.status === "over"
                          ? "bg-red-500"
                          : item.status === "warning"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    />
                    <span className="font-medium">{item.category}</span>
                  </div>
                  <div className="text-left sm:text-right text-sm">
                    <div
                      className={`font-semibold ${
                        item.status === "over"
                          ? "text-red-600"
                          : item.status === "warning"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {item.percentage.toFixed(1)}% used
                      {item.status === "over" && (
                        <span className="ml-1">
                          (Over by {formatCurrency(Math.abs(item.remaining))})
                        </span>
                      )}
                    </div>
                    <div className="text-gray-500">
                      {item.status === "over"
                        ? "Budget exceeded"
                        : `${formatCurrency(item.remaining)} remaining`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
