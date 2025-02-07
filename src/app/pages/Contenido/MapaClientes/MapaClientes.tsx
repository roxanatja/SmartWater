import React, { useState, useContext, useEffect } from "react";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./MapaClientes.css";
import { RegistrarNuevo } from "./RegistrarNuevo/RegistrarNuevo";
import { MapaClientesContext } from "./MapaClientesContext";
import GoogleMaps from "../../components/GoogleMaps/GoogleMaps";
import { Client } from "../../../../type/Cliente/Client";
import FiltroClientes from "../Reportes/ReportesIngresos/FiltroClientes/FiltroClientes";
import { ClientsApiConector } from "../../../../api/classes";

const MapaClientes: React.FC = () => {
  const { showMiniModal, setShowMiniModal, showFiltro, setShowFiltro } =
    useContext(MapaClientesContext);
  const api: string = process.env.REACT_APP_API_GOOGLE!;

  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [noClientMessage, setNoClientMessage] = useState<string>("");

  const AddUbicacion = () => {
    setShowMiniModal(true);
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await ClientsApiConector.getClients({ pagination: { page: 1, pageSize: 30000 } });
        setClients(clientsData?.data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery) {
      const filteredClients = clients.filter(
        (client) =>
          client.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          client.phoneNumber.includes(searchQuery)
      );
      if (filteredClients.length > 0) {
        const client = filteredClients[0];
        setLatitude(Number(client.location.latitude || "0"));
        setLongitude(Number(client.location.longitude || "0"));
        setActiveClient(client);
        setNoClientMessage(""); // Clear no client message
        setSuggestions(
          filteredClients.map(
            (client) => `${client.fullName} - ${client.phoneNumber}`
          )
        );
      } else {
        setLatitude(undefined);
        setLongitude(undefined);
        setActiveClient(null);
      }
    } else {
      setLatitude(undefined);
      setLongitude(undefined);
      setActiveClient(null);
      setNoClientMessage(
        "No se encontró ningún cliente con ese nombre o número."
      );
    }
  };

  return (
    <>
      <div className="px-10 overflow-auto h-screen flex justify-between flex-col">
        <PageTitle titulo="Mapa de clientes" icon="./ubicacion-icon.svg" />
        <FiltroPaginado
          noContent
          filtro
          paginacion={false}
          exportar={false}
          iconUbicacion
          search={handleSearch}
          onFilter={() => setShowFiltro(true)}
        ></FiltroPaginado>
        <div className="MapaClientes w-full flex-1 pb-10">
          <GoogleMaps
            apiKey={api}
            latitude={latitude}
            longitude={longitude}
            activeClient={activeClient ? activeClient._id : ""}
          />
        </div>
      </div>
    </>
  );
};

export { MapaClientes };
