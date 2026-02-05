import { useImpactStore } from "../model/store";
import ImpactEffect from ".";

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
