"use client";

import { Button } from "@/components/ui/button";
import { useCurrent } from "@/features/auth/api/use-current";
import { useLogout } from "@/features/auth/api/use-logout";
import { UserButton } from "@/features/auth/components/user-button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data, isLoading } = useCurrent();
  const router = useRouter();
  const { mutate } = useLogout();

  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/sign-in");
    }
  }, [data]);

  return (
    <div className="p-4">
      <UserButton />
    </div>
  );
}
