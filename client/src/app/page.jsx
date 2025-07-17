"use client";

import { TransactionList } from "@/components/transactions/transaction-list";
import { CategoryChart } from "@/components/charts/category-chart";
import { MonthlyBarChart } from "@/components/charts/monthly-bar-chart";
import { useFinancial } from "@/features/financial";
import { CurrencySelector } from "@/components/ui/currency-selector";
import { MonthPicker } from "@/components/ui/month-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingUp,
  Receipt,
  Calendar,
  Target,
  Banknote,
  Activity,
} from "lucide-react";

export default function Dashboard() {
  const {
    totalAmount,
    records,
    recentTransactions,
    formatCurrency,
    totalIncome,
    totalExpenses,
    selectedCurrency,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
  } = useFinancial();

  // Calculate some dashboard stats
  const totalTransactions = records.length;
  const thisMonthTransactions = records.filter((record) => {
    const recordDate = new Date(record.date);
    return (
      recordDate.getMonth() === selectedMonth &&
      recordDate.getFullYear() === selectedYear
    );
  }).length;

  // Calculate savings rate
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with Month Picker and Currency Selector */}
      <div className="flex flex-col sm:flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
        <h1 className="text-2xl font-bold text-gray-900 flex-shrink-0">
          Dashboard
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between lg:justify-end gap-3">
          <div className="w-auto sm:w-48">
            <MonthPicker
              selectedMonth={selectedMonth}
              selectedYear={selectedYear}
              onMonthChange={setSelectedMonth}
              onYearChange={setSelectedYear}
            />
          </div>
          <div className="flex-shrink-0">
            <CurrencySelector />
          </div>
        </div>
      </div>

      {/* Summary Cards - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
              Total Income
            </CardTitle>
            <Banknote className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-1 sm:pt-2">
            <div className="text-sm sm:text-lg lg:text-xl font-bold text-green-600 break-words overflow-hidden">
              {formatCurrency(totalIncome)}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
              Total Expenses
            </CardTitle>
            <Banknote className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-1 sm:pt-2">
            <div className="text-sm sm:text-lg lg:text-xl font-bold text-red-600 break-words overflow-hidden">
              {formatCurrency(totalExpenses)}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
              Net Savings
            </CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-1 sm:pt-2">
            <div className="text-sm sm:text-lg lg:text-xl font-bold text-yellow-600 break-words overflow-hidden">
              {formatCurrency(totalIncome - totalExpenses)}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
              This Month
            </CardTitle>
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500 flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-1 sm:pt-2">
            <div className="text-sm sm:text-lg lg:text-xl font-bold text-black break-words overflow-hidden">
              {thisMonthTransactions}
            </div>
            <p className="text-xs text-gray-500">transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Category Breakdown Pie Chart */}
        <div className="min-h-0">
          <CategoryChart />
        </div>

        {/* Monthly Bar Chart */}
        <div className="min-h-0">
          <MonthlyBarChart />
        </div>
      </div>

      {/* Recent Transactions - Mobile Optimized */}
      <div>
        <Card>
          <CardHeader>
            <div className="flex flex-col space-y-3 lg:space-y-0">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>
                    Your latest financial transactions
                  </CardDescription>
                </div>
                {/* Removed CurrencySelector from here for mobile/tablet */}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-400 rounded-lg transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base text-black truncate">
                        {transaction.description}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {transaction.category}
                      </p>
                    </div>
                    <div className="flex justify-between sm:justify-end sm:flex-col sm:text-right mt-2 sm:mt-0 sm:ml-4">
                      <p
                        className={`font-semibold text-sm sm:text-base ${
                          transaction.amount >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm sm:text-base text-black">
                  No transactions yet
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  Add your first transaction to get started
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
