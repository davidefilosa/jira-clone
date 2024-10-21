import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetTask = (taskId: string) => {
  const query = useQuery({
    queryKey: ["task"],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"].$get({
        param: { taskId },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
