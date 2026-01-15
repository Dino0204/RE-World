import { Weapon } from "@/entities/weapon/model/weapon";

export interface PlayerState {
  isMoving: boolean;
  isJumping: boolean;
  direction: { x: number; z: number };
  velocity: { x: number; y: number; z: number };
  speed: number;
  jumpForce: number;
  equippedItems: Weapon[];
}

export type PlayerAction =
  | { type: "SET_DIRECTION"; direction: { x: number; z: number } }
  | { type: "JUMP" }
  | { type: "RESET_JUMP" }
  | { type: "EQUIP_ITEM"; item: Weapon };

export type CameraMode = "FIRST_PERSON" | "THIRD_PERSON";
