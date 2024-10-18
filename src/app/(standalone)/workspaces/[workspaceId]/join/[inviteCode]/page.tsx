import { getCurrent } from "@/features/auth/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";
import React from "react";

interface JoinPageProps {
  params: { workspaceId: string; inviteCode: string };
}

const JoinPage = async ({ params }: JoinPageProps) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const workspace = await getWorkspaceInfo(params.workspaceId);
  if (!workspace) redirect("/");

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm name={workspace?.name} />
    </div>
  );
};

export default JoinPage;
