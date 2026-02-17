import { useEffect } from "react";
import { useInventoryStore } from "./inventory.store";

export const useInventory = () => {
  const { toggleOpen, close } = useInventoryStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key == "i" || key == "I") {
        event.preventDefault();
        toggleOpen();
      } else if (key == "escape" || key == "Escape") {
        event.preventDefault();
        close();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close, toggleOpen]);
};
