"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMonthlyReportQuery } from "@/redux/api/reportApi";
import { Download, Loader2, FileText } from "lucide-react";

export default function ReportPage() {
  const now = new Date();
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [year, setYear] = useState<number>(now.getFullYear());

  const { data: reportData, isLoading, isError } = useGetMonthlyReportQuery({ month, year });

  // Extract report data - handle both response formats
  const report = (() => {
    if (!reportData) return null;
    if (reportData.data) return reportData.data;
    if (reportData.totalMealCount !== undefined) return reportData; // Direct report object
    return null;
  })();

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    alert("PDF export functionality will be implemented soon!");
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export
    alert("Excel export functionality will be implemented soon!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center text-red-500">
            Failed to load report. Please try again later.
          </CardContent>
        </Card>
      </div>
    );
  }

  const {
    totalMealCount = 0,
    marketTotal = 0,
    mealRate = 0,
    billSum = 0,
    memberSummaries = [],
  } = report;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monthly Report</h1>
          <p className="text-gray-600 mt-1">
            View and export monthly reports for {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-4 items-end">
          <div>
            <Label>Month</Label>
            <Input
              type="number"
              min={1}
              max={12}
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="w-20"
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
              className="w-24"
            />
          </div>
          <div className="flex gap-2">
            <Button className="gap-2" variant="outline" onClick={handleExportPDF}>
              <Download className="h-4 w-4" />
              PDF
            </Button>
            <Button className="gap-2" variant="outline" onClick={handleExportExcel}>
              <FileText className="h-4 w-4" />
              Excel
            </Button>
          </div>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Bazar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">৳{marketTotal.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Meal Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">৳{mealRate.toFixed(2)}</div>
            <p className="text-xs text-gray-500 mt-1">per meal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Total Bills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">৳{billSum.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Member-wise Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Member-wise Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {memberSummaries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No data available for this month.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead className="text-right">Meal Count</TableHead>
                    <TableHead className="text-right">Meal Cost</TableHead>
                    <TableHead className="text-right">Bill Share</TableHead>
                    <TableHead className="text-right">Khalakha Fee</TableHead>
                    <TableHead className="text-right">Payments</TableHead>
                    <TableHead className="text-right font-bold">Total Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberSummaries.map((member: any) => {
                    const totalDue = member.totalDue || 0;
                    return (
                      <TableRow key={member.member?._id || member.memberId}>
                        <TableCell className="font-medium">
                          {member.member?.name || "Unknown"}
                        </TableCell>
                        <TableCell className="text-right">{member.mealCount || 0}</TableCell>
                        <TableCell className="text-right">
                          ৳{(member.mealCost || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ৳{(member.billShare || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ৳{(member.khalakhaFee || 0).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          -৳{(member.payments || 0).toFixed(2)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-bold ${
                            totalDue > 0 ? "text-red-600" : totalDue < 0 ? "text-green-600" : "text-gray-600"
                          }`}
                        >
                          {totalDue > 0 ? "৳" : totalDue < 0 ? "-৳" : "৳"}
                          {Math.abs(totalDue).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calculation Formula Info */}
      <Card>
        <CardHeader>
          <CardTitle>Calculation Formula</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Meal Rate:</strong> Total Bazar ÷ Total Meals = ৳{mealRate.toFixed(2)} per meal
            </p>
            <p>
              <strong>Meal Cost:</strong> Member Meals × Meal Rate
            </p>
            <p>
              <strong>Bill Share:</strong> (Gas + Current + WiFi) ÷ Total Active Members
            </p>
            <p>
              <strong>Total Due:</strong> Meal Cost + Bill Share + Khalakha Fee - Payments
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
