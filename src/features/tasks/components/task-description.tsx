import React, { useState } from "react";
import { Task } from "../types";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";
import { DottedSeparator } from "@/components/dotted-separator";
import { useUpdateTask } from "../api/use-update-task";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface TaskDescriptionProps {
  task: Task;
}

export const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.description);
  const { mutate, isPending } = useUpdateTask();

  const handleSave = () => {
    toast.loading("Updating task...", { id: "UpdateTask" });
    mutate(
      { json: { description: value }, param: { taskId: task.$id } },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };
  return (
    <div className="p-4 border rounded-lg ">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button
          size={"sm"}
          variant={"secondary"}
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? (
            <X className="size-4 mr-2" />
          ) : (
            <Pencil className="size-4 mr-2" />
          )}
          {isEditing ? "Cancel" : "Edit"}
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      {isEditing ? (
        <div className="flex flex-col gap-y-4">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Add a description"
            rows={4}
            disabled={isPending}
          />
          <Button
            onClick={handleSave}
            disabled={isPending}
            size={"sm"}
            className="w-fit ml-auto"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      ) : (
        <div className="">
          {task.description || (
            <span className="text-muted-foreground">No Description set</span>
          )}
        </div>
      )}
    </div>
  );
};
