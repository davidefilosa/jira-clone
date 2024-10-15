import { getCurrent } from "@/features/auth/action";
import { getWorkspace } from "@/features/workspaces/actions";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { redirect } from "next/navigation";
import React from "react";

const SettingsPage = async ({
  params,
}: {
  params: { workspaceId: string };
}) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  const workspaceId = params.workspaceId;

  const workspace = await getWorkspace(workspaceId);

  if (!workspace) {
    return redirect(`/workspaces/${workspaceId}`);
  }
  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValue={workspace} />
    </div>
  );
};

export default SettingsPage;
