import { useImpactStore } from "../../../entities/bullet/model/impactStore";
import ImpactEffect from "../../../entities/bullet/ui/ImpactEffect";

export default function ImpactManager() {
  const impacts = useImpactStore((state) => state.impacts);

  return (
    <>
      {impacts.map((impact) => (
        <ImpactEffect
          key={impact.id}
          position={[impact.position.x, impact.position.y, impact.position.z]}
          material={impact.material}
        />
      ))}
    </>
  );
}
