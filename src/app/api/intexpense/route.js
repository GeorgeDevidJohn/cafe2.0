import { NextResponse } from "next/server";
import Products from "@/models/productmodel";
import connectDB from "@/lib/mongodb";

export async function GET() {
    try {
        // Connect to MongoDB
        await connectDB();

        // Fetch all products from the database
        const products = await Products.find();

        let totalCount = 0;
        let totalExpense = 0;
        let totalRevenue = 0;

        // Loop through each product and calculate totals
        products.forEach((product) => {
            const Count = (product.sold || 0) + (product.count || 0); // Fixed count calculation
            const Expense = Count * (product.costPrice || 0); // Corrected formula
            const Revenue = (product.sold || 0) * (product.salePrice || 0);

            // Accumulate totals
            totalCount += Count;
            totalExpense += Expense;
            totalRevenue += Revenue;
        });

        // Return the aggregated data as JSON
        return NextResponse.json({
            message: "Products fetched successfully",
            success: true,
            totalCount: totalCount,
            totalExpense: totalExpense.toFixed(2), // Ensure correct decimal formatting
            totalRevenue: totalRevenue.toFixed(2),
        });

    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Internal server error", message: error.message },
            { status: 500 }
        );
    }
}
