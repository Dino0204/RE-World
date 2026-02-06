"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMovableStore, Position } from "../store/useMovableStore";

// 개별 윈도우용 훅
export function useMovable(id: string) {
  const { position, setPosition, isDragging, setIsDragging, offsetRef } =
    useMovableStore(id);

  const positionRef = useRef<Position>(position);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      offsetRef.current = {
        x: e.clientX - positionRef.current.x,
        y: e.clientY - positionRef.current.y,
      };
    },
    [offsetRef, setIsDragging],
  );

  return {
    position,
    isDragging,
    setPosition,
    setIsDragging,
    offsetRef,
    handleMouseDown,
  };
}
