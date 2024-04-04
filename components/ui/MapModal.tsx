import React from "react";

interface MapModalProps {
  latitude: string;
  longitude: string;
  onClose: () => void;
}

const MapModal: React.FC<MapModalProps> = ({
  latitude,
  longitude,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4">
        <button onClick={onClose} className="absolute top-2 right-2">
          Cerrar
        </button>
        {/* Renderizar el componente de mapa aquí */}
        <div>
          Latitud: {latitude}, Longitud: {longitude}
        </div>
      </div>
    </div>
  );
};

export default MapModal;
