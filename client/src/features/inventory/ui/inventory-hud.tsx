import { useInventoryStore } from "../model/inventory.store";
import { useInventory } from "../model/useInventory";

export const InventoryHUD = () => {
  const { isOpen } = useInventoryStore();
  useInventory();

  if (!isOpen) return;

  return (
    <div className="z-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-beige-mid/40 p-1 shadow-sm backdrop-blur-sm flex flex-col overflow-hidden select-none">
      <div className="bg-brand-charcoal text-brand-beige px-3 text-xs font-bold tracking-widest mb-1 flex justify-between">
        <span>Inventory</span>
      </div>
      <div className="flex-1 grid grid-cols-7 gap-1 p-8 min-h-0">
        <section className="col-span-1"></section>
        <section className="col-span-1 overflow-x-hidden overflow-y-auto">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="h-10 bg-brand-beige-mid/20 border border-brand-charcoal/30 hover:bg-brand-beige-mid/40 transition-colors flex items-center justify-center text-xs text-brand-charcoal/50"
            >
              {i + 1}
            </div>
          ))}
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
    </div>
  );
};
