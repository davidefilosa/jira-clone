import React from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Logo />
          <Button variant={"secondary"}>Sign Up</Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {" "}
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
