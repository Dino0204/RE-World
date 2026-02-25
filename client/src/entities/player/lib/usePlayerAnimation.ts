import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { usePlayerStore } from "../model/player.store";

type AnimationClip =
  | "idle"
  | "run_forward"
  | "run_backward"
  | "run_left"
  | "run_right";

const FADE_DURATION = 0.2;

function resolveClip(direction: { x: number; z: number }): AnimationClip {
  if (direction.z < 0) return "run_forward";
  if (direction.z > 0) return "run_backward";
  if (direction.x < 0) return "run_left";
  if (direction.x > 0) return "run_right";
  return "idle";
}

export function usePlayerAnimation(
  actions: Record<string, THREE.AnimationAction | null>,
) {
  const currentClipRef = useRef<AnimationClip | null>(null);

  useFrame(() => {
    const { direction } = usePlayerStore.getState();
    const clipName = resolveClip(direction);

    if (currentClipRef.current === null) {
      const idleAction = actions["idle"];
      if (!idleAction) return;
      idleAction.play();
      currentClipRef.current = "idle";
      return;
    }

    if (clipName === currentClipRef.current) return;

    actions[currentClipRef.current]?.fadeOut(FADE_DURATION);
    actions[clipName]?.reset().fadeIn(FADE_DURATION).play();
    currentClipRef.current = clipName;
  });
}
