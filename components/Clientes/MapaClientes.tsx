// components/Clientes/MapaClientes.tsx
"use client"

import React, { useEffect, useState } from "react";
import { Map, Marker } from "@vis.gl/react-google-maps";
import { Client } from "@/type/Cliente/Client";
import useAppStore from "@/store/appStore";
import ClienteInfo from "../ui/ClienteInfo";

const isValidCoordinate = (coordinate: string): boolean => {
  const value = parseFloat(coordinate);
  return !isNaN(value) && Math.abs(value) <= 90;
};

export const MapaClientes: React.FC = () => {
  const { filteredClients, clients } = useAppStore((state) => ({
    filteredClients: state.filteredClients,
    clients: state.clients,
  }));
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mapClients = filteredClients.length > 0 ? filteredClients : clients;

  console.log(mapClients);

  const handleMarkerClick = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClient(null);
  };

  const mapContainerStyle = {
    width: "100%",
    height: "calc(100vh - 64px)",
  };

  const center = {
    lat: -21.539032997369453,
    lng: -64.7281390028208,
  };

  return (
    <div>
      <Map style={mapContainerStyle} center={center} defaultZoom={14}>
        {mapClients.map((client) => (
          <Marker
            key={client._id}
            position={{
              lat: parseFloat(client.location.latitude) || center.lat,
              lng: parseFloat(client.location.longitude) || center.lng,
            }}
            onClick={() => handleMarkerClick(client)}
            title={client.fullName}
          />
        ))}
      </Map>
      {selectedClient && (
        <ClienteInfo
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          client={selectedClient}
        />
      )}
    </div>
  );
};