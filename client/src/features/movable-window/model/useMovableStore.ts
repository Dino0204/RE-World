import { createRef, RefObject, useCallback, useMemo } from "react";
import { create } from "zustand";

export type Position = { x: number; y: number };

interface MovableState {
  position: Position;
  isDragging: boolean;
  offsetRef: RefObject<Position | null>;
  elementRef: RefObject<HTMLDivElement | null> | null;
}

interface MovableStore {
  items: Record<string, MovableState>;
  activeId: string | null;
  containerRef: RefObject<HTMLElement | null> | null;
  setPosition: (id: string, pos: Position) => void;
  setIsDragging: (id: string, dragging: boolean) => void;
  setActiveId: (id: string | null) => void;
  setElementRef: (id: string, ref: RefObject<HTMLDivElement | null>) => void;
  setContainerRef: (ref: RefObject<HTMLElement | null>) => void;
  getOrCreateItem: (id: string) => MovableState;
}

const createInitialState = (): MovableState => ({
  position: { x: 0, y: 0 },
  isDragging: false,
  offsetRef: createRef<Position>(),
  elementRef: null,
});

const useMovableStoreBase = create<MovableStore>((set, get) => ({
  items: {},
  activeId: null,
  containerRef: null,
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
  setElementRef: (id, elementRef) =>
    set((state) => ({
      items: {
        ...state.items,
        [id]: { ...state.items[id], elementRef },
      },
    })),
  setContainerRef: (containerRef) => set({ containerRef }),
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
  const setElementRef = (ref: RefObject<HTMLDivElement | null>) =>
    useMovableStoreBase.getState().setElementRef(id, ref);

  return {
    position,
    isDragging,
    offsetRef,
    setPosition,
    setIsDragging,
    setElementRef,
  };
};

// 부모 컨테이너용 훅
export const useMovableContainer = () => {
  const activeId = useMovableStoreBase((state) => state.activeId);

  const setContainerRef = useCallback((ref: RefObject<HTMLElement | null>) => {
    useMovableStoreBase.getState().setContainerRef(ref);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const state = useMovableStoreBase.getState();
    if (!state.activeId) return;

    const item = state.items[state.activeId];
    if (!item?.isDragging || !item.offsetRef.current) return;

    let newX = e.clientX - item.offsetRef.current.x;
    let newY = e.clientY - item.offsetRef.current.y;

    // 부모 컨테이너와 요소의 경계 체크
    const containerEl = state.containerRef?.current;
    const elementEl = item.elementRef?.current;

    if (containerEl && elementEl) {
      const containerRect = containerEl.getBoundingClientRect();
      const elementRect = elementEl.getBoundingClientRect();

      // 요소의 현재 위치에서 transform을 제외한 기본 위치 계산
      const baseX = elementRect.left - containerRect.left - item.position.x;
      const baseY = elementRect.top - containerRect.top - item.position.y;

      // 경계 계산
      const minX = -baseX;
      const maxX = containerRect.width - elementRect.width - baseX;
      const minY = -baseY;
      const maxY = containerRect.height - elementRect.height - baseY;

      // 경계 내로 제한
      newX = Math.max(minX, Math.min(maxX, newX));
      newY = Math.max(minY, Math.min(maxY, newY));
    }

    state.setPosition(state.activeId, { x: newX, y: newY });
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
    setContainerRef,
  };
};
