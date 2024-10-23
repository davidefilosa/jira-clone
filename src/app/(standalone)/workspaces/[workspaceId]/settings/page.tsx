import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import React from "react";
import { Client } from "./client";

const SettingsPage = async () => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  return <Client />;
};

export default SettingsPage;
