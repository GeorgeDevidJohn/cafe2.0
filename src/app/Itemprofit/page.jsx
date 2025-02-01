"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
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
} from "@/components/ui/card";
import NavigationButtons from "@/components/nav";

export default function GetProfits() {
  const [datas, setProfits] = React.useState([]);
  const [totalprofit,setTotalProfits]= React.useState(0);

  // Fetch user data
  React.useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/profits"); // Replace with your API endpoint
        
        if (response.ok) {
          const data = await response.json();
          console.log(data.products);
          setProfits(data.products);
          setTotalProfits(data.totalProfit);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <>
    <NavigationButtons/>
      <div className="flex min-h-full flex-col justify-center px-6 py-16 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-6xl">
          <Card className=" bg-[#202020bd] border-none">
            <CardHeader>
              <CardTitle className="text-2xl text-left mb-8 text-white">Profit per Items</CardTitle>
              <h2 className="animate-pulse text-xl font-bold text-green-600"> Total Profit : $ {totalprofit} </h2>
            </CardHeader>

            <CardContent>
            
  

              <Table>
               
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
                      <TableRow className="text-gray-400" key={prod.productName}>
                        <TableCell className="text-[#FF7518] font-bold">{prod.productName}</TableCell>
                        <TableCell className="text-gray-200"> {prod.soldCount}</TableCell>
                        <TableCell className="text-gray-200"> ${prod.revenue}</TableCell>
                        <TableCell className="text-green-400 font-bold"> ${prod.profit}</TableCell>
                       
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
