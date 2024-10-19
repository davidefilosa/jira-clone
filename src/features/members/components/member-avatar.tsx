import React from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MemberAvatarProps {
  image?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export const MemberAvatar = ({
  image,
  name,
  className,
  fallbackClassName,
}: MemberAvatarProps) => {
  if (image)
    return (
      <div
        className={cn(
          "size-5 relative rounded-full overflow-hidden",
          className
        )}
      >
        <Image src={image} alt="name" fill className="object-cover" />
      </div>
    );
  return (
    <Avatar
      className={cn(
        "size-5 transition border border-neutal-300 rounded-full",
        className
      )}
    >
      <AvatarFallback
        className={cn(
          "bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center",
          fallbackClassName
        )}
      >
        {name.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
