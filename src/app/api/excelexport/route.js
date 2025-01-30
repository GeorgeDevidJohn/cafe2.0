import connectDB from "@/lib/mongodb";
import Sales from "@/models/salesmodel";

export async function GET(req) {
  try {
    await connectDB();
    const XLSX = await import("xlsx");

    // ✅ Extract query parameters for date filtering
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // ✅ Build query filter based on provided date range
    let filter = {};
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate), // Start date (inclusive)
        $lte: new Date(endDate),   // End date (inclusive)
      };
    }

    // ✅ Fetch filtered sales data from MongoDB
    const sales = await Sales.find(filter);

    if (!sales.length) {
      return new Response(JSON.stringify({ success: false, message: "No data found for the selected date range" }), { status: 404 });
    }

    // ✅ Calculate Total Sales
    const totalSales = sales.reduce((sum, sale) => sum + (sale.count || 0), 0);

    // ✅ Convert sales data into JSON format for Excel
    const salesData = sales.map((sale) => ({
      "Product Name": sale.productName,
      "Sold Count": sale.count,
      "Date": sale.createdAt ? new Date(sale.createdAt).toLocaleString() : "N/A",
    }));

    // ✅ Ensure XLSX.utils exists
    if (!XLSX.utils) {
      console.error("XLSX.utils is undefined");
      return new Response(JSON.stringify({ success: false, message: "XLSX Library Error" }), { status: 500 });
    }

    // ✅ Generate Excel file with heading
    const workbook = XLSX.utils.book_new();
    let worksheet = XLSX.utils.json_to_sheet([]);

    // ✅ Add Heading Row with Total Sales
    XLSX.utils.sheet_add_aoa(worksheet, [
      [`Total Sales from ${startDate} to ${endDate}: Total Sale ${totalSales}`], // Heading
      [], // Empty row for spacing
      ["Product Name", "Sold Count", "Date"], // Table headers
    ]);

    // ✅ Append Sales Data Below the Heading
    XLSX.utils.sheet_add_json(worksheet, salesData, { origin: "A4", skipHeader: true });

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Data");

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    return new Response(buffer, {
      headers: {
        "Content-Disposition": `attachment; filename=sales-data_${startDate}_to_${endDate}.xlsx`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

  } catch (error) {
    console.error("Error exporting sales data:", error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}
