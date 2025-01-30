"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // ShadCN Button
import { DatePickerWithRange } from "@/components/ui/calenderdaterange"; // Import Date Picker
import FileSaver from "file-saver";

const ExportSalesButton = () => {
  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const handleExport = async () => {
    if (!dateRange.from || !dateRange.to) {
      alert("Please select a date range.");
      return;
    }

    // Convert selected dates to YYYY-MM-DD format
    const startDate = dateRange.from.toISOString().split("T")[0];
    const endDate = dateRange.to.toISOString().split("T")[0];

    try {
      const response = await fetch(`/api/excelexport?startDate=${startDate}&endDate=${endDate}`);

      if (!response.ok) {
        throw new Error("Failed to export data");
      }

      const blob = await response.blob();
      FileSaver.saveAs(blob, "sales-data.xlsx"); // Download file

    } catch (error) {
      console.error("Export error:", error);
      alert("Error exporting sales data. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <label className="text-gray-300 font-medium">Select Date Range</label>
      
      {/* ShadCN Date Picker */}
      <DatePickerWithRange date={dateRange} onChange={setDateRange} />

      <Button onClick={handleExport} className="bg-[#FF7518] text-white px-4 py-2 mt-2">
        Export Sales Data
      </Button>
    </div>
  );
};

export default ExportSalesButton;
