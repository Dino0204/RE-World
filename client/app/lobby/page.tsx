import { Header } from "@/widgets/Lobby/ui/header";
import { Footer } from "@/widgets/Lobby/ui/footer";
import { Main } from "@/widgets/Lobby/ui/main";
import { Background } from "@/widgets/Lobby/ui/background";

export default function Lobby() {
  return (
    <div className="relative w-full h-screen bg-brand-beige text-brand-charcoal overflow-hidden font-mono select-none flex flex-col">
      <Background />
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
