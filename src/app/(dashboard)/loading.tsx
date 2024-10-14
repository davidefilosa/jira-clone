import { Loader } from "lucide-react";
import React from "react";

const LoadingHome = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};

export default LoadingHome;
