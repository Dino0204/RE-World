"use client";

import { useEffect, useRef } from "react";
import { useMovable } from "../model/useMovable";

interface MovableWindowProps {
  id?: string;
  children: React.ReactNode;
}

export function MovableWindow({
  id = "default",
  children,
}: MovableWindowProps) {
  const { position, isDragging, handleMouseDown, setElementRef } =
    useMovable(id);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setElementRef(elementRef);
  }, [setElementRef]);

  return (
    <div
      ref={elementRef}
      onMouseDown={handleMouseDown}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      className={`
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-max max-h-max rounded-lg
          cursor-grab active:cursor-grabbing z-50 overflow-hidden
          ${isDragging ? "will-change-transform select-none" : ""}
        `}
    >
      {children}
    </div>
  );
}
