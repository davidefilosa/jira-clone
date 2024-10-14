import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { toast } from "sonner";

type ResponseType = InferResponseType<(typeof client.api.workspaces)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.workspaces)["$post"]>;

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      console.log("A", form.image instanceof File);

      const response = await client.api.workspaces.$post({ form });
      if (!response.ok) {
        throw new Error();
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Workspace created", { id: "CreateWorkspace" });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to create workspace", { id: "CreateWorkspace" });
    },
  });

  return mutation;
};
