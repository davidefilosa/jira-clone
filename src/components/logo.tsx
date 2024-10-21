import React from "react";
import { beeHive } from "@lucide/lab";
import { Icon } from "lucide-react";

export const Logo = () => {
  return (
    <div>
      <div className="text-[#2563eb] flex gap-2 items-center text-xl font-bold">
        <Icon iconNode={beeHive} className="size-6" />
        TractHive
      </div>
    </div>
  );
};
