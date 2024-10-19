import { DATABASE_ID, MEMBERS_ID, PROJECTS_ID, WORKSPACES_ID } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
import { getMember } from "../members/utils";
import { Project } from "./types";

export const getProjects = async () => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    const workspaceIds = members.documents.map((member) => member.workspaceId);
    const projects = await databases.listDocuments(DATABASE_ID, PROJECTS_ID, [
      Query.orderDesc("$createdAt"),
      Query.contains("workspaceId", workspaceIds),
    ]);

    return projects;
  } catch (error) {
    return { documents: [], total: [] };
  }
};

export const getProject = async (workspaceId: string, projectId: string) => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member) {
      return null;
    }

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
    );

    return project;
  } catch (error) {
    return null;
  }
};
