import { getCurrent } from "@/features/auth/queries";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";
import { getProject } from "@/features/projects/queries";
import { redirect } from "next/navigation";

const ProjectIdSettingsPage = async ({
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
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValue={project} />
    </div>
  );
};

export default ProjectIdSettingsPage;
