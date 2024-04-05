import React, { useState } from 'react';
import { Map, InfoWindow, Marker, useMap } from '@vis.gl/react-google-maps';

const containerStyle = {
  width: '400px',
  height: '400px',
};

interface MapModalProps {
  latitude: string;
  longitude: string;
  onClose: () => void;
  isOpen: boolean;
}

const MapModal = ({ isOpen, onClose, latitude, longitude }: MapModalProps) => {
  const [infowindowShown, setInfowindowShown] = useState(false);

  if (!isOpen) return null;

  const toggleInfoWindow = () => setInfowindowShown((prev) => !prev);
  const closeInfoWindow = () => setInfowindowShown(false);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg p-4 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          {/* Icono de cierre aquí */}
        </button>
        <Map
          style={containerStyle}
          id="your-map-id"
          center={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
          defaultZoom={15}
        >
          <Marker
            position={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
            onClick={toggleInfoWindow}
          />
          {infowindowShown && (
            <InfoWindow
              position={{
                lat: parseFloat(latitude),
                lng: parseFloat(longitude),
              }}
              onCloseClick={closeInfoWindow}
            >
              <div>Ubicación seleccionada</div>
            </InfoWindow>
          )}
        </Map>
      </div>
    </div>
  );
};

export default MapModal;