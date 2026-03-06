export const PLAYER_MODEL_PATH = "/models/soldier.glb" as const;

export enum Controls {
  forward = "forward",
  backward = "backward",
  left = "left",
  right = "right",
  jump = "jump",
}

export const PLAYER_PHYSICS = {
  SPEED: 10,
  JUMP_FORCE: 6,
  FALL_DAMAGE_THRESHOLD: 15,
  FALL_DAMAGE_MULTIPLIER: 2,
  FALL_DAMAGE_MAX: 100,
} as const;

export const CAMERA_CONFIG = {
  FIRST_PERSON_HEIGHT: 1.6,
  THIRD_PERSON_DISTANCE: 3,
  THIRD_PERSON_HEIGHT: 1.6,
  FOV_NORMAL: 75,
  FOV_ADS: 45,
  FOV_LERP_SPEED: 0.2,
} as const;

export const WEAPON_CONFIG = {
  BULLET_SPAWN_OFFSET: 1.0,
  BULLET_VELOCITY_MULTIPLIER: 20,
  BULLET_HEIGHT_OFFSET: 0.5,
} as const;

export const RECOIL_CONFIG = {
  RECOVERY_DELAY_MS: 100,
  RECOVERY_FACTOR: 0.1,
  RECOVERY_THRESHOLD: 0.001,
  RESET_INTERVAL_MS: 500,
} as const;

export const SYNC_INTERVALS = {
  POSITION_UPDATE_SECONDS: 0.05,
  STATE_UPDATE_SECONDS: 0.2,
} as const;
