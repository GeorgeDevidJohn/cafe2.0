"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function SalesComponent() {
  const [sales, setSales] = useState([]);
  const [selectedSale, setSelectedSale] = useState(null);
  const [newCount, setNewCount] = useState("");

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
          productid: selectedSale.productid
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Update the state to reflect changes
        onChangeLog(selectedSale.productName,newCount)
        handleDialogClose();
        window.location.reload();
      } else {
        alert("Failed to update sale: " + data.error);
      }
    } catch (error) {
      console.error("Error updating sale:", error);
      alert("Error updating sale. Please try again.");
    }
  };
  async function onChangeLog(prodname,cnt){
    const response = await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Bivin",
        role: "Admin",
        message: "Amal have updated "+ prodname + " to  "+ cnt + " in the sales list",
      }),
    });
  
    const data = await response.json();
    console.log(data);
    }
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Sold Count</TableHead>
            <TableHead className="text-right">Date and Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody >
        {sales.map((sale, index) => (
    <TableRow key={sale._id || index}>
              <TableCell>{sale.productName}</TableCell>
              <TableCell>{sale.count || 0}</TableCell>
              <TableCell className="text-right">
                {sale.createdAt ? format(new Date(sale.createdAt), "PPpp") : "N/A"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2 justify-end">
                  <Button
                    onClick={() => handleEditTransaction(sale)}
                    variant="outline"
                    size="sm"
                  >
                    <Edit className="w-4 h-4" />
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
          <DialogContent className="sm:max-w-[400px] p-4 top-[16rem] max-w-[340px] rounded-xl">
            <DialogHeader>
              <DialogTitle>Edit Sale Count</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>Product: {selectedSale.productName}</p>
              <Input
                type="number"
                value={newCount}
                onChange={(e) => setNewCount(e.target.value)}
                placeholder="Enter new count"
              />
            </div>
            <DialogFooter>
              <Button onClick={handleUpdateSale}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
