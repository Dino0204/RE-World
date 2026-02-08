import { useEffect, useState } from "react";

export function useTypingEffect(text: string, enabled: boolean) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!enabled) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [text, enabled]);

  return displayedText;
}
