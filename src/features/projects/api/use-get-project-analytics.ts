import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type ProjectAnalyticsResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["analytics"]["$get"],
  200
>;

export const useGetProjectAnalytics = (projectId: string) => {
  const query = useQuery({
    queryKey: ["project-analitycs", projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"][
        "analytics"
      ].$get({
        param: { projectId },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch project analytics");
      }
      const { data } = await response.json();
      return data;
    },
  });
  return query;
};
