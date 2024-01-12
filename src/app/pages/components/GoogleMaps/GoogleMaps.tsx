import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface MapProps {
    apiKey: string;
}

const GoogleMaps: React.FC<MapProps> = ({ apiKey }) => {
    const mapContainerStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
    }

    const center = {
        lat: 0, // Coloca la latitud inicial del centro del mapa
        lng: 0, // Coloca la longitud inicial del centro del mapa
    };

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10}>
                {/* Puedes agregar marcadores u otros elementos aquí */}
                <Marker position={center} />
            </GoogleMap>
        </LoadScript>
    );
};

export{GoogleMaps};