import { WeaponType } from "re-world-shared/item";
import { WeaponSlotType } from "./inventory.store";

interface WeaponSlotConfig {
  id: WeaponSlotType;
  label: string;
  allowedTypes: WeaponType[];
}

export const SLOT_CONFIGS: WeaponSlotConfig[] = [
  {
    id: "주무기1",
    label: "주무기 1",
    allowedTypes: [
      "돌격 소총",
      "지정 사수 소총",
      "저격 소총",
      "기관 단총",
      "산탄총",
      "경기관총",
    ],
  },
  {
    id: "주무기2",
    label: "주무기 2",
    allowedTypes: [
      "돌격 소총",
      "지정 사수 소총",
      "저격 소총",
      "기관 단총",
      "산탄총",
      "경기관총",
    ],
  },
  {
    id: "보조무기",
    label: "보조무기",
    allowedTypes: ["권총"],
  },
  {
    id: "근접무기",
    label: "근접무기",
    allowedTypes: ["근접무기"],
  },
  {
    id: "투척무기",
    label: "투척무기",
    allowedTypes: ["투척무기"],
  },
];
