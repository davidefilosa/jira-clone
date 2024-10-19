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

export const updateProjectSchema = z.object({
  name: z.string().min(1, "Must be 1 or more characters").max(256).optional(),
  image: z
    .union([
      z.instanceof(Blob),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});
