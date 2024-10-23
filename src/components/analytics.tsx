import { ProjectAnalyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import React from "react";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AnalyticCard } from "./analytic-card";
import { DottedSeparator } from "./dotted-separator";

export const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticCard
            title="Total Tasks"
            value={data.tasksCount}
            variant={data.tasksDifference > 0 ? "up" : "down"}
            increaseValue={data.tasksDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticCard
            title="Assigned Tasks"
            value={data.tasksAssignedCount}
            variant={data.taskAssignedDifference > 0 ? "up" : "down"}
            increaseValue={data.taskAssignedDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticCard
            title="Completed Tasks"
            value={data.completeTasksCount}
            variant={data.completeTasksDifference > 0 ? "up" : "down"}
            increaseValue={data.completeTasksDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticCard
            title="Incompleted Tasks"
            value={data.incompleteTasksCount}
            variant={data.incompleteTasksDifference > 0 ? "up" : "down"}
            increaseValue={data.incompleteTasksDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticCard
            title="Overdue Tasks"
            value={data.overdueTasksCount}
            variant={data.overdueTasksDifference > 0 ? "up" : "down"}
            increaseValue={data.overdueTasksDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
