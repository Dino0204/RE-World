import type { Weapon } from "re-world-shared/item";

export const M416: Weapon = {
  id: crypto.randomUUID(),
  category: "WEAPON",
  weight: 5,
  stackSize: 1,
  name: "M416",
  itemType: "돌격 소총",
  damage: 20,
  fireRate: 600,
  ammo: {
    type: "5.56mm",
    amount: 30,
    maxAmount: 30,
  },
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
  transform: {
    rotation: [0, Math.PI, 0],
    scale: 1,
  },
};

export const PISTOL: Weapon = {
  id: crypto.randomUUID(),
  category: "WEAPON",
  weight: 1,
  stackSize: 1,
  name: "PISTOL",
  itemType: "권총",
  damage: 20,
  fireRate: 100,
  ammo: {
    type: "9mm",
    amount: 30,
    maxAmount: 30,
  },
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
  transform: {
    rotation: [Math.PI / 2, Math.PI, 0],
    scale: 100,
  },
};

export const WEAPONS = [M416, PISTOL];
