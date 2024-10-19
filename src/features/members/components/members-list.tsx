"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetMembers } from "../api/use-get-members";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { DottedSeparator } from "@/components/dotted-separator";
import { Fragment } from "react";
import { MemberAvatar } from "./member-avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUpdateMember } from "../api/use-update-member";
import { MemberRole } from "../types";
import { useDeleteMember } from "../api/use-delete-member";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";

export const MembersList = ({ workspaceId }: { workspaceId: string }) => {
  const { data } = useGetMembers(workspaceId);
  const router = useRouter();
  const { mutate: updateMember, isPending: isPendingUpdate } =
    useUpdateMember();

  const { mutate: deleteMember, isPending: isPendingDelete } =
    useDeleteMember();

  const handleDelete = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;
    toast.loading("Deleting member...", { id: "DeleteMember" });
    deleteMember({ param: { memberId } });
  };

  const handleUpdate = (memberId: string, role: MemberRole) => {
    toast.loading("Updating member...", { id: "UpdateMember" });
    updateMember({ json: { role }, param: { memberId } });
  };

  const [Dialog, confirm] = useConfirm(
    "Remove member",
    "This member will be removed from the workspace",
    "destructive"
  );

  return (
    <Card className="w-full h-full border-none shadow-none">
      <Dialog />
      <CardHeader className="flex flex-row items-center g-x-4 p-7 space-y-0">
        <Button size={"sm"} variant={"secondary"} onClick={() => router.back()}>
          <ArrowLeft className="size-4 mr-2" />
          Back
        </Button>
        <CardTitle className="text-xl font-bold">Members list</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        {data?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar
                name={member.name}
                className="size-10"
                fallbackClassName="text-lg"
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs ftext-muted-foreground">{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="ml-auto"
                    variant={"secondary"}
                    size={"icon"}
                  >
                    <MoreVertical className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    className="font-medium"
                    disabled={isPendingUpdate}
                    onClick={() => {
                      handleUpdate(member.$id, MemberRole.MEMBER);
                    }}
                  >
                    Set as Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium"
                    disabled={isPendingUpdate}
                    onClick={() => {
                      handleUpdate(member.$id, MemberRole.ADMIN);
                    }}
                  >
                    Set as Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium text-amber-700"
                    disabled={isPendingDelete}
                    onClick={() => handleDelete(member.$id)}
                  >
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < data.documents.length - 1 && (
              <Separator className="my-2.5" />
            )}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
