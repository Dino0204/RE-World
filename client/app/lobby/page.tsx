import { Header } from "@/widgets/lobby/ui/header";
import { Footer } from "@/widgets/lobby/ui/footer";
import { Main } from "@/widgets/lobby/ui/main";
import { Background } from "@/widgets/lobby/ui/background";

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
