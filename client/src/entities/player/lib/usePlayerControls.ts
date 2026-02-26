import { useEffect, useRef } from "react";
import { usePlayerStore } from "../model/player.store";
import { useInventoryStore } from "@/features/inventory/model/inventory.store";

export const usePlayerControls = () => {
  const { setAiming } = usePlayerStore();
  const { isOpen, setActiveSlot } = useInventoryStore();
  const isMouseDown = useRef(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen) return;
      const key = event.key.toLowerCase();
      if (key === "v") {
        usePlayerStore.getState().toggleCameraMode();
      } else if (key === "1") {
        setActiveSlot("주무기1");
      } else if (key === "2") {
        setActiveSlot("주무기2");
      } else if (key === "3") {
        setActiveSlot("보조무기");
      } else if (key === "4") {
        setActiveSlot("근접무기");
      } else if (key === "5") {
        setActiveSlot("투척무기");
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) {
        isMouseDown.current = true;
      } else if (event.button === 2) {
        setAiming(true);
      }
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 0) {
        isMouseDown.current = false;
      } else if (event.button === 2) {
        setAiming(false);
      }
    };

    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [setAiming, setActiveSlot, isOpen]);

  return { isMouseDown };
};
