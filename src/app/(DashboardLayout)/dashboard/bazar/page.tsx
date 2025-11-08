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
  useGetBazarsQuery,
  useAddBazarMutation,
} from "@/redux/api/bazarApi";
import { useGetMembersQuery } from "@/redux/api/memberApi";
import { Plus, Loader2, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export default function BazarPage() {
  const now = new Date();
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [year, setYear] = useState<number>(now.getFullYear());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    paidById: "",
  });

  const { data: membersData } = useGetMembersQuery();
  const { data: bazarsData, isLoading, refetch } = useGetBazarsQuery({ month, year });
  const [addBazar, { isLoading: isAdding }] = useAddBazarMutation();

  // Extract data from API response
  const members = Array.isArray(membersData)
    ? membersData
    : membersData?.data
    ? Array.isArray(membersData.data)
      ? membersData.data
      : []
    : [];

  const bazars = Array.isArray(bazarsData)
    ? bazarsData
    : bazarsData?.data
    ? Array.isArray(bazarsData.data)
      ? bazarsData.data
      : []
    : [];

  // Calculate total bazar
  const totalBazar = bazars.reduce((sum: number, bazar: any) => sum + (bazar.amount || 0), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      await addBazar({
        amount: parseFloat(formData.amount),
        description: formData.description || undefined,
        paidById: formData.paidById || undefined,
      }).unwrap();

      Swal.fire({
        title: "Success!",
        text: "Bazar entry added successfully",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      setIsDialogOpen(false);
      setFormData({ amount: "", description: "", paidById: "" });
      refetch();
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error?.data?.message || "Failed to add bazar entry. Please try again.",
        icon: "error",
      });
    }
  };

  const getMemberName = (memberId: string) => {
    const member = members.find((m: any) => m._id === memberId);
    return member?.name || "Unknown";
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
          <h1 className="text-3xl font-bold text-gray-900">Bazar</h1>
          <p className="text-gray-600 mt-1">Manage market purchases and expenses</p>
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
            Add Purchase
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Total Bazar - {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600">৳{totalBazar.toFixed(2)}</div>
          <p className="text-sm text-gray-500 mt-1">{bazars.length} purchase entries</p>
        </CardContent>
      </Card>

      {/* Bazar List */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {bazars.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No bazar entries found for this month. Add your first purchase to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Paid By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bazars.map((bazar: any) => (
                  <TableRow key={bazar._id}>
                    <TableCell>
                      {new Date(bazar.createdAt).toLocaleDateString('en-BD', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </TableCell>
                    <TableCell className="font-medium">৳{bazar.amount?.toFixed(2) || '0.00'}</TableCell>
                    <TableCell>{bazar.description || "-"}</TableCell>
                    <TableCell>{bazar.paidById ? getMemberName(bazar.paidById) : "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Bazar Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Purchase</DialogTitle>
            <DialogDescription>
              Add a new market purchase entry for this month.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
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
                  placeholder="What did you buy? (optional)"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paidBy">Paid By (Optional)</Label>
                <select
                  id="paidBy"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.paidById}
                  onChange={(e) =>
                    setFormData({ ...formData, paidById: e.target.value })
                  }
                >
                  <option value="">Select member (optional)</option>
                  {members.map((member: any) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </select>
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
                Add Purchase
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
