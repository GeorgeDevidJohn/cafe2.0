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

    // ✅ Get current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split("T")[0];

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

    // ✅ Add Title Row
    XLSX.utils.sheet_add_aoa(worksheet, [
      [`Total Sales from ${startDate} to ${endDate}: Total Sale ${totalSales}`], // Title row
      [], // Empty row for spacing
      ["Product Name", "Sold Count", "Date"], // Table headers
    ], { origin: "A1" });

    // ✅ Append Sales Data Below the Heading
    XLSX.utils.sheet_add_json(worksheet, salesData, { origin: "A4", skipHeader: true });

    // ✅ Adjust column widths for better visibility
    worksheet["!cols"] = [
      { wpx: 250 }, // Width for "Product Name"
      { wpx: 120 }, // Width for "Sold Count"
      { wpx: 200 }, // Width for "Date"
    ];

    // ✅ Merge title across 3 columns to make it centered
    worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }];

    // ✅ Apply styles to specific cells
    if (!worksheet["A1"]) worksheet["A1"] = {};
    worksheet["A1"].s = {
      font: { bold: true, sz: 24, color: { rgb: "000000" } }, // Larger, bold, black title
      alignment: { horizontal: "center" }, // Center align
    };

    // ✅ Apply styles for the header row
    ["A3", "B3", "C3"].forEach((cell) => {
      if (!worksheet[cell]) worksheet[cell] = {};
      worksheet[cell].s = {
        font: { bold: true, sz: 14, color: { rgb: "000000" } }, // Bold headers
        alignment: { horizontal: "center" },
        fill: { fgColor: { rgb: "D3D3D3" } }, // Light gray background
      };
    });

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Data");

    // ✅ Generate dynamic filename
    const filename = `sales-data_${currentDate}_${startDate}_to_${endDate}.xlsx`;

    const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

    return new Response(buffer, {
      headers: {
        "Content-Disposition": `attachment; filename=${filename}`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });

  } catch (error) {
    console.error("Error exporting sales data:", error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), { status: 500 });
  }
}
