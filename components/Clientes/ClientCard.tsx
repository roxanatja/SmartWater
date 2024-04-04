import React, { useState } from "react";
import MapModal from "../ui/MapModal";
import { Client } from "@/type/Cliente/Client";

interface ClientCardProps {
  client: Client;
}

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  const [showMap, setShowMap] = useState(false);

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  return (
    <div>
      <div className="flex items-center">
        <img
          src={client.storeImage}
          alt="Avatar"
          className="w-12 h-12 rounded-full"
        />
        <div className="ml-4">
          <h3>{client.fullName}</h3>
          <p>Zona: {client.zone}</p>
        </div>
      </div>
      <div>
        <p>Última venta: {client.lastSale}</p>
        <p>Préstamos activos: {client.hasLoan ? "Sí" : "No"}</p>
        <button onClick={toggleMap}>Ver ubicación</button>
      </div>
      {showMap && (
        <MapModal
          latitude={client.location.latitude}
          longitude={client.location.longitude}
          onClose={toggleMap}
        />
      )}
    </div>
  );
};

export default ClientCard;
