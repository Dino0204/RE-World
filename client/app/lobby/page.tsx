import { Header } from "@/widgets/lobby/ui/header";
import { Footer } from "@/widgets/lobby/ui/footer";
import { Main } from "@/widgets/lobby/ui/main";
import { Background } from "@/widgets/lobby/ui/background";

async function getLatestVersion(): Promise<string> {
  try {
    const res = await fetch(
      "https://api.github.com/repos/Dino0204/RE-World/releases/latest",
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return "--";
    const data = await res.json();
    return data.tag_name ?? "--";
  } catch {
    return "--";
  }
}

export default async function Lobby() {
  const version = await getLatestVersion();

  return (
    <div className="relative w-full h-screen bg-brand-beige text-brand-charcoal overflow-hidden font-mono select-none flex flex-col">
      <Background />
      <Header version={version} />
      <Main />
      <Footer />
    </div>
  );
}
