"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetBillQuery, useSetBillMutation } from "@/redux/api/billApi";
import { Receipt, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function BillsPage() {
  const now = new Date();
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [year, setYear] = useState<number>(now.getFullYear());
  const [formData, setFormData] = useState({
    gas: "",
    current: "",
    wifi: "",
  });

  const { data: billData, isLoading, refetch } = useGetBillQuery({ month, year });
  const [setBill, { isLoading: isSaving }] = useSetBillMutation();

  // Extract bill data - handle both response formats
  const bill = (() => {
    if (!billData) return null;
    if (billData.data) return billData.data;
    if (billData.month) return billData; // Direct bill object
    return null;
  })();

  // Populate form when bill data is loaded
  useEffect(() => {
    if (bill) {
      setFormData({
        gas: bill.gas?.toString() || "",
        current: bill.current?.toString() || "",
        wifi: bill.wifi?.toString() || "",
      });
    } else {
      setFormData({
        gas: "",
        current: "",
        wifi: "",
      });
    }
  }, [bill, month, year]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const gas = parseFloat(formData.gas) || 0;
    const current = parseFloat(formData.current) || 0;
    const wifi = parseFloat(formData.wifi) || 0;

    if (gas < 0 || current < 0 || wifi < 0) {
      Swal.fire({
        title: "Validation Error",
        text: "Amounts cannot be negative",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      await setBill({
        month,
        year,
        gas,
        current,
        wifi,
      }).unwrap();

      Swal.fire({
        title: "Success!",
        text: "Bills saved successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      refetch();
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error?.data?.message || "Failed to save bills. Please try again.",
        icon: "error",
      });
    }
  };

  const totalBill = (parseFloat(formData.gas) || 0) + (parseFloat(formData.current) || 0) + (parseFloat(formData.wifi) || 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Monthly Bills</h1>
          <p className="text-gray-600 mt-1">Manage monthly bills (Gas, Current, WiFi)</p>
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
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Bills for {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gas">
                  Gas Bill (৳)
                </Label>
                <Input
                  id="gas"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.gas}
                  onChange={(e) =>
                    setFormData({ ...formData, gas: e.target.value })
                  }
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current">
                  Current/Electricity Bill (৳)
                </Label>
                <Input
                  id="current"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.current}
                  onChange={(e) =>
                    setFormData({ ...formData, current: e.target.value })
                  }
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wifi">
                  WiFi/Internet Bill (৳)
                </Label>
                <Input
                  id="wifi"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.wifi}
                  onChange={(e) =>
                    setFormData({ ...formData, wifi: e.target.value })
                  }
                  min="0"
                />
              </div>
            </div>

            {/* Total Bill Summary */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Bill:</span>
                <span className="text-2xl font-bold text-blue-600">৳{totalBill.toFixed(2)}</span>
              </div>
            </div>

            <Button type="submit" disabled={isSaving} className="w-full md:w-auto">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Bills
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Bill Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Bill Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • Enter the monthly bills for Gas, Current (Electricity), and WiFi/Internet.
            </p>
            <p>
              • The total bill will be divided equally among all active members.
            </p>
            <p>
              • Bill Share per Member = (Gas + Current + WiFi) ÷ Total Active Members
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
