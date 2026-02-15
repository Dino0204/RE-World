import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useInventoryStore } from "../model/inventory.store";
import { useInventory } from "../model/useInventory";
import { useState } from "react";

export const InventoryHUD = () => {
  const { isOpen } = useInventoryStore();
  useInventory();

  const [items, setItems] = useState([
    { id: "1", content: "🍎 사과" },
    { id: "2", content: "🍌 바나나" },
    { id: "3", content: "🍊 오렌지" },
    { id: "4", content: "🍇 포도" },
    { id: "5", content: "🍓 딸기" },
  ]);

  const handleDragEnd = (result) => {
    // 드롭 위치가 없으면 (리스트 밖으로 드롭) 아무것도 하지 않음
    if (!result.destination) {
      return;
    }

    // 같은 위치에 드롭하면 아무것도 하지 않음
    if (result.destination.index === result.source.index) {
      return;
    }

    // 새로운 순서로 아이템 재정렬
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    setItems(newItems);
  };

  if (!isOpen) return;

  return (
    <div className="z-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-beige-mid/40 p-1 shadow-sm backdrop-blur-sm flex flex-col overflow-hidden select-none">
      <div className="bg-brand-charcoal text-brand-beige px-3 text-xs font-bold tracking-widest mb-1 flex justify-between">
        <span>Inventory</span>
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 grid grid-cols-7 gap-1 p-8 min-h-0">
          <section className="col-span-1"></section>
          <section className="col-span-1 overflow-x-hidden overflow-y-auto">
            <Droppable droppableId="item-list">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={String(item.id)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className={`${snapshot.draggingOver == "w-1" ? "border border-blue-500" : "border border-red-500"} h-10 bg-brand-beige-mid/20 border border-brand-charcoal/30 hover:bg-brand-beige-mid/40 transition-colors flex items-center justify-center text-xs text-brand-charcoal/50`}
                        >
                          <span>{item.id + 1}</span>
                          <span>{item.content}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          </section>
          <section className="col-span-3 bg-gray-500">character</section>
          <section className="col-span-2 flex flex-col gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-brand-beige-mid/20 border border-brand-charcoal/30 hover:bg-brand-beige-mid/40 transition-colors flex items-center justify-center text-xs text-brand-charcoal/50"
              >
                {i + 1}
              </div>
            ))}
            <div className="flex flex-1 gap-1">
              {Array.from({ length: 2 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-brand-beige-mid/20 border border-brand-charcoal/30 hover:bg-brand-beige-mid/40 transition-colors flex items-center justify-center text-xs text-brand-charcoal/50"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </section>
        </div>
      </DragDropContext>
    </div>
  );
};
