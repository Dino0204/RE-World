import { Sky } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import Ground from "./Ground";
import Player from "./Player";
import Box from "./Box";

export default function Map() {



  return (
    <>
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={1.5} />

      <Physics gravity={[0, -20, 0]}>
        <Box />
        <Player />
        <Ground />
      </Physics>

    </>
  )
}
