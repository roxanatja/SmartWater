import React, { useState } from 'react';
import { Map, InfoWindow, Marker } from '@vis.gl/react-google-maps';

const containerStyle = {
  width: '400px',
  height: '400px',
};

const defaultLocation = {
  lat: -21.539032997369453,
  lng: -64.7281390028208,
};

interface MapModalProps {
  latitude?: string; 
  longitude?: string;
  onClose: () => void;
  isOpen: boolean;
}

const MapModal = ({ isOpen, onClose, latitude, longitude }: MapModalProps) => {
  const [infowindowShown, setInfowindowShown] = useState(false);

  if (!isOpen) return null;

  const toggleInfoWindow = () => setInfowindowShown((prev) => !prev);
  const closeInfoWindow = () => setInfowindowShown(false);

  const center = {
    lat: latitude && !isNaN(parseFloat(latitude)) ? parseFloat(latitude) : defaultLocation.lat,
    lng: longitude && !isNaN(parseFloat(longitude)) ? parseFloat(longitude) : defaultLocation.lng,
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg p-4 relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
          {/* Icono de cierre aquí */}
        </button>
        <Map style={containerStyle} id="your-map-id" center={center} defaultZoom={15}>
          <Marker position={center} onClick={toggleInfoWindow} />
          {infowindowShown && (
            <InfoWindow position={center} onCloseClick={closeInfoWindow}>
              <div>Ubicación seleccionada</div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </div>
  );
};

export default MapModal;
