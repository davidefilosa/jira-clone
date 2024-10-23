import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { getMember } from "@/features/members/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { createProjectSchema, updateProjectSchema } from "../schemas";
import { MemberRole } from "@/features/members/types";
import { Project } from "../types";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        [Query.equal("workspaceId", workspaceId), Query.orderDesc("$createdAt")]
      );

      return c.json({ data: projects });
    }
  )
  .post(
    "/",
    zValidator("form", createProjectSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { name, image, workspaceId } = c.req.valid("form");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let updatedImageUrl: string | undefined = "";

      if (image instanceof Blob) {
        const imageFile = new File([image], "image.png");
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          imageFile
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        updatedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        { name, imageUrl: updatedImageUrl, workspaceId }
      );

      return c.json({ data: project });
    }
  )
  .patch(
    "/:projectId",
    zValidator("form", updateProjectSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { projectId } = c.req.param();
      const { name, image } = c.req.valid("form");
      const projectToUpload = await databases.getDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId
      );

      const member = await getMember({
        databases,
        workspaceId: projectToUpload.workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let updatedImageUrl: string | undefined = "";

      if (image instanceof Blob) {
        const imageFile = new File([image], "image.png");
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          imageFile
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        updatedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const project = await databases.updateDocument(
        DATABASE_ID,
        PROJECTS_ID,
        projectId,
        { name, imageUrl: updatedImageUrl }
      );

      return c.json({ data: project });
    }
  )
  .get("/:projectId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    return c.json({ data: { project } });
  })
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { projectId } = c.req.param();

    const projectToUpload = await databases.getDocument(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      workspaceId: projectToUpload.workspaceId,
      userId: user.$id,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(DATABASE_ID, PROJECTS_ID, projectId);

    return c.json({ data: { $id: projectId } });
  })
  .get("/:projectId/analytics", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
      userId: user.$id,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const tasksCount = thisMonthTasks.total;
    const tasksDifference = tasksCount - lastMonthTasks.total;

    const thisMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        Query.equal("assigneeId", member.$id),
      ]
    );

    const lastMonthAssignedTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        Query.equal("assigneeId", member.$id),
      ]
    );

    const tasksAssignedCount = thisMonthAssignedTasks.total;
    const taskAssignedDifference =
      tasksAssignedCount - lastMonthAssignedTasks.total;

    const thisMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        Query.notEqual("status", TaskStatus.DONE),
      ]
    );

    const lastMonthIncompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        Query.notEqual("status", TaskStatus.DONE),
      ]
    );

    const incompleteTasksCount = thisMonthIncompleteTasks.total;
    const incompleteTasksDifference =
      incompleteTasksCount - lastMonthIncompleteTasks.total;

    const thisMonthCompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        Query.equal("status", TaskStatus.DONE),
      ]
    );

    const lastMonthCompleteTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        Query.equal("status", TaskStatus.DONE),
      ]
    );

    const completeTasksCount = thisMonthCompleteTasks.total;
    const completeTasksDifference =
      completeTasksCount - lastMonthCompleteTasks.total;

    const thisMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
      ]
    );

    const lastMonthOverdueTasks = await databases.listDocuments(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("projectId", project.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
      ]
    );

    const overdueTasksCount = thisMonthOverdueTasks.total;
    const overdueTasksDifference =
      overdueTasksCount - lastMonthOverdueTasks.total;

    return c.json({
      data: {
        tasksCount,
        tasksDifference,
        tasksAssignedCount,
        taskAssignedDifference,
        completeTasksCount,
        completeTasksDifference,
        incompleteTasksCount,
        incompleteTasksDifference,
        overdueTasksCount,
        overdueTasksDifference,
      },
    });
  });

export default app;
