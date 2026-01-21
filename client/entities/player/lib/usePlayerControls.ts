import { useEffect, useRef } from "react";
import { usePlayerStore } from "../model/store";
import { M416 } from "@/entities/weapon/model/data";

export const usePlayerControls = () => {
  const { setDirection, setJump, equipItem, setAiming } = usePlayerStore();
  const pressedKeys = useRef(new Set<string>());
  const isMouseDown = useRef(false);

  useEffect(() => {
    const updateDirection = () => {
      const keys = pressedKeys.current;
      const direction = {
        x: (keys.has("d") ? 1 : 0) - (keys.has("a") ? 1 : 0),
        z: (keys.has("s") ? 1 : 0) - (keys.has("w") ? 1 : 0),
      };
      setDirection(direction);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(key)) {
        pressedKeys.current.add(key);
        updateDirection();
      } else if (key === " ") {
        setJump(true);
      } else if (key === "v") {
        usePlayerStore.getState().toggleCameraMode();
      } else if (key === "1") {
        equipItem(M416);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(key)) {
        pressedKeys.current.delete(key);
        updateDirection();
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) {
        // Left Click
        isMouseDown.current = true;
      } else if (event.button === 2) {
        // Right Click
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
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("contextmenu", handleContextMenu);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [setDirection, setJump, equipItem, setAiming]);

  return { isMouseDown };
};
