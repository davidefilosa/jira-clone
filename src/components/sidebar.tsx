import Link from "next/link";
import React from "react";
import { Logo } from "./logo";
import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigation";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href={"/"}>
        <Logo />
      </Link>
      <DottedSeparator className="my-4" />
      <Navigation />
    </aside>
  );
};
