"use client";

import { useBootSequence } from "@/widgets/HeroSection/model/useBootSequence";
import { useTypingEffect } from "@/widgets/HeroSection/model/useTypingEffect";
import { BootSequenceOverlay } from "@/widgets/HeroSection/ui/BootSequenceOverlay";
import { StaticOverlays } from "@/widgets/HeroSection/ui/StaticOverlay";
import { HeroHUD } from "@/widgets/HeroSection/ui/HeroHUD";

const FULL_TITLE = "RE-World";
const BACKGROUND_VIDEO_SRC = "/videos/planet_remix.webm";

export default function HeroPage() {
  const bootStage = useBootSequence();
  const titleText = useTypingEffect(FULL_TITLE, bootStage === "ui");
  const isBootComplete = bootStage === "ui";

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden font-mono select-none">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={BACKGROUND_VIDEO_SRC} type="video/webm" />
        </video>
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <BootSequenceOverlay bootStage={bootStage} />
      <StaticOverlays visible={isBootComplete} />
      <HeroHUD visible={isBootComplete} titleText={titleText} />
    </div>
  );
}
