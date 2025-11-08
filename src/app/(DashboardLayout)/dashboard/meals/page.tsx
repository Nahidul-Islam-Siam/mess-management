"use client";

import { useState, useMemo } from "react";
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
import { useGetMealsQuery, useAddMealMutation } from "@/redux/api/mealApi";
import { useGetMembersQuery } from "@/redux/api/memberApi";
import { Calendar } from "lucide-react";
import Swal from "sweetalert2";
import { Loader2 } from "lucide-react";

export default function MealsPage() {
  const now = new Date();
  const [month, setMonth] = useState<number>(now.getMonth() + 1);
  const [year, setYear] = useState<number>(now.getFullYear());

  const { data: membersData, isLoading: membersLoading } = useGetMembersQuery();
  const { data: mealsData, isLoading: mealsLoading, refetch } = useGetMealsQuery({ month, year });
  const [addMeal, { isLoading: isAdding }] = useAddMealMutation();

  // Extract members and meals from API response
  const members = Array.isArray(membersData) 
    ? membersData 
    : membersData?.data 
    ? Array.isArray(membersData.data) 
      ? membersData.data 
      : []
    : [];

  const meals = Array.isArray(mealsData)
    ? mealsData
    : mealsData?.data
    ? Array.isArray(mealsData.data)
      ? mealsData.data
      : []
    : [];

  // Get active members only
  const activeMembers = members.filter((m: any) => m.active !== false);

  // Get days in selected month
  const daysInMonth = new Date(year, month, 0).getDate();

  // Create a map of meals by date and memberId for quick lookup
  const mealMap = useMemo(() => {
    const map: Record<string, { breakfast: boolean; dinner: boolean }> = {};
    meals.forEach((meal: any) => {
      const date = new Date(meal.date).getDate();
      const key = `${meal.memberId}-${date}`;
      map[key] = {
        breakfast: meal.breakfast || false,
        dinner: meal.dinner || false,
      };
    });
    return map;
  }, [meals]);

  const handleMealToggle = async (
    memberId: string,
    day: number,
    mealType: "breakfast" | "dinner"
  ) => {
    const date = new Date(year, month - 1, day);
    const key = `${memberId}-${day}`;
    const currentMeal = mealMap[key] || { breakfast: false, dinner: false };
    const newValue = !currentMeal[mealType];

    try {
      await addMeal({
        memberId,
        date: date.toISOString(),
        [mealType]: newValue,
        breakfast: mealType === "breakfast" ? newValue : currentMeal.breakfast,
        dinner: mealType === "dinner" ? newValue : currentMeal.dinner,
      }).unwrap();

      refetch();
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error?.data?.message || "Failed to update meal. Please try again.",
        icon: "error",
      });
    }
  };

  const handleBulkEntry = async (day: number, mealType: "breakfast" | "dinner", value: boolean) => {
    const date = new Date(year, month - 1, day);
    
    try {
      const promises = activeMembers.map((member: any) => {
        const key = `${member._id}-${day}`;
        const currentMeal = mealMap[key] || { breakfast: false, dinner: false };
        
        return addMeal({
          memberId: member._id,
          date: date.toISOString(),
          breakfast: mealType === "breakfast" ? value : currentMeal.breakfast,
          dinner: mealType === "dinner" ? value : currentMeal.dinner,
        }).unwrap();
      });

      await Promise.all(promises);
      refetch();
      
      Swal.fire({
        title: "Success!",
        text: `${mealType === "breakfast" ? "Breakfast" : "Dinner"} marked for all members`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error: any) {
      Swal.fire({
        title: "Error!",
        text: error?.data?.message || "Failed to update meals. Please try again.",
        icon: "error",
      });
    }
  };

  if (membersLoading || mealsLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">Meals</h1>
          <p className="text-gray-600 mt-1">Manage daily meal entries (Breakfast & Dinner)</p>
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
          <CardTitle>Daily Meal Entry - {new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-white z-10 min-w-[150px]">Member</TableHead>
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
                    <TableHead key={day} className="text-center min-w-[100px]">
                      <div className="flex flex-col">
                        <span className="text-xs font-normal">{day}</span>
                        <div className="flex gap-1 mt-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleBulkEntry(day, "breakfast", true)}
                            disabled={isAdding}
                          >
                            B
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleBulkEntry(day, "dinner", true)}
                            disabled={isAdding}
                          >
                            D
                          </Button>
                        </div>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={daysInMonth + 1} className="text-center py-8 text-gray-500">
                      No active members found. Please add members first.
                    </TableCell>
                  </TableRow>
                ) : (
                  activeMembers.map((member: any) => (
                    <TableRow key={member._id}>
                      <TableCell className="sticky left-0 bg-white z-10 font-medium">
                        {member.name}
                      </TableCell>
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                        const key = `${member._id}-${day}`;
                        const meal = mealMap[key] || { breakfast: false, dinner: false };
                        return (
                          <TableCell key={day} className="text-center">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => handleMealToggle(member._id, day, "breakfast")}
                                disabled={isAdding}
                                className={`w-8 h-8 rounded border-2 transition-colors ${
                                  meal.breakfast
                                    ? "bg-green-500 border-green-600 text-white"
                                    : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                                }`}
                                title="Breakfast"
                              >
                                B
                              </button>
                              <button
                                onClick={() => handleMealToggle(member._id, day, "dinner")}
                                disabled={isAdding}
                                className={`w-8 h-8 rounded border-2 transition-colors ${
                                  meal.dinner
                                    ? "bg-blue-500 border-blue-600 text-white"
                                    : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                                }`}
                                title="Dinner"
                              >
                                D
                              </button>
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-4 flex gap-4 items-center text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border-2 bg-green-500 border-green-600"></div>
              <span>Breakfast</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border-2 bg-blue-500 border-blue-600"></div>
              <span>Dinner</span>
            </div>
            <div className="ml-4 text-xs">
              <strong>Quick Entry:</strong> Click B/D in header to mark all members for that meal
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
