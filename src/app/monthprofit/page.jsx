"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as React from "react";
import MonthPicker from "@/components/ui/monthpicker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import NavigationButtons from "@/components/nav";
import { TrendingUp } from "lucide-react";

export default function GetProfitMonths() {
  const [datas, setProfits] = React.useState([]);
  const [totalProfit, setTotalProfits] = React.useState(0);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [totalExpense, setTotalExpense] = React.useState(0);
  const [totalCountSold, setTotalCount] = React.useState(0);
  const [selectedMonth, setSelectedMonth] = React.useState(new Date());
  const [loading, setLoading] = React.useState(false);

  const handleMonthChange = (newMonth) => {
    console.log("Selected Month:", newMonth);
    setSelectedMonth(newMonth);
  };

  // Define fetchUsers outside useEffect
  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      const year = selectedMonth.getFullYear();
      const month = selectedMonth.getMonth() + 1; // Months are zero-indexed in JS

      const response = await fetch(`/api/revenue?year=${year}&month=${month}`);

      if (response.ok) {
        const data = await response.json();
        console.log(data.products);
        setProfits(data.products || []);
        setTotalProfits(data.totalProfit || 0);
        setTotalRevenue(data.totalRevenue || 0);
        setTotalExpense(data.totalExpense || 0);
        setTotalCount(data.totalCountSold || 0);
      } else {
        console.error("Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedMonth]); // Dependency to avoid stale state

  // Fetch data when component mounts & when selectedMonth changes
  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <>
      <NavigationButtons />
      <div className="flex min-h-full flex-col justify-center px-6 py-16 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-6xl">
          <Card className="bg-[#202020bd] border-none">
            <CardHeader>
              <CardTitle className="text-2xl text-left mb-8 text-white">
                Month Sale
              </CardTitle>
              <MonthPicker currentMonth={selectedMonth} onMonthChange={handleMonthChange} />
            </CardHeader>

            <CardContent>
              <Card className="w-full max-w-sm mx-auto mt-10 border-none shadow-2xl bg-[#202020bd]">
                <CardHeader>
                  <CardTitle className="text-gray-200">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      {loading ? (
                        <Skeleton className="h-10 w-full" />
                      ) : (
                        <div className="text-3xl text-green-600 font-bold">
                          ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </div>
                      )}
                      <span className="mt-2 text-gray-200">Total Revenue</span>
                    </div>
                    <div>
                      {loading ? (
                        <Skeleton className="h-10  w-full" />
                      ) : (
                        <div className="text-3xl text-red-600 font-bold">
                          ${totalExpense.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </div>
                      )}
                      <span className="mt-2 text-gray-200">Total Expense</span>
                    </div>
                  </div>
                  <div className="flex mt-4 justify-between items-center">
                    <div>
                      {loading ? (
                        <Skeleton className="h-10 w-full" />
                      ) : (
                        <div className="text-3xl text-green-600 font-bold">
                          ${totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </div>
                      )}
                      <span className="mt-2 text-gray-200">Overall Profit</span>
                    </div>
                    <div>
                      {loading ? (
                        <Skeleton className="h-10 w-full" />
                      ) : (
                        <div className="text-3xl text-green-600 font-bold">
                          {totalCountSold.toLocaleString("en-US")}
                        </div>
                      )}
                      <span className="mt-2 text-gray-200">Overall Count</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div className="flex gap-2 font-medium leading-none text-gray-200">
                    Trending up this month <TrendingUp className="h-5 w-5 text-green-500" />
                  </div>
                  <Button className="!bg-[#FF7518]" onClick={fetchUsers}>
                    Refresh
                  </Button>
                </CardFooter>
              </Card>

              <Table  className="my-8" >
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Total Sold</TableHead>
                    <TableHead>Total Revenue</TableHead>
                    <TableHead>Total Profit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-gray-400">
                  {datas.length > 0 ? (
                    datas.map((prod) => (
                      <TableRow className="text-gray-400" key={prod.productid}>
                        <TableCell className="text-[#FF7518] font-bold">{prod.productName}</TableCell>
                        <TableCell className="text-gray-200">{prod.totalCountSold}</TableCell>
                        <TableCell className="text-gray-200">
                          ${prod.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </TableCell>
                        <TableCell className="text-green-400 font-bold">
                          ${prod.totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No product found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
