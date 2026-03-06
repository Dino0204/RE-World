import type { Metadata } from "next";
import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Agentation } from "agentation";

export const metadata: Metadata = {
  title: "RE-World",
  description: "BATTLE-ROYALE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {process.env.NODE_ENV === "development" && (
          <Agentation endpoint="http://localhost:4747" />
        )}
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_ID!}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
