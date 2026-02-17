import { useEffect, useRef } from "react";
import { usePlayerStore } from "../model/player.store";
import { useInventoryStore } from "@/features/inventory/model/inventory.store";

export const usePlayerControls = () => {
  const { setDirection, setJump, setAiming } = usePlayerStore();
  const { isOpen, setActiveSlot } = useInventoryStore();
  const pressedKeys = useRef(new Set<string>());
  const isMouseDown = useRef(false);

  useEffect(() => {
    // 방향 전환 업데이트
    const updateDirection = () => {
      const keys = pressedKeys.current;
      const direction = {
        x: (keys.has("d") ? 1 : 0) - (keys.has("a") ? 1 : 0),
        z: (keys.has("s") ? 1 : 0) - (keys.has("w") ? 1 : 0),
      };
      setDirection(direction);
    };

    // 키 입력 처리
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen) return;
      const key = event.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(key)) {
        pressedKeys.current.add(key);
        updateDirection();
      } else if (key === " ") {
        setJump(true);
      } else if (key === "v") {
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

    // 키 해제 처리
    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["w", "a", "s", "d"].includes(key)) {
        pressedKeys.current.delete(key);
        updateDirection();
      }
    };

    // 마우스 클릭 처리
    const handleMouseDown = (event: MouseEvent) => {
      if (event.button === 0) {
        // Left Click
        isMouseDown.current = true;
      } else if (event.button === 2) {
        // Right Click
        setAiming(true);
      }
    };

    // 마우스 클릭 해제 처리
    const handleMouseUp = (event: MouseEvent) => {
      if (event.button === 0) {
        isMouseDown.current = false;
      } else if (event.button === 2) {
        setAiming(false);
      }
    };

    // 마우스 우클릭 메뉴 방지
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };

    // 윈도우 전역으로 이벤트 리스너 등록
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("contextmenu", handleContextMenu);

    // 클린업 함수로 이벤트 리스너 제거
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [setDirection, setJump, setAiming, setActiveSlot, isOpen]);

  return { isMouseDown };
};
