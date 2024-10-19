import { getCurrent } from "@/features/auth/queries";
import { MembersList } from "@/features/members/components/members-list";
import { redirect } from "next/navigation";
import React from "react";

const MembersPage = async ({ params }: { params: { workspaceId: string } }) => {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");
  const workspaceId = params.workspaceId;

  return (
    <div className="w-full lg:max-w-xl">
      <MembersList workspaceId={workspaceId} />
    </div>
  );
};

export default MembersPage;
