"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  useAddMemberMutation,
  useGetMembersQuery,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  type Member,
  type AddMemberRequest,
} from "@/redux/api/memberApi";
import { Edit2, Trash2, Plus, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

export default function MembersPage() {
  const { data, isLoading, isError, refetch } = useGetMembersQuery();
  const [addMember, { isLoading: isAdding }] = useAddMemberMutation();
  const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();
  const [deleteMember] = useDeleteMemberMutation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState<AddMemberRequest>({
    name: "",
    phone: "",
    khalakhaFee: 700,
    active: true,
  });

  // Extract members from response (handle different response structures)
  const members: Member[] = (() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (typeof data === 'object' && 'data' in data) {
      const dataProp = (data as { data?: unknown }).data;
      if (Array.isArray(dataProp)) return dataProp;
    }
    return [];
  })();

  // Reset form when dialog closes
  useEffect(() => {
    if (!isDialogOpen) {
      setEditingMember(null);
      setFormData({
        name: "",
        phone: "",
        khalakhaFee: 700,
        active: true,
      });
    }
  }, [isDialogOpen]);

  // Populate form when editing
  useEffect(() => {
    if (editingMember) {
      setFormData({
        name: editingMember.name,
        phone: editingMember.phone || "",
        khalakhaFee: editingMember.khalakhaFee || 700,
        active: editingMember.active !== undefined ? editingMember.active : true,
      });
    }
  }, [editingMember]);

  const handleOpenDialog = (member?: Member) => {
    if (member) {
      setEditingMember(member);
    } else {
      setEditingMember(null);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Name is required",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    try {
      if (editingMember) {
        // Update member
        await updateMember({
          id: editingMember._id,
          ...formData,
        }).unwrap();
        
        Swal.fire({
          title: "Success!",
          text: "Member updated successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        // Add new member
        await addMember(formData).unwrap();
        
        Swal.fire({
          title: "Success!",
          text: "Member added successfully",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
      
      setIsDialogOpen(false);
      refetch();
    } catch (error: unknown) {
      const errorMessage = 
        (error as { data?: { message?: string } })?.data?.message || 
        "Failed to save member. Please try again.";
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
      });
    }
  };

  const handleDelete = async (member: Member) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${member.name}". This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "border-2 border-red-200 rounded-lg shadow-xl",
        confirmButton: "bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md",
        cancelButton: "bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md",
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        await deleteMember(member._id).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: `Member "${member.name}" has been removed.`,
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
        refetch();
      } catch (error: unknown) {
        const errorMessage = 
          (error as { data?: { message?: string } })?.data?.message || 
          "Failed to delete member. Please try again.";
        Swal.fire({
          title: "Error!",
          text: errorMessage,
          icon: "error",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center text-red-500">
            Failed to load members. Please try again later.
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-600 mt-1">Manage mess members and their details</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Member List</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No members found. Add your first member to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Khalakha Fee</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.phone || "-"}</TableCell>
                    <TableCell>৳{member.khalakhaFee || 700}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.active !== false
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {member.active !== false ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(member)}
                          className="h-8 w-8"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(member)}
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Member Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit Member" : "Add New Member"}
            </DialogTitle>
            <DialogDescription>
              {editingMember
                ? "Update member information below."
                : "Fill in the details to add a new member to the mess."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter member name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="khalakhaFee">Khalakha Fee (৳)</Label>
                <Input
                  id="khalakhaFee"
                  type="number"
                  placeholder="700"
                  value={formData.khalakhaFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      khalakhaFee: parseInt(e.target.value) || 700,
                    })
                  }
                  min="0"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="active"
                  checked={formData.active}
                  onChange={(e) =>
                    setFormData({ ...formData, active: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="active" className="cursor-pointer">
                  Active Member
                </Label>
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
              <Button type="submit" disabled={isAdding || isUpdating}>
                {(isAdding || isUpdating) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingMember ? "Update" : "Add"} Member
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

