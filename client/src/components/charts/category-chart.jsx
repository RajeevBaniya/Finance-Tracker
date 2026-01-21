"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFinancial } from "@/features/financial/context/financial-context";
import { TRANSACTION_CATEGORIES } from "@/config/stages";

const CustomTooltip = ({ active, payload, formatCurrency }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-medium flex items-center gap-2">
          <span>{data.payload.icon}</span>
          {data.payload.category}
        </p>
        <p className="text-blue-600">
          Amount: {formatCurrency(Math.abs(data.value))}
        </p>
        <p className="text-gray-600 text-sm">
          {data.payload.count} transaction{data.payload.count !== 1 ? "s" : ""}
        </p>
        <p className="text-gray-600 text-sm">
          {data.payload.percentage}% of total
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  payload,
}) => {
  const RADIAN = Math.PI / 180;

  const labelDistance = outerRadius < 50 ? 8 : outerRadius < 80 ? 15 : 20;
  const radius = outerRadius + labelDistance;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const threshold = outerRadius < 50 ? 0.08 : 0.03;
  if (percent < threshold) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#374151"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={outerRadius < 50 ? "10" : outerRadius < 80 ? "11" : "12"}
      fontWeight="600"
    >
      {`${(percent * 100).toFixed(outerRadius < 50 ? 0 : 1)}%`}
    </text>
  );
};

export function CategoryChart() {
  const { categoryData, loading, formatCurrency } = useFinancial();
  const [chartRadius, setChartRadius] = useState(55);

  useEffect(() => {
    const updateRadius = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setChartRadius(55); // Mobile - increased from 45
      } else if (width < 1024) {
        setChartRadius(85); // Tablet - increased from 75
      } else {
        setChartRadius(95); // Desktop - kept same
      }
    };

    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Spending by category</CardDescription>
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

  if (!categoryData || categoryData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[160px] sm:h-[200px] lg:h-[240px] flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <p className="text-sm sm:text-base text-black font-medium">
                No category data available
              </p>
              <p className="text-xs sm:text-sm text-gray-600">
                Add some transactions to see category breakdown
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalAmount = categoryData.reduce(
    (sum, item) => sum + Math.abs(item.amount || 0),
    0
  );

  const processedData = categoryData
    .map((item) => {

      const normalizedCategory = item.category.toLowerCase().trim();
      const categoryInfo = TRANSACTION_CATEGORIES.find(
        (cat) => cat.value === normalizedCategory
      ) || { icon: "📝", color: "#6b7280" };

      const percentage =
        totalAmount > 0
          ? ((Math.abs(item.amount || 0) / totalAmount) * 100).toFixed(1)
          : 0;

      return {
        category: item.category, // Use the display name from the data
        value: Math.abs(item.amount || 0), // Use absolute value for pie chart
        count: item.count || 1, // Default to 1 if count doesn't exist
        color: item.color || categoryInfo.color,
        icon: item.icon || categoryInfo.icon,
        percentage: parseFloat(percentage),
      };
    })
    .sort((a, b) => b.value - a.value); // Sort by amount descending

  const threshold = 1.0; // 1%
  const mainCategories = processedData.filter(
    (item) => item.percentage >= threshold
  );
  const smallCategories = processedData.filter(
    (item) => item.percentage < threshold
  );

  let chartData;
  if (smallCategories.length > 3) {

    const othersTotal = smallCategories.reduce(
      (sum, item) => sum + item.value,
      0
    );
    const othersCount = smallCategories.reduce(
      (sum, item) => sum + item.count,
      0
    );
    const othersPercentage = smallCategories.reduce(
      (sum, item) => sum + item.percentage,
      0
    );

    chartData = [
      ...mainCategories,
      {
        category: `Others (${smallCategories.length} categories)`,
        value: othersTotal,
        count: othersCount,
        color: "#9ca3af",
        icon: "📊",
        percentage: othersPercentage,
        isOthers: true,
        smallCategories: smallCategories,
      },
    ];
  } else {
    chartData = processedData;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
        <CardDescription>
          Spending across {chartData.length} categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[160px] sm:h-[200px] lg:h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={chartRadius}
                fill="#8884d8"
                dataKey="value"
                minAngle={3}
                stroke="#fff"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={(props) => (
                  <CustomTooltip {...props} formatCurrency={formatCurrency} />
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {}
        <div className="space-y-2">
          {chartData.map((item, index) => (
            <div key={index}>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm sm:text-base">{item.icon}</span>
                  <span className="font-medium text-black truncate">
                    {item.category}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <div>
                    <span className="font-semibold text-black">
                      {formatCurrency(item.value)}
                    </span>
                    <span className="text-gray-600">
                      {" "}
                      ({item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
              </div>

              {}
              {item.isOthers && item.smallCategories && (
                <div className="ml-5 mt-2 space-y-1 border-l-2 border-gray-200 pl-3">
                  {item.smallCategories.map((small, smallIndex) => (
                    <div
                      key={smallIndex}
                      className="flex items-center justify-between text-xs text-gray-600"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: small.color }}
                        />
                        <span>{small.icon}</span>
                        <span>{small.category}</span>
                      </div>
                      <div>
                        <span>{formatCurrency(small.value)}</span>
                        <span className="text-gray-200">
                          {" "}
                          ({small.percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
