"use client";

import { Header } from "@/widgets/lobby/ui/header";
import { Footer } from "@/widgets/lobby/ui/footer";
import { Main } from "@/widgets/lobby/ui/main";
import { Background } from "@/widgets/lobby/ui/background";
import { useEffect } from "react";
import { useSocketStore } from "@/shared/model/socket.store";

export default function Lobby() {
  const connect = useSocketStore((state) => state.connect);

  useEffect(() => {
    connect();
  }, [connect]);

  return (
    <div className="relative w-full h-screen bg-brand-beige text-brand-charcoal overflow-hidden font-mono select-none flex flex-col">
      <Background />
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
