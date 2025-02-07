"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Pencil } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import getUser from "@/lib/getuser";
import { DateTimePicker } from "@/components/ui/datetimepicker";
export default function SalesComponent() {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [newCount, setNewCount] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  // Fetch sales from the API
  useEffect(() => {
    async function fetchSales() {
      try {
        const response = await fetch("/api/sales", { method: "GET" });
        const data = await response.json();
        if (data.success) {
          setSales(data.sales.reverse());
        } else {
          console.error("Failed to fetch sales:", data.error);
        }
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    }
    fetchSales();
  }, []);

  const handleEditTransaction = (sale) => {
    setSelectedSale(sale);
    setNewCount(sale.count || "");
    setSelectedDate(sale.createdAt ? new Date(sale.createdAt) : new Date());
  };

  const handleDialogClose = () => {
    setSelectedSale(null);
    setNewCount("");
  };

  const handleUpdateSale = async () => {
    if (!newCount || isNaN(newCount) || newCount < 0) {
      alert("Please enter a valid count.");
      return;
    }

    try {
      const response = await fetch(`/api/salesUpdate?id=${selectedSale.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          count: Number(newCount),
          productid: selectedSale.productid,
          createdAt: selectedDate.toISOString()
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Update the state to reflect changes
        onChangeLog(selectedSale.productName,newCount)
        handleDialogClose();
       
      } else {
        alert("Failed to update sale: " + data.error);
      }
    } catch (error) {
      console.error("Error updating sale:", error);
      alert("Error updating sale. Please try again.");
    }
  };
  async function onChangeLog(prodname,cnt){
      const userdata = await getUser()
    const response = await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: userdata.fullName,
        role: userdata.role,
        message:  userdata.fullName + " have updated "+ prodname + " to  "+ cnt + " in the sales list",
      }),
    });
  
    const data = await response.json();
    console.log(data);
   window.location.reload();
    }
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="text-gray-200">
            <TableHead className="text-gray-200">Product Name</TableHead>
            <TableHead className="text-gray-200">Sold Count</TableHead>
            <TableHead className="text-right text-gray-200">Date and Time</TableHead>
            <TableHead className="text-gray-200"> Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody >
        {sales.map((sale, index) => (
    <TableRow key={sale._id || index}>
              <TableCell className="text-gray-200">{sale.productName}</TableCell>
              <TableCell className="text-gray-200">{sale.count || 0}</TableCell>
              <TableCell className="text-right text-gray-200">
                {sale.createdAt ? format(new Date(sale.createdAt), "PPpp") : "N/A"}
              </TableCell>
              <TableCell >
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => handleEditTransaction(sale)}
                  className="bg-none"
                    size="sm"
                  >
                    <Pencil className="text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog for editing sales count */}
      {selectedSale && (
        <Dialog open={!!selectedSale} onOpenChange={handleDialogClose}>
          <DialogContent className="sm:max-w-[400px] p-4 top-[16rem] max-w-[340px] backdrop-blur-md bg-[#20202066]  border-none rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-gray-300">Edit Sale Count</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-300">Product: {selectedSale.productName}</p>
              <Input
                type="number"
                className="text-gray-300"
                value={newCount}
                onChange={(e) => setNewCount(e.target.value)}
                placeholder="Enter new count"
              />

              
            </div>
               {/* Date-Time Picker */}
    <div className="flex flex-col">
      <label className="text-gray-300">Select Date & Time</label>
      {/* <Input
        type="datetime-local"
        value={selectedDate.toISOString().slice(0, 16)} // Format for input field
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
      /> */}
<DateTimePicker
  value={selectedDate.toISOString().slice(0, 16)}
  onChange={(date) => {
    console.log("Selected Date:", date); // Debugging log
    setSelectedDate(date);
  }}
/>
      </div>
            <DialogFooter>
              <Button className=" w-full bg-[#FF7518]" onClick={handleUpdateSale}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
