import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useInventoryStore } from "../model/inventory.store";
import { useInventory } from "../model/useInventory";
import { DropResult } from "@hello-pangea/dnd";
import { WeaponSlot } from "./inventory-weapon-slot";
import { SLOT_CONFIGS } from "../model/inventory-slot.data";

export const InventoryHUD = () => {
  const { isOpen, weaponSlots, items, setItems, equipWeapon, unequipWeapon } =
    useInventoryStore();
  useInventory();

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    // 1. 인벤토리 내 순서 변경
    if (
      source.droppableId === "inventory" &&
      destination.droppableId === "inventory"
    ) {
      const newItems = Array.from(items);
      const [movedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, movedItem);
      setItems(newItems);
      return;
    }

    // 2. 인벤토리 -> 무기 슬롯
    if (
      source.droppableId === "inventory" &&
      destination.droppableId.startsWith("weapon-")
    ) {
      const slotName = destination.droppableId.replace("weapon-", "");
      const slotConfig = SLOT_CONFIGS.find((c) => c.id === slotName);
      const draggedItem = items[source.index];

      if (!slotConfig || draggedItem.category !== "WEAPON") return;

      // 타입 체크
      if (!slotConfig.allowedTypes.includes(draggedItem.itemType)) {
        console.warn(
          `이 슬롯에는 ${draggedItem.itemType}을 장착할 수 없습니다.`,
        );
        return;
      }
      equipWeapon(draggedItem, slotConfig.id);
      return;
    }

    // 3. 무기 슬롯 -> 인벤토리
    if (
      source.droppableId.startsWith("weapon-") &&
      destination.droppableId === "inventory"
    ) {
      const slotName = source.droppableId.replace("weapon-", "");
      const slotConfig = SLOT_CONFIGS.find((c) => c.id === slotName);
      if (slotConfig) {
        unequipWeapon(slotConfig.id);
      }
      return;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="z-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-beige-mid/40 p-1 shadow-sm backdrop-blur-sm flex flex-col overflow-hidden select-none">
      <div className="bg-brand-charcoal text-brand-beige px-3 text-xs font-bold tracking-widest mb-1 flex justify-between">
        <span>INVENTORY</span>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 grid grid-cols-7 gap-1 p-8 min-h-0">
          {/* 드롭 아이템 */}
          <section className="col-span-1"></section>

          {/* 인벤토리 */}
          <section className="col-span-1 overflow-x-hidden overflow-y-auto">
            <Droppable droppableId="inventory">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`min-h-full p-1 rounded transition-colors ${
                    snapshot.isDraggingOver
                      ? "bg-brand-charcoal/10"
                      : "bg-transparent"
                  }`}
                >
                  {items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                          className={`mb-1 h-10 bg-brand-beige border transition-all flex items-center justify-center text-[10px] font-medium ${
                            snapshot.isDragging
                              ? "border-brand-charcoal shadow-lg rotate-1"
                              : "border-brand-charcoal/20 hover:border-brand-charcoal/40"
                          }`}
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
                          <span className="text-brand-charcoal">
                            {item.name}
                          </span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </section>

          {/* 캐릭터 프리뷰 */}
          <section className="col-span-3 flex items-center justify-center border border-brand-charcoal/10 bg-brand-beige-mid/10">
            <div className="text-brand-charcoal/30 text-xs font-bold tracking-tighter italic">
              캐릭터
            </div>
          </section>

          {/* 무기 슬롯 */}
          <section className="col-span-2 flex flex-col gap-1">
            {SLOT_CONFIGS.map((config) => (
              <WeaponSlot
                key={config.id}
                slotId={config.id}
                weapon={weaponSlots[config.id]}
                label={config.label}
              />
            ))}
          </section>
        </div>
      </DragDropContext>
    </div>
  );
};
