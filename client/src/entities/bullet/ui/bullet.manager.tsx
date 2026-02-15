import { useBulletStore } from "../model/bullet.store";
import Bullet from "./bullet";

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
