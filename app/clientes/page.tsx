// app/clientes/page.tsx
import { PageTitle } from "@/components/ui/PageTitle";
import { ClientesIcon } from "@/components/icons/Icons";
import { FiltroPaginado } from "@/components/Clientes/FIltroPaginado";
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
    console.log("Clientes obtenidos desde la API:", clients);
    fetchClients(clients.data);
  } catch (error) {
    console.error("Error al obtener los clientes desde la API:", error);
    // Maneja el error de alguna manera, por ejemplo, mostrando un mensaje de error al usuario
  }

  const clients = useAppStore.getState().clients;
  console.log("Clientes en la página Clientes:", clients);

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