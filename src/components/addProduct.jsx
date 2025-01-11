"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  productName: z.string().nonempty({
    message: "Product Name is required",
  }),
  salePrice: z.coerce.number().min(0.01, {
    message: "Sale Price is required and must be greater than 0",
  }),
  costPrice: z.coerce.number().min(0.01, {
    message: "Cost Price is required and must be greater than 0",
  }),
  count: z.coerce.number().min(1, {
    message: "Count is required and must be at least 1",
  }),
  active: z.boolean().default(true),
});

export default function AddProduct() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "", // Always initialize as a string
      salePrice: 0, // Always initialize as a number
      costPrice: 0,
      count: 1,
      active: true,
    },
  });

  async function onChangeLog(values) {
    const response = await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Bivin",
        role: "Admin",
        message:
          "Bivin has added " + values.productName + " to the product list",
      }),
    });

    const data = await response.json();
    console.log(data);
  }

  async function onSubmit(values) {
    const response = await fetch("/api/product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      console.log("All added successfully");
      await onChangeLog(values);
      setIsDialogOpen(false);
      window.location.reload();
    } else {
      console.error("Failed to add product");
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-orange-500 text-white"
          variant="outline"
        >
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] max-w-[480px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>Add a new product to the cart</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salePrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sale Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Sale Price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="costPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Cost Price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Count</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Count" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
