// app/clientes/page.tsx
import { PageTitle } from "@/components/ui/PageTitle";
import { ClientesIcon } from "@/components/icons/Icons";
import { FiltroPaginado } from "@/components/Clientes/FIltroPaginado";
import { useZones } from "@/hooks/useZones";

export default async function Clientes() {
  const zoneAndDistrictNames = await useZones();

  return (
    <div>
      <PageTitle
        titulo="Clientes"
        icon={<ClientesIcon className="w-12 h-12" />}
      />
      <FiltroPaginado zoneAndDistrictNames={zoneAndDistrictNames} />
    </div>
  );
}
