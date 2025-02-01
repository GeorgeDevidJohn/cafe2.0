import { NextResponse } from "next/server";
import Products from "@/models/productmodel";
import connectDB from "@/lib/mongodb";

export async function GET() {
    try {
      // Connect to MongoDB
      await connectDB();
  
      // Fetch all products from the database
      const products = await Products.find();
  
      let totalProfit = 0;
  
      // Map and calculate the required values for each product
      const responseData = products.map((product) => {
        const soldCount = product.sold || 0;
        const revenue = (soldCount * product.salePrice).toFixed(2);
        const profit = (revenue - soldCount * product.costPrice).toFixed(2);
  
        // Accumulate total profit
        totalProfit += parseFloat(profit);
  
        return {
          productName: product.productName,
          soldCount,
          revenue,
          profit,
        };
      });
  
      // Return the product data as JSON with the total profit
      return NextResponse.json({
        message: "Products fetched successfully",
        success: true,
        products: responseData,
        totalProfit: totalProfit.toFixed(2), // Return total profit as a formatted value
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
        { error: "Internal server error", message: error.message },
        { status: 500 }
      );
    }
  }
