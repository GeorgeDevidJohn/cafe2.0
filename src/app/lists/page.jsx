"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Edit, Trash2 } from "lucide-react";
import SalesComponent from "@/components/salesList";
import { on } from "events";

export default function SalesPage() {
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [count, setCount] = useState(null);

  // Fetch active products from the API
  useEffect(() => {
    async function fetchActiveProducts() {
      try {
        const response = await fetch("/api/activeproducts", { method: "GET" });
        const data = await response.json();
        if (data.success) {
          setProducts(data.products);
        } else {
          console.error("Failed to fetch active products:", data.error);
        }
      } catch (error) {
        console.error("Error fetching active products:", error);
      }
    }

 
    fetchActiveProducts();
  }, []);

  const handleAddSale = async (productId, productName) => {
    if (!count || count < 1) {
      alert("Please enter a valid count.");
      return;
    }

    try {
      const response = await fetch("/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productid: productId,
          productName: productName,
          count: count,
        }),
      });
      onChangeLog(productName,count)
      const data = await response.json();

      if (data.success) {
        // Update the local product state
        const updatedProductList = products.map((product) =>
          product._id === productId
            ? { ...product, soldCount: (product.soldCount || 0) + count }
            : product
        );
        setProducts(updatedProductList);
        setCount(1);
        setCurrentProduct(null);
        alert("Sale added successfully.");

        // Update product count in the database
        updateProductCount(productId, count);
      } else {
        alert(`Failed to add sale: ${data.error}`);
      }
    } catch (error) {
      console.error("Error adding sale:", error);
      alert("Error adding sale. Please try again.");
    }
  };

  const updateProductCount = async (productId, count) => {
    try {
      const response = await fetch("/api/updateProductCount", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productid: productId,
          count: count,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Product table updated successfully.");
        window.location.reload();
      } else {
        alert(`Failed to update product: ${data.error}`);
      }
    } catch (error) {
      console.error("Error updating product table:", error);
      alert("Error updating product table. Please try again.");
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
        message: "Amal have sold "+ cnt+ " of "+ prodname ,
      }),
    });
  
    const data = await response.json();
    console.log(data);
    }

  return (
    <div className="p-6 mt-16 space-y-8">
      {/* Product Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product._id} className="hover:shadow-lg">
            <CardHeader>
              <CardTitle>{product.productName}</CardTitle>
              <CardDescription>${product.salePrice.toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full bg-blue-500 text-white">Add Sale</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px] top-[16rem] p-4  max-w-[340px] rounded-xl" >
                  <DialogHeader>
                    <DialogTitle>Add Sale</DialogTitle>
                    <DialogDescription>
                      Enter the count of items sold for {product.productName}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4">
                    <Input
                      type="number"
                      min={1}
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      placeholder="Enter count"
                    />
                    <Button
                      onClick={() => handleAddSale(product._id, product.productName)}
                      className="bg-orange-500 text-white"
                    >
                      Submit
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sales Table */}
      <div className="overflow-auto">
        <SalesComponent />
     
      </div>
    </div>
  );
}
