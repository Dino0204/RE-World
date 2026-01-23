import { BulletType } from "@/entities/bullet/model/bullet";

export type WeaponType =
  | "돌격 소총"
  | "지정 사수 소총"
  | "저격 소총"
  | "기관 단총"
  | "산탄총"
  | "경기관총"
  | "기타"
  | "권총"
  | "근접무기"
  | "투척무기";

export type WeaponPartType =
  | "총구"
  | "조준경"
  | "손잡이"
  | "탄창"
  | "개머리판"
  | "기타";

export interface Weapon {
  name: string;
  type: WeaponType;
  model: string;
  damage: number;
  fireRate: number;
  ammo: {
    type: BulletType;
    amount: number;
    maxAmount: number;
  };
  parts: WeaponPart[];
  recoil: {
    vertical: number;
    horizontal: number;
    maxVertical: number;
    maxHorizontal: number;
    pattern: { x: number; y: number }[];
  };
}

export interface WeaponPart {
  name: string;
  type: WeaponPartType;
  model: string;
}
