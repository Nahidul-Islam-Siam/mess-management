"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetPaymentsQuery,
  useAddPaymentMutation,
} from "@/redux/api/paymentApi";
import { useGetMembersQuery } from "@/redux/api/memberApi";
import { Plus, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function PaymentsPage() {
  const now = new Date();
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [year, setYear] = useState<number>(now.getFullYear());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    memberId: "",
    amount: "",
    description: "",
  });

  const { data: membersData } = useGetMembersQuery();
  const { data: paymentsData, isLoading, refetch } = useGetPaymentsQuery({ month, year });
  const [addPayment, { isLoading: isAdding }] = useAddPaymentMutation();

  // Extract data from API response
  const members = Array.isArray(membersData)
    ? membersData
    : membersData?.data
    ? Array.isArray(membersData.data)
      ? membersData.data
      : []
    : [];

  const payments = Array.isArray(paymentsData)
    ? paymentsData
    : paymentsData?.data
    ? Array.isArray(paymentsData.data)
      ? paymentsData.data
      : []
    : [];

  // Calculate total payments
  const totalPayments = payments.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0);

  // Group payments by member
  const paymentsByMember = payments.reduce((acc: any, payment: any) => {
    const memberId = payment.memberId;
    if (!acc[memberId]) {
      acc[memberId] = [];
    }
    acc[memberId].push(payment);
    return acc;
  }, {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.memberId) {
      Swal.fire({
        title: "Validation Error",
        text: "Please select a member",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter a valid amount",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      await addPayment({
        memberId: formData.memberId,
        amount: parseFloat(formData.amount),
        description: formData.description || undefined,
      }).unwrap();

      Swal.fire({
        title: "Success!",
        text: "Payment added successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setIsDialogOpen(false);
      setFormData({ memberId: "", amount: "", description: "" });
      refetch();
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error?.data?.message || "Failed to add payment. Please try again.",
        icon: "error",
      });
    }
  };

  const getMemberName = (memberId: string) => {
    const member = members.find((m: any) => m._id === memberId);
    return member?.name || "Unknown";
  };

  const getMemberTotal = (memberId: string) => {
    return paymentsByMember[memberId]?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0;
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Manage member payments</p>
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
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Payment
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Total Payments - {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">৳{totalPayments.toFixed(2)}</div>
          <p className="text-sm text-gray-500 mt-1">{payments.length} payment entries</p>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Records</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No payments found for this month. Add your first payment to get started.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Payment List */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Member</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments
                    .sort((a: any, b: any) => 
                      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                    .map((payment: any) => (
                      <TableRow key={payment._id}>
                        <TableCell>
                          {new Date(payment.createdAt).toLocaleDateString('en-BD', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </TableCell>
                        <TableCell className="font-medium">
                          {getMemberName(payment.memberId)}
                        </TableCell>
                        <TableCell className="font-medium text-green-600">
                          ৳{payment.amount?.toFixed(2) || '0.00'}
                        </TableCell>
                        <TableCell>{payment.description || "-"}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              {/* Member-wise Summary */}
              {Object.keys(paymentsByMember).length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Member-wise Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.keys(paymentsByMember).map((memberId) => (
                      <Card key={memberId}>
                        <CardContent className="pt-4">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{getMemberName(memberId)}</span>
                            <span className="text-lg font-bold text-green-600">
                              ৳{getMemberTotal(memberId).toFixed(2)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Payment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Payment</DialogTitle>
            <DialogDescription>
              Record a payment made by a member for this month.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="member">
                  Member <span className="text-red-500">*</span>
                </Label>
                <select
                  id="member"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.memberId}
                  onChange={(e) =>
                    setFormData({ ...formData, memberId: e.target.value })
                  }
                  required
                >
                  <option value="">Select member</option>
                  {members
                    .filter((m: any) => m.active !== false)
                    .map((member: any) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">
                  Amount (৳) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Payment note (optional)"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isAdding}>
                {isAdding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Payment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
