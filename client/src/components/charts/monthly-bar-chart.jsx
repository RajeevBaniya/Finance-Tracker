"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFinancial } from "@/features/financial";

// Custom tooltip for the bar chart
const CustomTooltip = ({ active, payload, label, formatCurrency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium">{label}</p>
        <p className="text-blue-600">
          Spending: {formatCurrency(payload[0].value)}
        </p>
        <p className="text-gray-600 text-sm">
          Transactions: {payload[0].payload.count}
        </p>
      </div>
    );
  }
  return null;
};

export function MonthlyBarChart() {
  const { records, loading, totalIncome, totalExpenses, formatCurrency } =
    useFinancial();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending</CardTitle>
          <CardDescription>Your spending over the last months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[160px] sm:h-[200px] lg:h-[240px] flex items-center justify-center">
            <div className="animate-pulse text-gray-500 text-sm sm:text-base">
              Loading chart...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!records || records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending</CardTitle>
          <CardDescription>Your spending over the last months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[160px] sm:h-[200px] lg:h-[240px] flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <p className="text-sm sm:text-base text-black font-medium">
                No data available
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                Add some transactions to see spending trends
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process data for monthly bar chart
  const processData = () => {
    const monthlyData = {};

    records.forEach((record) => {
      // Only process expenses (negative amounts)
      if (record.amount < 0) {
        const date = new Date(record.date);
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;
        const monthName = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthName,
            amount: 0,
            count: 0,
            date: date,
          };
        }

        monthlyData[monthKey].amount += Math.abs(record.amount);
        monthlyData[monthKey].count += 1;
      }
    });

    // Convert to array and sort by date
    const chartData = Object.values(monthlyData)
      .sort((a, b) => a.date - b.date)
      .map((item) => ({
        month: item.month,
        amount: item.amount,
        count: item.count,
      }));

    return chartData;
  };

  const chartData = processData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending</CardTitle>
        <CardDescription>
          Your spending over the last {chartData.length} months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[160px] sm:h-[200px] lg:h-[240px] ">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 5,
              }}
              barGap={0} // No gap between bars in the same category group
              barCategoryGap={5} // Minimal gap between different category groups
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#d1d5db" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 10, fill: "#374151" }}
                tickLine={{ stroke: "#6b7280" }}
                axisLine={{ stroke: "#6b7280" }}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#374151" }}
                tickLine={{ stroke: "#6b7280" }}
                axisLine={{ stroke: "#6b7280" }}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                content={(props) => (
                  <CustomTooltip {...props} formatCurrency={formatCurrency} />
                )}
              />
              <Bar
                dataKey="amount"
                fill="#3b82f6"
                radius={[2, 2, 0, 0]}
                maxBarSize={35}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Income/Expenses Summary Stats - Responsive Grid */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-center">
          <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
            <div className="text-xs sm:text-sm text-green-600 font-medium">
              Total Income
            </div>
            <div className="text-sm sm:text-lg font-bold text-green-700 break-words overflow-hidden">
              {formatCurrency(totalIncome)}
            </div>
          </div>
          <div className="p-2 sm:p-3 bg-red-50 rounded-lg">
            <div className="text-xs sm:text-sm text-red-600 font-medium">
              Total Expenses
            </div>
            <div className="text-sm sm:text-lg font-bold text-red-700 break-words overflow-hidden">
              {formatCurrency(totalExpenses)}
            </div>
          </div>
          <div className="p-2 sm:p-3 bg-yellow-50 rounded-lg">
            <div className="text-xs sm:text-sm text-yellow-600 font-medium">
              Net Savings
            </div>
            <div className="text-sm sm:text-lg font-bold text-yellow-700 break-words overflow-hidden">
              {formatCurrency(totalIncome - totalExpenses)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
