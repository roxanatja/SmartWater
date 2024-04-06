// pages/mapa.tsx
import { PageTitle } from "@/components/ui/PageTitle";
import useAppStore from "@/store/appStore";
import { SearchAndFilterHOC } from "@/components/Clientes/SearchAndFilterHOC";
import { MapaIcon } from "@/components/icons/Icons";
import { MapaClientes } from "@/components/Clientes/MapaClientes";

export default function MapaPage() {
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