"use client";

import { api } from "@/shared/api/server";
import { Button } from "@/shared/ui/button";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();

  const signout = async () => {
    try {
      const { data } = await api.auth.signout.get();

      if (data?.success) {
        router.push("/");
      }
    } catch (error) {
      console.error("Sign-Out Error:", error);
    }
  };

  return (
    <Button onClick={signout} variant="outline" size="md">
      Sign out
    </Button>
  );
}
