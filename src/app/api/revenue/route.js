import connectDB from "@/lib/mongodb"; // Database connection
import Sales from "@/models/salesmodel"; // Sales model
import Products from "@/models/productmodel"; // Products model
import { NextResponse } from "next/server";

// Ensure the database connection is awaited
await connectDB();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get("year"), 10);
    const month = parseInt(searchParams.get("month"), 10);

    if (!year || !month) {
      return NextResponse.json({ success: false, error: "Invalid year or month" }, { status: 400 });
    }

    // Calculate the first and last day of the requested month
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0, 23, 59, 59);

    // Fetch sales for the current month
    const sales = await Sales.find({
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    if (sales.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No sales found for the current month",
        totalRevenue: 0,
        totalExpense: 0,
        totalProfit: 0,
        totalCountSold: 0,
        products: [],
      });
    }

    // Fetch product details for sold products
    const productIds = [...new Set(sales.map((sale) => sale.productid))];
    const products = await Products.find({ _id: { $in: productIds } });

    // Aggregate sales data by product
    const productMap = new Map();

    sales.forEach((sale) => {
      const product = products.find((p) => p._id.toString() === sale.productid);
      if (!product) return;

      const productKey = sale.productid; // Unique identifier for grouping

      if (!productMap.has(productKey)) {
        productMap.set(productKey, {
          productid: sale.productid,
          productName: sale.productName,
          totalCountSold: 0,
          totalExpense: 0,
          totalRevenue: 0,
          totalProfit: 0,
        });
      }

      const productData = productMap.get(productKey);
      const expense = sale.count * product.costPrice;
      const revenue = sale.count * product.salePrice;
      const profit = revenue - expense;

      productData.totalCountSold += sale.count;
      productData.totalExpense += expense;
      productData.totalRevenue += revenue;
      productData.totalProfit += profit;

      productMap.set(productKey, productData);
    });

    // Convert product map to an array
    const productDataArray = Array.from(productMap.values());

    // Calculate total revenue, expense, profit, and count sold
    const totalRevenue = productDataArray.reduce((sum, p) => sum + p.totalRevenue, 0);
    const totalExpense = productDataArray.reduce((sum, p) => sum + p.totalExpense, 0);
    const totalProfit = productDataArray.reduce((sum, p) => sum + p.totalProfit, 0);
    const totalCountSold = productDataArray.reduce((sum, p) => sum + p.totalCountSold, 0);

    // Return the response
    return NextResponse.json({
      success: true,
      totalRevenue,
      totalExpense,
      totalProfit,
      totalCountSold,
      products: productDataArray,
    });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sales data", message: error.message },
      { status: 500 }
    );
  }
}