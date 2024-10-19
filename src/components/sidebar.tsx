import Link from "next/link";
import React from "react";
import { Logo } from "./logo";
import { DottedSeparator } from "./dotted-separator";
import { Navigation } from "./navigation";
import { WorkspacesSwitcher } from "./workspaces-switcher";
import { Projects } from "./projects";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full">
      <Link href={"/"}>
        <Logo />
      </Link>
      <DottedSeparator className="my-4" />
      <WorkspacesSwitcher />
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      <Projects />
    </aside>
  );
};
