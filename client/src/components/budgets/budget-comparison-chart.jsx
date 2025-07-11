"use client";

import { useState } from "react";
import { useBudget } from "@/context/budget-context.jsx";
import { useFinancial } from "@/context/financial-context.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const { formatCurrency } = useFinancial();

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
            <p className="text-finance-lightText">
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
            <p className="text-finance-lightText mb-2">
              No budget data available
            </p>
            <p className="text-sm text-gray-400">
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
                <SelectValue placeholder="Select category" />
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
      <CardContent>
        {filteredBudgetData.length === 0 ? (
          <div className="text-center py-8">
            <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-finance-lightText mb-2">
              No data for selected category
            </p>
            <p className="text-sm text-finance-lightText">
              Try selecting a different category or "All Categories"
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
                    tick={{ fontSize: 10, fill: "#D1D5DB" }}
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
                  className="flex flex-col text-black sm:flex-row sm:items-center sm:justify-between p-3 rounded-lg bg-gray-50 gap-2"
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
                    </div>
                    <div className="text-gray-500">
                      {formatCurrency(item.remaining)} remaining
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
