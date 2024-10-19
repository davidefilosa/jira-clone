import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Required").max(256),
  image: z
    .union([
      z.instanceof(Blob),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
  workspaceId: z.string(),
});
