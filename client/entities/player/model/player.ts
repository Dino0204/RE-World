export interface PlayerState {
  isMoving: boolean;
  isJumping: boolean;
  direction: { x: number; z: number };
  velocity: { x: number; y: number; z: number };
}

export type PlayerAction =
  | { type: "MOVE_FORWARD" }
  | { type: "MOVE_BACKWARD" }
  | { type: "MOVE_LEFT" }
  | { type: "MOVE_RIGHT" }
  | { type: "JUMP" }
  | { type: "STOP" };
