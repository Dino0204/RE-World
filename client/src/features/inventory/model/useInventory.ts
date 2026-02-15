import { useEffect } from "react";
import { useInventoryStore } from "./inventory.store";

export const useInventory = () => {
  const { toggleOpen } = useInventoryStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key == "i" || event.key == "I") {
        event.preventDefault();
        toggleOpen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleOpen]);
};
