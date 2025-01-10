"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function RevenueCard() {
  const [totalRevenue, setTotalRevenue] = useState(null);
  const [totalExpense, setTotalExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch total revenue data from the API
  const fetchRevenueData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/revenue", {
        method: "GET",
      });
      const data = await response.json();

      if (data.success) {
        setTotalRevenue(data.totalRevenue);
      } else {
        console.error("Failed to fetch revenue data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpenceData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/sumexpense", {
        method: "GET",
      });
      const data = await response.json();

      if (data.success) {
        setTotalExpense(data.totalAmount);
      } else {
        console.error("Failed to fetch revenue data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchRevenueData();
    fetchExpenceData();
  }, []);

  return (
    <Card className="w-full max-w-sm mx-auto mt-10 shadow-lg">
      <CardHeader>
        <CardTitle>Total Revenue</CardTitle>
        <CardDescription>
          Displaying the total sales revenue from all products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
        <div>
        {loading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <div className="text-3xl  text-green-600 font-bold">
            ${totalRevenue?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        )}
         <span className="mt-2">Total Revenue</span>
       </div>
        <div>
            
        {loading ? (
          <Skeleton className="h-10  w-full" />
        ) : (
          <div className="text-3xl text-red-600 font-bold">
            ${totalExpense?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        )}
         <span className="mt-2">Total Expense</span>
        </div>
        </div>
<div className="flex mt-4 justify-between items-center">
        <div >
            
        {loading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <div className="text-3xl  text-green-600 font-bold">
            ${totalRevenue?.toLocaleString("en-US", { minimumFractionDigits: 2 }) - totalExpense?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        )}
         <span className="mt-2">Total Profit</span>
       </div>

       <div >
            
            {loading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <div className="text-3xl  text-green-600 font-bold">
                {  (((totalRevenue?.toLocaleString("en-US", { minimumFractionDigits: 2 }) - totalExpense?.toLocaleString("en-US", { minimumFractionDigits: 2 }))/totalRevenue?.toLocaleString("en-US", { minimumFractionDigits: 2 })) * 100).toLocaleString("en-US", { minimumFractionDigits: 2 })} %
              </div>
            )}
             <span className="mt-2">Profit Percentage</span>
           </div>
           </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex gap-2 font-medium leading-none">
          Trending up this month <TrendingUp className="h-5 w-5 text-green-500" />
        </div>
        <Button variant="outline" onClick={fetchRevenueData}>
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
}
