import { Weapon } from "@/entities/weapon/model/weapon";
import { Entity } from "@/entities/entity/model/entity";

export interface PlayerState extends Entity {
  isMoving: boolean;
  isJumping: boolean;
  direction: { x: number; z: number };
  equippedItems: Weapon[];
  isAiming: boolean;
  cameraMode: "FIRST_PERSON" | "THIRD_PERSON";
}

export type PlayerAction =
  | { type: "SET_DIRECTION"; direction: { x: number; z: number } }
  | { type: "JUMP" }
  | { type: "RESET_JUMP" }
  | { type: "EQUIP_ITEM"; item: Weapon }
  | { type: "SET_AIMING"; isAiming: boolean };

export type CameraMode = "FIRST_PERSON" | "THIRD_PERSON";
