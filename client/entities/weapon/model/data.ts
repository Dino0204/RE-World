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
  recoil: {
    vertical: 0.02,
    horizontal: 0.01,
    maxVertical: 0.3,
    maxHorizontal: 0.5,
    pattern: [
      { x: 0, y: 0.01 },
      { x: 0.002, y: 0.012 },
      { x: -0.002, y: 0.015 },
      { x: 0.005, y: 0.018 },
      { x: -0.005, y: 0.02 },
      { x: 0.008, y: 0.022 },
      { x: -0.008, y: 0.025 },
    ],
  },
};

export const WEAPONS = [M416];
