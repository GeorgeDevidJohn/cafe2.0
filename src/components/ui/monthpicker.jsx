"use client";

import React, { useState } from "react";
import { format, add, eachMonthOfInterval, endOfYear, parse, startOfMonth, startOfToday, isEqual, isFuture } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function getStartOfCurrentMonth() {
  return startOfMonth(startOfToday());
}

export default function MonthPicker({ currentMonth, onMonthChange }) {
  const [currentYear, setCurrentYear] = useState(format(currentMonth, "yyyy"));
  const firstDayCurrentYear = parse(currentYear, "yyyy", new Date());
  const [open, setOpen] = useState(false);

  const months = eachMonthOfInterval({
    start: firstDayCurrentYear,
    end: endOfYear(firstDayCurrentYear),
  });

  function previousYear() {
    let firstDayNextYear = add(firstDayCurrentYear, { years: -1 });
    setCurrentYear(format(firstDayNextYear, "yyyy"));
  }

  function nextYear() {
    let firstDayNextYear = add(firstDayCurrentYear, { years: 1 });
    setCurrentYear(format(firstDayNextYear, "yyyy"));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(currentMonth, "MMM yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="icon" onClick={previousYear}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="font-medium">{format(firstDayCurrentYear, "yyyy")}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextYear}
            disabled={isFuture(add(firstDayCurrentYear, { years: 1 }))}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4">
          {months.map((month) => (
            <Button
              key={month.toString()}
              variant={isEqual(month, currentMonth) ? "default" : "outline"}
              className="w-full"
              onClick={() => {
                onMonthChange(month);
                setOpen(false);
              }}
            >
              {format(month, "MMM")}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
