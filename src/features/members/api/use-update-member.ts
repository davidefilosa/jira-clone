import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.members)[":memberId"]["$patch"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.members)[":memberId"]["$patch"]
>;

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.members[":memberId"].$patch({
        json,
        param,
      });
      if (!response.ok) {
        throw new Error();
      }
      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Member updated", { id: "UpdateMember" });
      queryClient.invalidateQueries({
        queryKey: ["members"],
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to update member", { id: "UpdateMember" });
    },
  });

  return mutation;
};
