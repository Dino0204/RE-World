export type BulletType = "5.56mm" | "7.62mm" | "9mm" | "12Gauge" | "Other";

export interface BulletData {
  id: string;
  position: { x: number; y: number; z: number };
  velocity: { x: number; y: number; z: number };
  damage: number;
}
