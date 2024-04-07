// Suponiendo que el archivo se llama ClienteInfo.tsx

import React from "react";
import { Client } from "@/type/Cliente/Client"; // Asegúrate de que esta importación es correcta

interface ClienteInfoProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client;
}

const ClienteInfo: React.FC<ClienteInfoProps> = ({
  isOpen,
  onClose,
  client,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-sm w-full">
        <h2 className="text-lg font-semibold">{client.fullName}</h2>
        <p>{client.location.latitude}</p>
        <p>
          Aca hay que agregar informacion relevante del cliente, creo que iba la
          portada de su casa
        </p>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ClienteInfo;
