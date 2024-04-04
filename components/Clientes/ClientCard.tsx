// components/Clientes/ClientCard.tsx
import React, { useState } from "react";
import moment from "moment";
import MapModal from "../ui/MapModal";
import { Client } from "@/type/Cliente/Client";
import Image from "next/image";

interface ClientCardProps {
  client: Client;
  zoneAndDistrictNames: Record<string, string>;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  zoneAndDistrictNames,
}) => {
  const [showMap, setShowMap] = useState(false);
  const zoneAndDistrictName = zoneAndDistrictNames[client.district] || "";

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  return (
    <div>
      <div className="flex items-center">
        <Image
          src={client.storeImage}
          alt="Avatar"
          width={48} // Equivalente a w-12 en TailwindCSS (12*4 = 48)
          height={48} // Equivalente a h-12 en TailwindCSS (12*4 = 48)
          className="rounded-full"
          quality={75} // Puedes ajustar esto para reducir el tamaño de la imagen. Valor por defecto: 75
        />
        <div className="ml-4">
          <h3>{client.fullName}</h3>
          <p>Zona: {zoneAndDistrictName}</p>
          <p>ID: {client.code}</p>
          <p>Teléfono: {client.phoneNumber}</p>
        </div>
      </div>
      <div>
        <p>Última venta: {moment(client.lastSale).format("DD/MM/YYYY")}</p>
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
