// pages/mapa.tsx

import { PageTitle } from "@/components/ui/PageTitle";
import useAppStore from "@/store/appStore";
import { SearchAndFilterHOC } from "@/components/Clientes/SearchAndFilterHOC";
import { MapaIcon } from "@/components/icons/Icons";
import { MapaClientes } from "@/components/Clientes/MapaClientes";
import { ClientResponse } from "@/type/Cliente/Client";
import smartwaterApi from "@/lib/SmartWaterApi";

  export default async function MapaPage() {
  
    const fetchClients = useAppStore.getState().fetchClients;

  try {
    const response = await smartwaterApi.get("/clients?pageSize=3000");
    const clients: ClientResponse = response.data;
    fetchClients(clients.data);
  } catch (error) {}

  const clients = useAppStore.getState().clients;


  return (
    <div>
      <PageTitle titulo="Mapa" icon={<MapaIcon className="w-12 h-12" />} />
      <SearchAndFilterHOC clients={clients}>
        <MapaClientes  />
      </SearchAndFilterHOC>
    </div>
  );
}