"use client";

import React from "react";
import { useBudget } from "@/features/budget/context/budget-context";
import { useFinancial } from "@/features/financial/context/financial-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Target, Banknote } from "lucide-react";

export function SpendingInsights({ selectedCategory }) {
  const { spendingInsights, budgets, loading, budgetComparison } = useBudget();
  const { formatCurrency, allTimeData, totalIncome } = useFinancial();

  const { totalAmount } = allTimeData;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Spending Insights
          </CardTitle>
          <CardDescription>Loading insights...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!totalIncome || totalIncome <= 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Spending Insights
          </CardTitle>
          <CardDescription>
            Add income to view spending insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-black mb-2">No income found</p>
            <p className="text-sm text-gray-600">
              Add deposits first to get spending insights and budget analysis
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }



  if (!budgets || budgets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Spending Insights
          </CardTitle>
          <CardDescription>Your spending patterns and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-black mb-2">No insights available</p>
            <p className="text-sm text-gray-600">
              Set up budgets to get spending insights
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  let insights = spendingInsights || {};
  let filteredBudgets = budgets;
  let filteredBudgetComparison = budgetComparison;
  if (selectedCategory) {
    filteredBudgets = budgets.filter((b) => b.category === selectedCategory);
    filteredBudgetComparison = budgetComparison.filter(
      (b) => b.category === selectedCategory
    );

    if (filteredBudgets.length > 0) {
      const totalBudget = filteredBudgets.reduce(
        (sum, b) => sum + (b.amount || 0),
        0
      );
      const totalSpent = filteredBudgetComparison.reduce(
        (sum, b) => sum + (b.spent || 0),
        0
      );

      const actualRemaining = totalBudget - totalSpent;

      const budgetRemaining = actualRemaining > 0 ? actualRemaining : 0;
      const categoriesOverBudget = filteredBudgetComparison.filter(
        (b) => b.spent > b.budgeted
      ).length;
      insights = {
        totalBudget,
        totalSpent,
        budgetRemaining,
        actualRemaining,
        categoriesOverBudget,
      };
    }
  }

  const currentMonth = new Date().toLocaleDateString("en-US", {
    month: "long",
  });

  const budgetUtilization =
    insights.totalBudget > 0
      ? (insights.totalSpent / insights.totalBudget) * 100
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Spending Insights
        </CardTitle>
        <CardDescription>
          Your spending patterns for {currentMonth}
        </CardDescription>
      </CardHeader>

      {}
      {totalAmount <= 0 && budgets && budgets.length > 0 && (
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
        {}
        <div className="mb-4 p-3 bg-gray-50/80 rounded-lg border border-gray-100">
          <h4 className="font-medium text-gray-800 mb-1">
            Monthly Overview
            {selectedCategory
              ? ` - ${selectedCategory}`
              : " - Select a Category"}
          </h4>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm text-gray-600">
            {selectedCategory ? (
              <>
                <span>
                  Total Budget: {formatCurrency(insights.totalBudget || 0)}
                </span>
                {budgets.length > 0 && (
                  <>
                    <span className="hidden sm:inline">|</span>
                    <span>Categories with Budgets: {budgets.length}</span>
                  </>
                )}
              </>
            ) : (
              <span>Select a category to view budget details</span>
            )}
          </div>
        </div>

        {}
        {selectedCategory ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {}
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Banknote className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  Total Spent
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-red-900">
                {formatCurrency(insights.totalSpent || 0)}
              </div>
              <div className="text-xs text-red-600 mt-1">
                {selectedCategory}
              </div>
            </div>

            {}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  Budget Remaining
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-green-900">
                {formatCurrency(insights.budgetRemaining || 0)}
              </div>
              <div className="text-xs text-green-600 mt-1">
                {selectedCategory}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 bg-finance-card rounded-lg border border-gray-300 mb-6">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-black mb-2">
              Select a category to view spending insights
            </p>
          </div>
        )}

        {}
        {selectedCategory && (
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
              <span className="text-sm font-medium">Budget Utilization</span>
              <span className="text-sm text-black">
                {budgetUtilization.toFixed(1)}% used
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 border border-gray-300">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  budgetUtilization > 100
                    ? "bg-red-500"
                    : budgetUtilization > 80
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${Math.min(100, budgetUtilization)}%` }}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-gray-600 mt-1 gap-1">
              <span>Spent: {formatCurrency(insights.totalSpent || 0)}</span>
              <span>Budget: {formatCurrency(insights.totalBudget || 0)}</span>
            </div>
            {budgetUtilization > 100 && (
              <div className="mt-2 text-xs text-red-600">
                Over budget by{" "}
                {formatCurrency(Math.abs(insights.actualRemaining || 0))}
              </div>
            )}
          </div>
        )}

        {}
        {selectedCategory && insights.categoriesOverBudget > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-800">Budget Alert</span>
            </div>
            <p className="text-red-700 text-sm">
              You have exceeded your budget for {selectedCategory}.
            </p>
          </div>
        )}

        {}
        {filteredBudgetComparison && filteredBudgetComparison.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-black mb-3">
              Category Spending Breakdown
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredBudgetComparison.map((category) => (
                <div
                  key={category.category}
                  className="bg-gray-50/80 text-black p-3 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">
                      {category.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        category.status === "over"
                          ? "bg-red-100 text-red-800"
                          : category.status === "warning"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {category.status === "over"
                        ? "Over"
                        : category.status === "warning"
                        ? "Warning"
                        : "On Track"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">
                      Budgeted: {formatCurrency(category.budgeted)}
                    </span>
                    <span className="text-xs text-gray-600">
                      Spent: {formatCurrency(category.spent)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-600">
                      Remaining: {formatCurrency(category.remaining)}
                    </span>
                    <span className="text-xs text-gray-600">
                      {category.percentage.toFixed(1)}% used
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {}
        {selectedCategory && (
          <div className="mt-6 p-4 bg-gray-50/80 rounded-lg border border-gray-100">
            <h4 className="font-medium text-blue-800 mb-2">💡 Quick Tips</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              {budgetUtilization > 90 && (
                <li>
                  • You're close to your budget limit. Consider reducing
                  spending.
                </li>
              )}
              {insights.categoriesOverBudget === 0 &&
                budgetUtilization < 80 && (
                  <li>
                    • Great job staying within budget! Keep up the good spending
                    habits.
                  </li>
                )}
              {budgetUtilization > 50 && budgetUtilization < 80 && (
                <li>
                  • You're on track with your spending. Consider setting aside
                  the remaining budget for savings.
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
