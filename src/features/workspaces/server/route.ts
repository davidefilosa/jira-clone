import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/session-middleware";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  WORKSPACES_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "@/features/members/utils";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    const workspaceIds = members.documents.map((member) => member.workspaceId);
    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );
    return c.json({ data: workspaces });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { name, image } = c.req.valid("form");

      let updatedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        updatedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const inviteCode = generateInviteCode(10);

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        { name, userId: user.$id, imageUrl: updatedImageUrl, inviteCode }
      );

      const member = await databases.createDocument(
        DATABASE_ID,
        MEMBERS_ID,
        ID.unique(),
        { userId: user.$id, workspaceId: workspace.$id, role: MemberRole.ADMIN }
      );

      return c.json({ data: workspace });
    }
  )
  .patch(
    "/:workspaceId",
    zValidator("form", updateWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");
      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let updatedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        updatedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        { name, imageUrl: updatedImageUrl }
      );

      return c.json({ data: workspace });
    }
  );

export default app;
