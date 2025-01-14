"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChartLine, User, Package, Logs, CircleDollarSign, LucideLogOut } from "lucide-react";
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

  const LogOutnow = () => {
    deleteSession();
    router.push("/login");
  };

  const handleReload = () => {
    router.refresh(); // Refresh the component when a button is clicked
  };

  return (
    <>
      {userdata?.userId && (
        <div className="fixed top-0 left-0 w-full z-10 flex items-center justify-center backdrop-blur-md bg-black/30">
        <div className=" flex items-center gap-4 justify-center  py-4 space-x-4 px-4">
          {userdata?.role === "admin" && (
            <Link href="/report" passHref>
              
                  <ChartLine className="text-[#FF7518]" />
                
            </Link>
          )}
          {userdata?.role === "admin" && (
            <Link href="/users" passHref>
            
                  <User  className="text-[#FF7518]"/>
               
            </Link>
          )}
          {userdata?.role === "admin" && (
            <Link href="/product" passHref>
              
                  <Package className="text-[#FF7518]" />
               
            </Link>
          )}
          {userdata?.role === "admin" && (
            <Link href="/logs" passHref>
             
                  <Logs  className="text-[#FF7518]"/>
               
            </Link>
          )}
          {userdata?.role === "admin" && (
            <Link href="/expence" passHref>
          
                  <CircleDollarSign className="text-[#FF7518]" />
                
            </Link>
          )}
          </div>
          <Button onClick={() => { LogOutnow(); handleReload(); }} className="flex items-center ml-4 !bg-none text-gray-200 space-x-2">
            <LucideLogOut/>
          </Button>
        </div>
      )}
    </>
  );
}
