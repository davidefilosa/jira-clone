import { parseAsStringEnum, parseAsString, useQueryStates } from "nuqs";
import { TaskStatus } from "../types";

export const useTasksFilter = () => {
  return useQueryStates({
    projectId: parseAsString,
    status: parseAsStringEnum(Object.values(TaskStatus)),
    assigneeId: parseAsString,
    search: parseAsString,
    dueDate: parseAsString,
  });
};
