import { useImpactStore } from "../model/impact.store";
import ImpactEffect from "./impact";

export default function ImpactManager() {
  const impacts = useImpactStore((state) => state.impacts);

  return (
    <>
      {impacts.map((impact) => (
        <ImpactEffect key={impact.id} data={impact} />
      ))}
    </>
  );
}
