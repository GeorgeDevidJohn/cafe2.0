"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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

const formSchema = z.object({
  productName: z.string().nonempty({ message: "Product Name is required" }),
  salePrice: z
    .preprocess((value) => Number(value), z.number().min(0.01, "Must be greater than 0")),
  costPrice: z
    .preprocess((value) => Number(value), z.number().min(0.01, "Must be greater than 0")),
  count: z
    .preprocess((value) => Number(value), z.number().min(1, "Must be at least 1")),
  active: z.boolean().default(true),
});

export default function EditProduct({ product, onProductUpdate }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      salePrice: 0,
      costPrice: 0,
      count: 0,

    },
  });

  async function onChangeLog(values){
    const response = await fetch("/api/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Bivin",
        role: "Admin",
        message: "Bivin have updated the details of "+ values.productName ,
      }),
    });
  }
  const { reset } = form;

  React.useEffect(() => {
    if (product) {
      reset({
        productName: product?.productName || "",
        salePrice: product?.salePrice || 0,
        costPrice: product?.costPrice || 0,
        count: product?.count || 0
      });
    }
  }, [product, reset]);

  async function onSubmit(values) {
    try {
      const response = await fetch("/api/product", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, ...values }),
      });

      if (response.ok) {
        console.log("Product updated successfully");
        onChangeLog(values)
        window.location.reload();
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <>
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] max-w-[480px] rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
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
    </>
  );
}