"use client";

import { useCallback } from "react";
import { useMovableStore } from "../store/useMovableStore";

export function useMovable() {
  const { position, setPosition, isDragging, setIsDragging, offsetRef } =
    useMovableStore();

  // 1. 마우스 다운: 드래그 시작
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      offsetRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      };
    },
    [offsetRef, position.x, position.y, setIsDragging],
  );

  // 2. 마우스 무브: 부모 컨테이너 위에서 움직일 때 호출
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;

      setPosition({
        x: e.clientX - offsetRef.current!.x,
        y: e.clientY - offsetRef.current!.y,
      });
    },
    [isDragging, offsetRef, setPosition],
  );

  // 3. 마우스 업/리브: 드래그 종료
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  return {
    position,
    isDragging,
    handleMouseDown, // 자식(창)에게 전달
    handleMouseMove, // 부모(컨테이너)에게 전달
    handleMouseUp, // 부모(컨테이너)에게 전달
  };
}
