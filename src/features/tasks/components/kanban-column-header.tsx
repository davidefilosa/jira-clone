import { snakeCaseToTitleCase } from "@/lib/utils";
import React from "react";
import { TaskStatus } from "../types";
import {
  Circle,
  CircleCheck,
  CircleDashed,
  CircleDot,
  CircleDotDashed,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  BACKLOG: <CircleDashed className="size-[18px] text-pink-400" />,
  TODO: <Circle className="size-[18px] text-red-400" />,
  IN_PROGRESS: <CircleDotDashed className="size-[18px] text-yellow-400" />,
  IN_REVIEW: <CircleDot className="size-[18px] text-blue-400" />,
  DONE: <CircleCheck className="size-[18px] text-emerald-400" />,
};

export const KanbanColumnHeader = ({
  board,
  taskCount,
}: KanbanColumnHeaderProps) => {
  const icon = statusIconMap[board];
  const { open } = useCreateTaskModal();
  return (
    <div className="px-2 py-1.5 flex items-center justify-between">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-sm font-medium text-neutral-700">
          {taskCount}
        </div>
      </div>
      <Button variant={"ghost"} size={"icon"} className="size-5" onClick={open}>
        <Plus className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
};
