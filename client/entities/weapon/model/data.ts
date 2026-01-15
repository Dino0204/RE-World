import { Weapon } from "./weapon";

export const M416: Weapon = {
  name: "M416",
  type: "돌격 소총",
  model: "M416",
  damage: 20,
  fireRate: 600,
  ammo: {
    type: "5.56mm",
    amount: 30,
    maxAmount: 30,
  },
  parts: [],
};
