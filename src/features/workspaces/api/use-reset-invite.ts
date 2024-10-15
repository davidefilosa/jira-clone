import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$post"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$post"]
>;

export const useResetInvite = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"].$post({
        param,
      });
      if (!response.ok) {
        throw new Error();
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Invite code reset", { id: "ResetInvite" });
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace", data.$id],
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to reset invite code", { id: "ResetInvite" });
    },
  });

  return mutation;
};
