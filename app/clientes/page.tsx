// app/clientes/page.tsx
import { PageTitle } from "@/components/ui/PageTitle";
import { ClientesIcon } from "@/components/icons/Icons";
import { FiltroPaginado } from "@/components/Clientes/FiltroPaginado";
import { useZones } from "@/hooks/useZones";
import useAppStore from "@/store/appStore";
import smartwaterApi from "@/lib/SmartWaterApi";
import { ClientResponse } from "@/type/Cliente/Client";

export default async function Clientes() {
  const zoneAndDistrictNames = await useZones();
  const fetchClients = useAppStore.getState().fetchClients;

  try {
    const response = await smartwaterApi.get("/clients?pageSize=3000");
    const clients: ClientResponse = response.data;
    fetchClients(clients.data);
  } catch (error) {
  }

  const clients = useAppStore.getState().clients;
  return (
    <div>
      <PageTitle
        titulo="Clientes"
        icon={<ClientesIcon className="w-12 h-12" />}
      />
      <FiltroPaginado
        zoneAndDistrictNames={zoneAndDistrictNames}
        clients={clients}
      />
    </div>
  );
}