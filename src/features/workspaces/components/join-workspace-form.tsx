"use client";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import { useJoinWorkspace } from "../api/use-join-workspace";
import { useInviteCode } from "../hooks/use-invite-code";
import { useWorkspaceId } from "../hooks/use-workspaceId";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface JoinWorkspaceFormProps {
  name: string;
}

export const JoinWorkspaceForm = ({ name }: JoinWorkspaceFormProps) => {
  const { mutate } = useJoinWorkspace();
  const inviteCode = useInviteCode();
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const onSubmit = () => {
    toast.loading("Joining workspace", { id: "Join" });
    mutate(
      { param: { workspaceId }, json: { code: inviteCode } },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };
  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="p-7">
        <CardTitle className="text-xl font-bold">Join workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invitate to join <strong>{name}</strong> workspace
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-2">
          <Button
            className="w-full lg:w-fit"
            variant={"secondary"}
            type="button"
            asChild
            size={"lg"}
          >
            <Link href={"/"}>Cancel</Link>
          </Button>
          <Button className="w-full lg:w-fit" size={"lg"} onClick={onSubmit}>
            Join Workspace
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
