import { Project } from "@/features/projects/types";
import { Task } from "../types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import Link from "next/link";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { ChevronRight, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";

interface TaskBreadcrumbsProps {
  task: Task;
  project: Project;
}
export const TaskBreadcrumbs = ({ project, task }: TaskBreadcrumbsProps) => {
  const workspaceId = useWorkspaceId();
  const { mutate: deleteTask, isPending } = useDeleteTask();
  const router = useRouter();

  const onDelete = () => {
    toast.loading("Deleting task...", { id: "DeleteTask" });

    deleteTask(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
        onError: (error) => console.log(error),
      }
    );
  };

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete Task",
    "This action can not be undone",
    "destructive"
  );

  const handleDelete = async () => {
    const ok = await confirmDelete();

    if (!ok) return;

    onDelete();
  };
  return (
    <div className="flex items-center gap-x-2">
      <DeleteDialog />
      <ProjectAvatar
        name={project.name}
        image={project.imageUrl}
        className="size-6 lg:size-8"
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRight className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button
        className="ml-auto"
        variant={"destructive"}
        size={"sm"}
        onClick={handleDelete}
      >
        <Trash className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete Tasks</span>
      </Button>
    </div>
  );
};
