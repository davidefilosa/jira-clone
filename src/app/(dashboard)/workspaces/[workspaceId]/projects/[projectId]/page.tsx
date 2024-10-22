import { Button } from "@/components/ui/button";
import { getCurrent } from "@/features/auth/queries";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { getProject, getProjects } from "@/features/projects/queries";
import { TasksViewSwitcher } from "@/features/tasks/components/tasks-view-switcher";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const ProjectIdPage = async ({
  params,
}: {
  params: { projectId: string; workspaceId: string };
}) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  const projectId = params.projectId;
  const workspaceId = params.workspaceId;

  const project = await getProject(workspaceId, projectId);

  if (!project) redirect(`/workspaces/${workspaceId}`);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.name}
            image={project.imageUrl}
            className="size-8"
            fallbackClassName="size-8"
          />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div>
          <Button variant={"secondary"} size={"sm"} asChild>
            <Link
              href={`/workspaces/${workspaceId}/projects/${projectId}/settings`}
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

export default ProjectIdPage;
