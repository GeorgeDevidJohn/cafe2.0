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
import { object } from "zod";

export default function RevenueCard() {
  const [totalExpense, setTotalExpense] = useState(0);
  const [RevExpense,setindTotalExpense] = useState(object);
  const [loading, setLoading] = useState(true);



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

  const fetchRevenue = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/revenue", {
        method: "GET",
      });
      const data = await response.json();

      if (data.success) {
        console.log("this is new :" + data.totalExpense )
      
      } else {
        console.error("Failed to fetch revenue data:", data.error);
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchIndividualExpenceData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/intexpense", {
        method: "GET",
      });
      const data = await response.json();

      if (data.success) {
        console.log("this is new :" + data.totalExpense )
        setindTotalExpense(data);
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
    fetchRevenue();
    fetchExpenceData();
    fetchIndividualExpenceData();
  }, []);

  return (
    <Card className="w-full max-w-sm mx-auto mt-10 border-none  shadow-2xl bg-[#202020bd]">
      <CardHeader>
        <CardTitle className="text-gray-200">Total Revenue</CardTitle>
        <CardDescription className="text-gray-600">
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
            {/* {RevExpense.totalRevenue} */}
            ${RevExpense.totalRevenue?.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        )}
         <span className="mt-2 text-gray-200">Total Revenue</span>
       </div>
        <div>
            
        {loading ? (
          <Skeleton className="h-10  w-full" />
        ) : (
          <div className="text-3xl text-red-600 font-bold">
        ${(Number(totalExpense) + Number(RevExpense.totalExpense))?.toLocaleString("en-US", { minimumFractionDigits: 2 })}

            {/* {RevExpense.totalExpense} */}
          </div>
        )}
         <span className="mt-2 text-gray-200">Total Expense</span>
        </div>
        </div>
<div className="flex mt-4 justify-between items-center">
        <div >
            
        {loading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <div className="text-3xl  text-green-600 font-bold">
           ${((Number(RevExpense.totalRevenue) ? Number(RevExpense.totalRevenue) : 0) - (Number(totalExpense) + Number(RevExpense.totalExpense) ? Number(totalExpense) + Number(RevExpense.totalExpense) : 0)).toLocaleString("en-US", { minimumFractionDigits: 2 })}

          </div>
        )}
         <span className="mt-2 text-gray-200">Total Profit</span>
       </div>

       <div >
            
            {loading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <div className="text-3xl  text-green-600 font-bold">
            { 
  Number(RevExpense.totalRevenue) && Number(RevExpense.totalRevenue) !== 0 
    ? (((Number(RevExpense.totalRevenue) - (Number(totalExpense) + Number(RevExpense.totalExpense) || 0)) / Number(RevExpense.totalRevenue)) * 100)
        .toLocaleString("en-US", { minimumFractionDigits: 2 })
    : "0.00"
} %


              </div>
            )}
             <span className="mt-2 text-gray-200">Profit Percentage</span>
           </div>
           </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex gap-2 font-medium leading-none text-gray-200">
          Trending up this month <TrendingUp className="h-5 w-5 text-green-500" />
        </div>
        <Button className="!bg-[#FF7518]" onClick={fetchIndividualExpenceData}>
          Refresh
        </Button>
      </CardFooter>
    </Card>
  );
}
