import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import type * as THREE from "three";
import { Controls } from "../model/player.constants";

type AnimationClip =
  | "idle"
  | "run_forward"
  | "run_backward"
  | "run_left"
  | "run_right";

const FADE_DURATION = 0.2;

function resolveClip(controls: {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
}): AnimationClip {
  if (controls.forward) return "run_forward";
  if (controls.backward) return "run_backward";
  if (controls.left) return "run_left";
  if (controls.right) return "run_right";
  return "idle";
}

export function usePlayerAnimation(
  actions: Record<string, THREE.AnimationAction | null>,
) {
  const currentClipRef = useRef<AnimationClip | null>(null);
  const [, get] = useKeyboardControls<Controls>();

  useFrame(() => {
    const clipName = resolveClip(get());

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
