import { Weapon } from "re-world-shared/item";
import { WeaponSlotType } from "../model/inventory.store";
import { Draggable, Droppable } from "@hello-pangea/dnd";

interface WeaponSlotProps {
  slotId: WeaponSlotType;
  weapon: Weapon | null;
  label: string;
}

export const WeaponSlot = ({ slotId, weapon, label }: WeaponSlotProps) => {
  return (
    <Droppable droppableId={`weapon-${slotId}`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`flex-1 border transition-all flex flex-col items-center justify-center relative ${
            snapshot.isDraggingOver
              ? "bg-brand-charcoal/20 border-brand-charcoal"
              : "bg-brand-beige/50 border-brand-charcoal/10"
          }`}
        >
          {weapon ? (
            <Draggable draggableId={`equipped-${slotId}`} index={0}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`w-full h-full flex items-center justify-center font-bold text-xs text-brand-charcoal ${
                    snapshot.isDragging ? "opacity-50" : ""
                  }`}
                  style={{ ...provided.draggableProps.style }}
                >
                  {weapon.name}
                </div>
              )}
            </Draggable>
          ) : (
            <div className="text-[10px] text-brand-charcoal/30 font-bold uppercase">
              {label}
            </div>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
