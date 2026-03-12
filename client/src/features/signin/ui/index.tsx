"use client";

import { api } from "@/shared/api/server";
import { useUserStore } from "@/entities/user/model/user.store";
import { Button } from "@/shared/ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const { setUser } = useUserStore();

  const signin = useGoogleLogin({
    onSuccess: async (response) => {
      const { data } = await api.auth.google.post({ code: response.code });

      if (data?.success && data.user) {
        setUser(data.user);
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
