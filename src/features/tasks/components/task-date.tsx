import React from "react";
import { differenceInDays, format } from "date-fns";
import { cn } from "@/lib/utils";

interface TaskDateProps {
  dueDate: string;
  className?: string;
}

export const TaskDate = ({ dueDate, className }: TaskDateProps) => {
  const today = new Date();
  const endDate = new Date(dueDate);
  const diffInDays = differenceInDays(endDate, today);
  let textColor = "text-muted-foreground";

  if (diffInDays <= 3) {
    textColor = "text-red-500";
  } else if (diffInDays <= 7) {
    textColor = "text-orange-500";
  } else if (diffInDays <= 14) {
    textColor = "text-yellow-500";
  }

  return (
    <div className={textColor}>
      <span className={cn("truncate", className)}>
        {format(dueDate, "PPP")}
      </span>
    </div>
  );
};
