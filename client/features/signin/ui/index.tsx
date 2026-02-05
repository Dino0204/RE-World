"use client";

import { api } from "@/shared/api/server";
import { Button } from "@/shared/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();

  const signin = useGoogleLogin({
    onSuccess: async (code) => {
      const { data } = await api.auth.google.post({ code });

      if (data?.success) {
        router.push("/lobby");
      }

      return data;
    },
    onError: (error) => {
      console.error("Google Sign-In Error:", error);
    },
    flow: "auth-code",
  });

  return (
    <Button onClick={signin} variant="outline" size="md">
      Sign in with Google
    </Button>
  );
}
