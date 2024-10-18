import React, { useState, useContext, useEffect } from "react";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./MapaClientes.css";
import { RegistrarNuevo } from "./RegistrarNuevo/RegistrarNuevo";
import { MapaClientesContext } from "./MapaClientesContext";
import GoogleMaps from "../../components/GoogleMaps/GoogleMaps";
import { loadClients } from "../../../../services/ClientsService";
import { Client } from "../../../../type/Cliente/Client";
import FiltroClientes from "../Reportes/ReportesIngresos/FiltroClientes/FiltroClientes";

const MapaClientes: React.FC = () => {
  const { showMiniModal, setShowMiniModal, showFiltro, setShowFiltro } =
    useContext(MapaClientesContext);
  const api: string = "AIzaSyClt5h7hYmQJYdfK_-ee5c3msh1rnt7GfE";

  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");
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
        const clientsData = await loadClients();
        setClients(clientsData.data);
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
        setLatitude(client.location.latitude);
        setLongitude(client.location.longitude);
        setActiveClient(client);
        setNoClientMessage(""); // Clear no client message
        setSuggestions(
          filteredClients.map(
            (client) => `${client.fullName} - ${client.phoneNumber}`
          )
        );
      } else {
        setLatitude("");
        setLongitude("");
        setActiveClient(null);
      }
    } else {
      setLatitude("");
      setLongitude("");
      setActiveClient(null);
      setNoClientMessage(
        "No se encontró ningún cliente con ese nombre o número."
      );
    }
  };

  return (
    <>
      <div>
        <PageTitle titulo="Mapa de clientes" icon="./ubicacion-icon.svg" />
        <FiltroPaginado
          filtro
          paginacion={false}
          add={true}
          exportar={false}
          onAdd={AddUbicacion}
          iconUbicacion
          search={handleSearch}
          onFilter={() => setShowFiltro(true)}
        >
          <div className="Mapaclientes-googleubicacion">
            <GoogleMaps
              apiKey={api}
              latitude={latitude}
              longitude={longitude}
              activeClient={activeClient ? activeClient._id : ""}
            />
          </div>
        </FiltroPaginado>
      </div>
      {showMiniModal && <RegistrarNuevo />}
      {/* {showFiltro && <FiltroClientes />} */}
    </>
  );
};

export { MapaClientes };
