/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetMonthlyReportQuery } from "@/redux/api/reportApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


export default function DashboardPage() {
  const now = new Date();
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [year, setYear] = useState<number>(now.getFullYear());

  const { data, isLoading } = useGetMonthlyReportQuery({ month, year });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Extract report data - handle both response formats
  const report = (() => {
    if (!data) return null;
    if (data.data) return data.data;
    if (data.totalMealCount !== undefined) return data; // Direct report object
    return null;
  })();

  if (!report) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            No data available for this month. Please add meals, bazar, and bills to see the dashboard.
          </CardContent>
        </Card>
      </div>
    );
  }

  const memberSummaries = report.memberSummaries || [];
  const totalMealCount = report.totalMealCount || 0;
  const marketTotal = report.marketTotal || 0;
  const mealRate = report.mealRate || 0;
  const billSum = report.billSum || 0;

  const chartData = memberSummaries.map((m: any) => ({
    name: m.member?.name || m.memberName || "Unknown",
    mealCount: m.mealCount || 0,
    totalDue: m.totalDue || 0,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Month-Year Selector */}
      <div className="flex space-x-4">
        <div>
          <Label>Month</Label>
          <Input
            type="number"
            min={1}
            max={12}
            value={month}
            onChange={(e:any) => setMonth(Number(e.target.value))}
          />
        </div>
        <div>
          <Label>Year</Label>
          <Input
            type="number"
            min={2000}
            max={2100}
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMealCount}</div>
            <p className="text-xs text-gray-500 mt-1">Breakfast + Dinner</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Bazar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">৳{marketTotal.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">Market expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Meal Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">৳{mealRate.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">Per meal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Bill Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">৳{billSum.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">Gas + Current + WiFi</p>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart: Member Meal Count & Total Due */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Member-wise Meal Count & Total Due</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="mealCount" fill="#4f46e5" name="Meal Count" />
                <Bar dataKey="totalDue" fill="#14b8a6" name="Total Due (৳)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Optional Table: Member Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Member Summary Table</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border p-2">Member</th>
                <th className="border p-2">Meal Count</th>
                <th className="border p-2">Meal Cost</th>
                <th className="border p-2">Bill Share</th>
                <th className="border p-2">Khalakha Fee</th>
                <th className="border p-2">Payments</th>
                <th className="border p-2">Total Due</th>
              </tr>
            </thead>
            <tbody>
              {memberSummaries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="border p-4 text-center text-gray-500">
                    No data available for this month.
                  </td>
                </tr>
              ) : (
                memberSummaries.map((m: any) => {
                  const totalDue = m.totalDue || 0;
                  return (
                    <tr key={m.member?._id || m.memberId}>
                      <td className="border p-2 font-medium">
                        {m.member?.name || m.memberName || "Unknown"}
                      </td>
                      <td className="border p-2">{m.mealCount || 0}</td>
                      <td className="border p-2">৳{(m.mealCost || 0).toFixed(2)}</td>
                      <td className="border p-2">৳{(m.billShare || 0).toFixed(2)}</td>
                      <td className="border p-2">৳{(m.khalakhaFee || 0).toFixed(2)}</td>
                      <td className="border p-2 text-green-600">-৳{(m.payments || 0).toFixed(2)}</td>
                      <td
                        className={`border p-2 font-bold ${
                          totalDue > 0 ? "text-red-600" : totalDue < 0 ? "text-green-600" : "text-gray-600"
                        }`}
                      >
                        {totalDue > 0 ? "৳" : totalDue < 0 ? "-৳" : "৳"}
                        {Math.abs(totalDue).toFixed(2)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
