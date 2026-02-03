"use client";

import { api } from "@/shared/api/server";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();

  const signin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      console.log(codeResponse);
      const response = await api.auth.google.post({ code: codeResponse.code });
      if (response.data?.success) {
        router.push("/lobby");
      }
      return response;
    },
    flow: "auth-code",
  });

  return <button onClick={signin}>Sign in with Google</button>;
}
