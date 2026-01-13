import { useBulletStore } from "../model/store";
import Bullet from "./index";

export default function BulletManager() {
  const bullets = useBulletStore((state) => state.bullets);

  return (
    <>
      {bullets.map((bullet) => (
        <Bullet key={bullet.id} data={bullet} />
      ))}
    </>
  );
}
