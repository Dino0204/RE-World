import { useBulletStore } from "../../../entities/bullet/model/store";
import Bullet from "../../../entities/bullet/ui/index";

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
