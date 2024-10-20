import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { Folder, ListCheck, UserIcon } from "lucide-react";
import React from "react";
import { TaskStatus } from "../types";
import { useTasksFilter } from "../hooks/use-tasks-filter";
import { DatePicker } from "@/components/date-picker";

interface DataFilterProps {
  hideProjectFilter?: boolean;
}

export const DataFilter = ({ hideProjectFilter }: DataFilterProps) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isLoadingProjects } =
    useGetProjects(workspaceId);
  const { data: members, isLoading: isLoadingMembers } =
    useGetMembers(workspaceId);
  const isLoading = isLoadingMembers || isLoadingProjects;

  const projectOptions = projects?.documents.map((project) => ({
    value: project.$id,
    label: project.name,
  }));

  const memberOptions = members?.documents.map((member) => ({
    value: member.$id,
    label: member.name,
  }));

  const [{ status, assigneeId, projectId, dueDate }, setFilters] =
    useTasksFilter();

  const onStatusChange = (value: string) => {
    if (value === "all") {
      setFilters({ status: null });
    } else {
      setFilters({ status: value as TaskStatus });
    }
  };

  const onAssigneeChange = (value: string) => {
    if (value === "all") {
      setFilters({ assigneeId: null });
    } else {
      setFilters({ assigneeId: value });
    }
  };

  const onProjectChange = (value: string) => {
    if (value === "all") {
      setFilters({ projectId: null });
    } else {
      setFilters({ projectId: value });
    }
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status ?? undefined}
        onValueChange={(value) => onStatusChange(value)}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center p-2">
            <ListCheck className="size-4 mr-2" />
            <SelectValue placeholder="Status" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All status</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
          <SelectItem value={TaskStatus.TODO}>To do</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>In review</SelectItem>
          <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>
      <Select
        defaultValue={assigneeId || undefined}
        onValueChange={(value) => {
          onAssigneeChange(value);
        }}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center p-2">
            <UserIcon className="size-4 mr-2" />
            <SelectValue placeholder="Assigned to" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All assignees</SelectItem>
          <SelectSeparator />
          {memberOptions?.map((member) => (
            <SelectItem value={member.value} key={member.value}>
              {member.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        defaultValue={projectId || undefined}
        onValueChange={(value) => {
          onProjectChange(value);
        }}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center p-2">
            <Folder className="size-4 mr-2" />
            <SelectValue placeholder="Project" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All projects</SelectItem>
          <SelectSeparator />
          {projectOptions?.map((project) => (
            <SelectItem value={project.value} key={project.value}>
              {project.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DatePicker
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) =>
          setFilters({ dueDate: date ? date.toISOString() : null })
        }
        className="h-8 w-full lg:w-auto"
        placeHolder="Select a date"
      />
    </div>
  );
};
