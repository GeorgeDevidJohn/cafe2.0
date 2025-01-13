"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChartLine, User, Package, Logs, CircleDollarSign } from "lucide-react";
import { deleteSession } from "@/lib/session";
import { useRouter } from "next/navigation";
import getUser from "@/lib/getuser";
import { useState, useEffect } from "react";

export default function NavigationButtons({ triggerUpdate }) {
  const [userdata, setUser] = useState(null); // State initialization inside the component
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      const userset = await getUser();
      console.log("this is user", userset.userId);
      setUser(userset);
    }

    fetchUserData(); // Fetch user data when the component mounts
  }, [triggerUpdate]); // Re-run effect when triggerUpdate changes

  const LogOut = () => {
    deleteSession();
    router.push("/login");
  };

  const handleReload = () => {
    router.refresh(); // Refresh the component when a button is clicked
  };

  return (
    <>
      {userdata?.userId && (
        <div className="fixed top-0 left-0 w-full z-10 flex items-center justify-center backdrop-blur-md bg-white/30 py-4 space-x-4 px-4">
          {userdata?.role === "admin" && (
            <Link href="/report" passHref>
              <Button asChild className="flex items-center space-x-2" onClick={handleReload}>
                <div>
                  <ChartLine />
                </div>
              </Button>
            </Link>
          )}
          {userdata?.role === "admin" && (
            <Link href="/users" passHref>
              <Button asChild className="flex items-center space-x-2" onClick={handleReload}>
                <div>
                  <User />
                </div>
              </Button>
            </Link>
          )}
          {userdata?.role === "admin" && (
            <Link href="/product" passHref>
              <Button asChild className="flex items-center space-x-2" onClick={handleReload}>
                <div>
                  <Package />
                </div>
              </Button>
            </Link>
          )}
          {userdata?.role === "admin" && (
            <Link href="/logs" passHref>
              <Button asChild className="flex items-center space-x-2" onClick={handleReload}>
                <div>
                  <Logs />
                </div>
              </Button>
            </Link>
          )}
          {userdata?.role === "admin" && (
            <Link href="/expence" passHref>
              <Button asChild className="flex items-center space-x-2" onClick={handleReload}>
                <div>
                  <CircleDollarSign />
                </div>
              </Button>
            </Link>
          )}
          <Button onClick={() => { LogOut(); handleReload(); }} className="flex items-center space-x-2">
            <div>Logout</div>
          </Button>
        </div>
      )}
    </>
  );
}
