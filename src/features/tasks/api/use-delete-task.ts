import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$delete"]
>;

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[":taskId"].$delete({
        param,
      });
      if (!response.ok) {
        throw new Error();
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Task cancelled", { id: "DeleteTask" });
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["task", data.$id],
      });
      queryClient.invalidateQueries({
        queryKey: ["project-analitycs"],
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to delete task", { id: "DeleteTask" });
    },
  });

  return mutation;
};
