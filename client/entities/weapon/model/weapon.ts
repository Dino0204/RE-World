/**
 * name: M416
 * type: 돌격 소총
 * model: m416
 * damage: 20
 * fireRate: 600
 * ammo: {
 *   type: "5.56mm",
 *   amount: 30,
 *   maxAmount: 30
 * }
 * parts: [
 *   {
 *     name: "제동기",
 *     type: "총구",
 *     model: "compensator"
 *   },
 *   {
 *     name: "홀로그래픽 사이트",
 *     type: "조준경",
 *     model: "holographic_sight"
 *   },
 *   {
 *     name: "앵글 손잡이",
 *     type: "손잡이",
 *     model: "angled_foregrip"
 *   },
 *   {
 *     name: "대용량 탄창",
 *     type: "탄창",
 *     model: "large_capacity_magazine"
 *   },
 *   {
 *     name: "중량형 개머리판",
 *     type: "개머리판",
 *     model: "heavy_stock"
 *   }
 * ]
 */

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
}

export interface WeaponPart {
  name: string;
  type: WeaponPartType;
  model: string;
}
