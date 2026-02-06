import { createRef, RefObject, useCallback, useMemo } from "react";
import { create } from "zustand";

export type Position = { x: number; y: number };

interface MovableState {
  position: Position;
  isDragging: boolean;
  offsetRef: RefObject<Position | null>;
}

interface MovableStore {
  items: Record<string, MovableState>;
  activeId: string | null;
  setPosition: (id: string, pos: Position) => void;
  setIsDragging: (id: string, dragging: boolean) => void;
  setActiveId: (id: string | null) => void;
  getOrCreateItem: (id: string) => MovableState;
}

const createInitialState = (): MovableState => ({
  position: { x: 0, y: 0 },
  isDragging: false,
  offsetRef: createRef<Position>(),
});

const useMovableStoreBase = create<MovableStore>((set, get) => ({
  items: {},
  activeId: null,
  setPosition: (id, position) =>
    set((state) => ({
      items: {
        ...state.items,
        [id]: { ...state.items[id], position },
      },
    })),
  setIsDragging: (id, isDragging) =>
    set((state) => ({
      items: {
        ...state.items,
        [id]: { ...state.items[id], isDragging },
      },
      activeId: isDragging ? id : null,
    })),
  setActiveId: (activeId) => set({ activeId }),
  getOrCreateItem: (id) => {
    const existing = get().items[id];
    if (existing) return existing;

    const newState = createInitialState();
    set((state) => ({
      items: { ...state.items, [id]: newState },
    }));
    return newState;
  },
}));

// 개별 윈도우용 훅
export const useMovableStore = (id: string) => {
  // 초기화 (동기적으로 한 번만)
  const initialState = useMemo(
    () => useMovableStoreBase.getState().getOrCreateItem(id),
    [id],
  );

  // 해당 id의 상태만 구독
  const position = useMovableStoreBase(
    (state) => state.items[id]?.position ?? initialState.position,
  );
  const isDragging = useMovableStoreBase(
    (state) => state.items[id]?.isDragging ?? initialState.isDragging,
  );
  const offsetRef = useMovableStoreBase(
    (state) => state.items[id]?.offsetRef ?? initialState.offsetRef,
  );

  const setPosition = (pos: Position) =>
    useMovableStoreBase.getState().setPosition(id, pos);
  const setIsDragging = (dragging: boolean) =>
    useMovableStoreBase.getState().setIsDragging(id, dragging);

  return {
    position,
    isDragging,
    offsetRef,
    setPosition,
    setIsDragging,
  };
};

// 부모 컨테이너용 훅
export const useMovableContainer = () => {
  const activeId = useMovableStoreBase((state) => state.activeId);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const state = useMovableStoreBase.getState();
    if (!state.activeId) return;

    const item = state.items[state.activeId];
    if (!item?.isDragging || !item.offsetRef.current) return;

    state.setPosition(state.activeId, {
      x: e.clientX - item.offsetRef.current.x,
      y: e.clientY - item.offsetRef.current.y,
    });
  }, []);

  const handleMouseUp = useCallback(() => {
    const state = useMovableStoreBase.getState();
    if (state.activeId) {
      state.setIsDragging(state.activeId, false);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    const state = useMovableStoreBase.getState();
    if (state.activeId) {
      state.setIsDragging(state.activeId, false);
    }
  }, []);

  return {
    activeId,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  };
};
