import { z } from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, "Required").max(256),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1, "Must be 1 or more characters").max(256).optional(),
  image: z
    .union([
      z.instanceof(File),
      z.string().transform((value) => (value === "" ? undefined : value)),
    ])
    .optional(),
});
