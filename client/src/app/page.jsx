"use client";

import { TransactionList } from "@/components/transactions/transaction-list";
import { CategoryChart } from "@/components/charts/category-chart";
import { MonthlyBarChart } from "@/components/charts/monthly-bar-chart";
import { useFinancial } from "@/context/financial-context.jsx";
import { CurrencySelector } from "@/components/ui/currency-selector";
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
  } = useFinancial();

  // Calculate some dashboard stats
  const totalTransactions = records.length;
  const thisMonthTransactions = records.filter((record) => {
    const recordDate = new Date(record.date);
    const now = new Date();
    return (
      recordDate.getMonth() === now.getMonth() &&
      recordDate.getFullYear() === now.getFullYear()
    );
  }).length;

  // Calculate savings rate
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Stack on mobile, side-by-side on desktop */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
        </div>
        <div className="self-start sm:self-auto">
          <CurrencySelector />
        </div>
      </div>

      {/* Summary Cards - Responsive Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
              Total Expenses
            </CardTitle>
            <Banknote className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-1 sm:pt-2">
            <div className="text-sm sm:text-lg lg:text-xl font-bold text-red-600 break-words">
              {formatCurrency(totalExpenses)}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
              Total Transactions
            </CardTitle>
            <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-1 sm:pt-2">
            <div className="text-sm sm:text-lg lg:text-xl font-bold">
              {totalTransactions}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
              This Month
            </CardTitle>
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-1 sm:pt-2">
            <div className="text-sm sm:text-lg lg:text-xl font-bold">
              {thisMonthTransactions}
            </div>
            <p className="text-xs text-muted-foreground">transactions</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
              Total Balance
            </CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
          </CardHeader>
          <CardContent className="pt-1 sm:pt-2">
            <div
              className={`text-sm sm:text-lg lg:text-xl font-bold break-words ${
                totalAmount >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(totalAmount)}
            </div>
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
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your latest financial transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction._id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">
                        {transaction.description}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-300">
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
                      <p className="text-xs text-gray-300">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm sm:text-base text-finance-lightText">
                  No transactions yet
                </p>
                <p className="text-xs sm:text-sm">
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
