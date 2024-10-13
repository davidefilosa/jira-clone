import { UserButton } from "@/features/auth/components/user-button";
import React from "react";
import { MobileSidebar } from "./mobile-sidebar";

export const Navbar = () => {
  return (
    <nav className="pt-4 px-6 flex items-center justify-between w-full">
      <div className="lg:flex flex-col hidden">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-muted-foreground">
          Monitor all your projects and tasks
        </p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};
