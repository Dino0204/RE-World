export interface PlayerState {
  isMoving: boolean;
  isJumping: boolean;
  direction: { x: number; z: number };
  velocity: { x: number; y: number; z: number };
  speed: number;
  jumpForce: number;
}

export type PlayerAction =
  | { type: "SET_DIRECTION"; direction: { x: number; z: number } }
  | { type: "JUMP" }
  | { type: "RESET_JUMP" };

export type CameraMode = "FIRST_PERSON" | "THIRD_PERSON";
