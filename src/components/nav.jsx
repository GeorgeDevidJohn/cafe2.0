"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChartLine, User, Package, Logs, CircleDollarSign } from "lucide-react";

export default function NavigationButtons() {
  return (
    <div className="fixed top-0 left-0 w-full  z-10 flex items-center justify-center backdrop-blur-md bg-white/30  py-4 space-x-4 px-4">
      <Link href="/report" passHref>
        <Button asChild className="flex items-center space-x-2">
          <div>
           
            <ChartLine />
          </div>
        </Button>
      </Link>

      <Link href="/users" passHref>
        <Button asChild className="flex items-center space-x-2">
          <div>
           
         <User/>
          </div>
        </Button>
      </Link>

      <Link href="/product" passHref>
        <Button asChild className="flex items-center space-x-2">
          <div>
          
          <Package/>
          </div>
        </Button>
      </Link>

      <Link href="/logs" passHref>
        <Button asChild className="flex items-center space-x-2">
          <div>
          
          <Logs/>
          </div>
        </Button>
      </Link>
      <Link href="/expence" passHref>
        <Button asChild className="flex items-center space-x-2">
          <div>
          
          <CircleDollarSign/>
          </div>
        </Button>
      </Link>
     
    </div>
  );
}
