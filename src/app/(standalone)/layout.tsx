import { Logo } from "@/components/logo";
import { UserButton } from "@/features/auth/components/user-button";
import Link from "next/link";
import React from "react";

const StandaloneLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between h-[73px]">
          <Link href={"/"}>
            <Logo />
          </Link>
          <UserButton />
        </nav>
        <div className="flex flex-col justify-center items-center py-4">
          {children}
        </div>
      </div>
    </main>
  );
};

export default StandaloneLayout;
