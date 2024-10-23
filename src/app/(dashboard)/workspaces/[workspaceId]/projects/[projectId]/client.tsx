"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";
import { useGetProject } from "@/features/projects/api/use-get-project";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useProjectId } from "@/features/projects/hooks/use-projectId";
import { TasksViewSwitcher } from "@/features/tasks/components/tasks-view-switcher";
import { Pencil } from "lucide-react";
import Link from "next/link";

export const Client = () => {
  const projectId = useProjectId();
  const { data, isLoading } = useGetProject(projectId);

  if (isLoading) return <PageLoader />;
  if (!data) return <PageError message="Failed to laod project" />;
  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={data.project.name}
            image={data.project.imageUrl}
            className="size-8"
            fallbackClassName="size-8"
          />
          <p className="text-lg font-semibold">{data.project.name}</p>
        </div>
        <div>
          <Button variant={"secondary"} size={"sm"} asChild>
            <Link
              href={`/workspaces/${data.project.workspaceId}/projects/${projectId}/settings`}
            >
              <Pencil className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <TasksViewSwitcher hideProjectFilter />
    </div>
  );
};
