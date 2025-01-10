"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Users() {
  const [users, setUsers] = React.useState([]);

  // Fetch user data
  React.useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/register"); // Replace with your API endpoint
        
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setUsers(data.users);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    fetchUsers();
  }, []);

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 py-16 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-6xl">
          <Card className="mt-10">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="text-2xl">Users List</CardTitle>
              <Link href="/register" passHref>
                <Button className="bg-orange-500 text-white" variant="outline">
                  Register User
                </Button>
              </Link>
            </CardHeader>

            <CardContent>
              <Table>
                <TableCaption>Users List</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>User Name</TableHead>
                    <TableHead className="text-right">Password</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.userName}</TableCell>
                        <TableCell className="text-right">{user.password}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No users found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
