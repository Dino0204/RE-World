
import { Environment, OrbitControls, useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useState } from "react";
import { useControls } from "leva";

export default function MyElement3D() {

  const model = useGLTF("./models/model.glb");
  const animations = useAnimations(model.animations, model.scene);
  const [height, setHeight] = useState(0);

  const { actionName } = useControls({
    actionName: {
      value: animations.names[1],
      options: animations.names
    }
  })

  useEffect(() => {
    const action = animations.actions[actionName];
    action?.reset().fadeIn(0.5).play();

    return () => {
      action?.fadeOut(0.5);
    }

  }, [actionName])

  useEffect(() => {
    let minY = Infinity, maxY = -Infinity;

    model.scene.traverse((item) => {
      if (item.isMesh) {
        const geomBbox = item.geometry.boundingBox;
        if (minY > geomBbox.min.y) minY = geomBbox.min.y;
        if (maxY < geomBbox.max.y) maxY = geomBbox.max.y;
      }
    });

    const h = maxY - minY;
    console.log("Model Height:", h);
    setHeight

  }, [model.scene])

  return (
    <>
      <OrbitControls />
      <Environment preset="sunset" />
      <primitive
        scale={5}
        object={model.scene}
      />
    </>
  )
}
