import { useImpactStore } from "../../../entities/impact/model/store";
import ImpactEffect from "../../../entities/impact/ui";

export default function ImpactManager() {
  const impacts = useImpactStore((state) => state.impacts);

  return (
    <>
      {impacts.map((impact) => (
        <ImpactEffect
          key={impact.id}
          data={impact}
        />
      ))}
    </>
  );
}
