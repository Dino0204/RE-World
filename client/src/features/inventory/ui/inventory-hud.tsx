import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useInventoryStore } from "../model/inventory.store";
import { useInventory } from "../model/useInventory";
import { useState } from "react";

export const InventoryHUD = () => {
  const { isOpen } = useInventoryStore();
  useInventory();

  // 인벤토리 아이템
  const [inventoryItems, setInventoryItems] = useState([
    { id: "item-1", name: "⚔️ 검", type: "weapon" },
    { id: "item-2", name: "🛡️ 방패", type: "shield" },
    { id: "item-3", name: "🍎 사과", type: "consumable" },
    { id: "item-4", name: "👕 갑옷", type: "armor" },
    { id: "item-5", name: "🍓 딸기", type: "consumable" },
  ]);

  // 장비 슬롯 (각 슬롯은 하나의 아이템만 가능)
  const [equipmentSlots, setEquipmentSlots] = useState({
    weapon: null, // 무기 슬롯
    shield: null, // 방패 슬롯
    armor: null, // 갑옷 슬롯
    accessory1: null, // 악세서리 1
    accessory2: null, // 악세서리 2
  });

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    // 드롭 위치가 없으면 취소
    if (!destination) {
      return;
    }

    // 같은 위치면 취소
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // 1. 인벤토리 내에서 순서 변경
    if (
      source.droppableId === "inventory" &&
      destination.droppableId === "inventory"
    ) {
      const newItems = Array.from(inventoryItems);
      const [movedItem] = newItems.splice(source.index, 1);
      newItems.splice(destination.index, 0, movedItem);
      setInventoryItems(newItems);
      return;
    }

    // 2. 인벤토리 → 장비 슬롯
    if (
      source.droppableId === "inventory" &&
      destination.droppableId.startsWith("equipment-")
    ) {
      const slotName = destination.droppableId.replace("equipment-", "");
      const draggedItem = inventoryItems[source.index];

      // 슬롯에 이미 아이템이 있으면 인벤토리로 되돌림
      if (equipmentSlots[slotName]) {
        const returnedItem = equipmentSlots[slotName];
        const newInventory = [...inventoryItems];
        newInventory.splice(source.index, 1); // 드래그한 아이템 제거
        newInventory.push(returnedItem); // 기존 장비 추가

        setInventoryItems(newInventory);
        setEquipmentSlots({
          ...equipmentSlots,
          [slotName]: draggedItem,
        });
      } else {
        // 슬롯이 비어있으면 그냥 장착
        const newInventory = [...inventoryItems];
        newInventory.splice(source.index, 1);

        setInventoryItems(newInventory);
        setEquipmentSlots({
          ...equipmentSlots,
          [slotName]: draggedItem,
        });
      }
      return;
    }

    // 3. 장비 슬롯 → 인벤토리
    if (
      source.droppableId.startsWith("equipment-") &&
      destination.droppableId === "inventory"
    ) {
      const slotName = source.droppableId.replace("equipment-", "");
      const unequippedItem = equipmentSlots[slotName];

      if (unequippedItem) {
        const newInventory = [...inventoryItems];
        newInventory.splice(destination.index, 0, unequippedItem);

        setInventoryItems(newInventory);
        setEquipmentSlots({
          ...equipmentSlots,
          [slotName]: null,
        });
      }
      return;
    }

    // 4. 장비 슬롯 간 이동 (swap)
    if (
      source.droppableId.startsWith("equipment-") &&
      destination.droppableId.startsWith("equipment-")
    ) {
      const sourceSlot = source.droppableId.replace("equipment-", "");
      const destSlot = destination.droppableId.replace("equipment-", "");

      const sourceItem = equipmentSlots[sourceSlot];
      const destItem = equipmentSlots[destSlot];

      setEquipmentSlots({
        ...equipmentSlots,
        [sourceSlot]: destItem,
        [destSlot]: sourceItem,
      });
      return;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="z-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-beige-mid/40 p-1 shadow-sm backdrop-blur-sm flex flex-col overflow-hidden select-none">
      <div className="bg-brand-charcoal text-brand-beige px-3 text-xs font-bold tracking-widest mb-1 flex justify-between">
        <span>Inventory</span>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-1 grid grid-cols-7 gap-1 p-8 min-h-0">
          <section className="col-span-1"></section>

          {/* 인벤토리 */}
          <section className="col-span-1 overflow-x-hidden overflow-y-auto">
            <Droppable droppableId="inventory">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`min-h-full p-1 rounded transition-colors ${
                    snapshot.isDraggingOver
                      ? "bg-blue-500/20"
                      : "bg-transparent"
                  }`}
                >
                  {inventoryItems.map((item, index) => (
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
                          className={`mb-1 h-10 bg-brand-beige-mid/20 border transition-all flex items-center justify-center text-xs ${
                            snapshot.isDragging
                              ? "border-blue-500 bg-blue-100/50 shadow-lg rotate-2"
                              : "border-brand-charcoal/30 hover:bg-brand-beige-mid/40"
                          }`}
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
                          <span className="text-brand-charcoal/70">
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

          {/* 캐릭터 */}
          <section className="col-span-3 bg-gray-500 flex items-center justify-center text-white">
            character
          </section>

          {/* 장비 슬롯 */}
          <section className="col-span-2 flex flex-col gap-1">
            {/* 무기, 방패, 갑옷 슬롯 */}
            {["weapon", "shield", "armor"].map((slotName) => (
              <EquipmentSlot
                key={slotName}
                slotName={slotName}
                item={equipmentSlots[slotName]}
                label={slotName}
              />
            ))}

            {/* 악세서리 슬롯 (2개) */}
            <div className="flex flex-1 gap-1">
              {["accessory1", "accessory2"].map((slotName, i) => (
                <EquipmentSlot
                  key={slotName}
                  slotName={slotName}
                  item={equipmentSlots[slotName]}
                  label={`💍 악세${i + 1}`}
                />
              ))}
            </div>
          </section>
        </div>
      </DragDropContext>
    </div>
  );
};

// 장비 슬롯 컴포넌트
const EquipmentSlot = ({ slotName, item, label }) => {
  return (
    <Droppable droppableId={`equipment-${slotName}`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex-1 border rounded transition-all ${
            snapshot.isDraggingOver
              ? "bg-green-500/30 border-green-500"
              : "bg-brand-beige-mid/20 border-brand-charcoal/30"
          } hover:bg-brand-beige-mid/40 transition-colors flex flex-col items-center justify-center text-xs`}
        >
          {item ? (
            <Draggable draggableId={item.id} index={0}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`w-full h-full flex items-center justify-center transition-all ${
                    snapshot.isDragging ? "opacity-50 rotate-2" : "opacity-100"
                  }`}
                  style={{
                    ...provided.draggableProps.style,
                  }}
                >
                  <span className="text-brand-charcoal/70">{item.name}</span>
                </div>
              )}
            </Draggable>
          ) : (
            <span className="text-brand-charcoal/50">{label}</span>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
