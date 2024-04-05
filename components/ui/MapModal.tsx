import React, { useState, useEffect, useCallback } from "react";
import { Map, InfoWindow, Marker, useAdvancedMarkerRef, useMap } from "@vis.gl/react-google-maps";

const containerStyle = {
  width: "400px",
  height: "400px",
};

interface MapModalProps {
  latitude: string;
  longitude: string;
  onClose: () => void;
  isOpen: boolean;
}

const MapModal = ({ isOpen, onClose, latitude, longitude }: MapModalProps) => {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [infowindowShown, setInfowindowShown] = useState(false);
  const [zoom, setZoom] = useState(14); // Estado local para el zoom
  const mapId = "a9436b3fadf52148";
  const map = useMap();

  useEffect(() => {
    if (map) {
      const handleZoomChanged = () => {
        const newZoom = map.getZoom() || 14;
        setZoom(newZoom);
      };

      map.addListener("zoom_changed", handleZoomChanged);

      return () => {
        map.removeListener("zoom_changed", handleZoomChanged);
      };
    }
  }, [map]);

  const handleCameraChange = useCallback((event) => {
    console.log('Cámara cambiada: ', event.detail);
  }, []);

  if (!isOpen) return null;

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const toggleInfoWindow = () =>
    setInfowindowShown((previousState) => !previousState);

  const closeInfoWindow = () => setInfowindowShown(false);

  console.log("Lat:", latitude, "Lng:", longitude);
  console.log(mapId);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={handleOverlayClick}
      ></div>
      <div className="bg-white rounded-lg p-4 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          {/* Icono de cierre */}
        </button>
        <Map
          style={containerStyle}
          id={mapId}
          center={{ lat: parseFloat(latitude), lng: parseFloat(longitude) }}
          zoom={zoom} // Utiliza el estado local para el zoom
          onZoomChanged={handleCameraChange}
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