"use client"
import React, { useState, useEffect } from "react";
import  NavigationButtons  from "@/components/nav";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableRow, TableCell, TableHeader, TableBody } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [formData, setFormData] = useState({ name: "", amount: "" });

  // Fetch expenses from the server
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/expenses", {
          method: "GET",
        });
        const data = await response.json();
        if (data.success) {
          setExpenses(data.expenses);
        }
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };
    fetchExpenses();
  }, []);

  // Handle adding a new expense
  const handleAdd = async () => {
    try {
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expence: formData.name, amount: formData.amount }),
      });
      const data = await response.json();
      if (data.success) {
        setExpenses([data.savedExpense, ...expenses]);
        setFormData({ name: "", amount: "" });
      }
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  // Handle editing an expense
  const handleEdit = (expense) => {
    setCurrentExpense(expense);
    setFormData({ name: expense.expence, amount: expense.amount });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/expenses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: currentExpense._id, expence: formData.name, amount: formData.amount }),
      });
      const data = await response.json();
      if (data.success) {
        setExpenses(
          expenses.map((expense) =>
            expense._id === currentExpense._id ? data.updatedExpense : expense
          )
        );
        setIsDialogOpen(false);
        setCurrentExpense(null);
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  // Handle deleting an expense
  const handleDelete = async (id) => {
    try {
      const response = await fetch("/api/expenses", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        setExpenses(expenses.filter((expense) => expense._id !== id));
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  return (
    <>
     <NavigationButtons/>
      <Card className="max-w-4xl mx-auto mt-10 h-full p-6">
        <CardHeader>
          <CardTitle>Expense Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Expense Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            />
            <Button onClick={handleAdd}>Add Expense</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Expense Name</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.map((expense) => (
                <TableRow key={expense._id}>
                  <TableCell>{expense.expence}</TableCell>
                  <TableCell>${parseFloat(expense.amount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => handleEdit(expense)} className="mr-2">
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(expense._id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[400px] max-w-[480px] rounded-xl">
              <DialogHeader>
                <DialogTitle>Edit Expense</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4">
                <Input
                  placeholder="Expense Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </>
  );
}
