import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLink, Pencil, Trash } from "lucide-react";
import React from "react";
import { useDeleteTask } from "../api/use-delete-task";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";

interface TaskActionsProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export const TaskActions = ({ id, projectId, children }: TaskActionsProps) => {
  const { mutate: deleteTask, isPending } = useDeleteTask();

  const onDelete = () => {
    toast.loading("Deleting task...", { id: "DeleteTask" });

    deleteTask(
      { param: { taskId: id } },
      {
        onSuccess: () => {},
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
    <div className="flex justify-end">
      <DeleteDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() => {}}
            className="font-medium p-[10px]"
            disabled={false}
          >
            <ExternalLink className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {}}
            className="font-medium p-[10px]"
            disabled={false}
          >
            <Pencil className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {}}
            className="font-medium p-[10px]"
            disabled={false}
          >
            <ExternalLink className="size-4 mr-2 stroke-2" />
            Open Project
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              handleDelete();
            }}
            className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
            disabled={false}
          >
            <Trash className="text-amber-700 size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
