"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { useProjectId } from "@/features/projects/hooks/use-projectId";

export const Client = () => {
  const projectId = useProjectId();
  const { data, isLoading } = useGetProject(projectId);
  if (isLoading) return <PageLoader />;
  if (!data) return <PageError message="Failed to load project" />;
  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValue={data.project} />
    </div>
  );
};
