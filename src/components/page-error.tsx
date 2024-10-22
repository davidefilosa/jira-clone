import { AlertTriangle } from "lucide-react";
import React from "react";

export const PageError = ({
  message = "Something went wrong",
}: {
  message: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AlertTriangle className="size-6 text-muted-foreground mb-2" />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
};
