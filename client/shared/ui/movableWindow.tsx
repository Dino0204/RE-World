"use client";

import { useMovable } from "../model/useMovable";

export function MovableWindow() {
  const { position, isDragging, handleMouseDown } = useMovable();

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      className={`
          absolute top-10 left-10 w-64 h-40 bg-white border border-gray-300 shadow-lg rounded-lg
          cursor-grab active:cursor-grabbing p-4 z-50
          ${isDragging ? "will-change-transform select-none" : ""}
        `}
    >
      <div className="font-bold border-b mb-2 pb-1">드래그 핸들</div>
      <p className="text-sm text-gray-600">이 창을 클릭해서 움직여보세요.</p>
    </div>
  );
}
