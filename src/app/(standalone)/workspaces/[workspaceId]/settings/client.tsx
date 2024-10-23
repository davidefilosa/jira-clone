"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";

export const Client = () => {
  const workspaceid = useWorkspaceId();
  const { data, isLoading } = useGetWorkspace(workspaceid);

  if (isLoading) return <PageLoader />;
  if (!data) return <PageError message="Failed to load workspace" />;

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValue={data.workspace} />
    </div>
  );
};
