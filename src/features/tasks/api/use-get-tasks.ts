import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UseGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: string | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  search?: string | null;
}

export const useGetTasks = ({
  workspaceId,
  projectId,
  status,
  assigneeId,
  dueDate,
  search,
}: UseGetTasksProps) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      status,
      search,
      assigneeId,
      dueDate,
    ],
    queryFn: async () => {
      const response = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          assigneeId: assigneeId ?? undefined,
          search: search ?? undefined,
          dueDate: dueDate ?? undefined,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
