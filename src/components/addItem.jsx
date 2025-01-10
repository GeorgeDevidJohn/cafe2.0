import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function AddItem({ productId, onItemAdded }) {
const [count, setCount] = useState(0);
const [open, setOpen] = useState(false);


async function onChangeLog(values){
  const response = await fetch("/api/logs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Bivin",
      role: "Admin",
      message: "Bivin have updated the count of "+ values.productName + " to " + values.count,
    }),
  });
}


const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch(`/api/addcount/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ count: parseInt(count, 10) }),
    });

    const data = await response.json();
    console.log(data);
    onChangeLog(data.product)
    if (response.ok && data.success) {
      alert("Item count updated successfully");
      setCount(0);
      setOpen(false);
      window.location.reload();
    } else {
      alert("Failed to update item count");
    }
  } catch (error) {
   
  }
};

return (
  <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <PlusCircleIcon /> Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[300px] max-w-[380px] rounded-xl top-[20rem]">
        <DialogHeader>
          <DialogTitle>Add Number</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="count" className="text-right">
                Count
              </Label>
              <Input
                id="count"
                type="number"
                value={count}
                onChange={(e) => setCount(e.target.value)}
                min="1"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </>
);
}
