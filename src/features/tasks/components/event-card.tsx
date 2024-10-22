import { Member } from "@/features/members/types";
import { Project } from "@/features/projects/types";
import React from "react";
import { TaskStatus } from "../types";
import { cn } from "@/lib/utils";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { useRouter } from "next/navigation";

interface EventCardProps {
  event: {
    start: Date;
    end: Date;
    title: string;
    project: Project;
    assignee: Member;
    status: TaskStatus;
    id: string;
  };
}

const statusColorMap: Record<TaskStatus, React.ReactNode> = {
  BACKLOG: "border-l-pink-500",
  TODO: "border-l-red-500",
  IN_PROGRESS: "border-l-yellow-500",
  IN_REVIEW: "border-l-blue-500",
  DONE: "border-l-emerald-500",
};

export const EventCard = ({ event }: EventCardProps) => {
  const workspaceId = useWorkspaceId();
  const router = useRouter();
  const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    router.push(`/workspaces/${workspaceId}/tasks/${event.id}`);
  };
  return (
    <div className="px-2" onClick={onClick}>
      <div
        className={cn(
          "p-1.5 text-sm bg-white text-primary border rounded-md border-l-4 flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition",
          statusColorMap[event.status]
        )}
      >
        <p>{event.title}</p>
        <div className="flex items-center gap-x-1">
          <MemberAvatar name={event.assignee.name} />
          <div className="size-1 rounded-full bg-neutral-300" />
          <ProjectAvatar
            name={event.project.name}
            image={event.project.imageUrl}
          />
        </div>
      </div>
    </div>
  );
};
