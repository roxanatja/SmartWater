import React, { useRef, useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, InfoWindow } from "@react-google-maps/api";
import { subMonths, isAfter } from "date-fns";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { ClientsApiConector } from "../../../../api/classes";

interface MapProps {
  apiKey: string;
  latitude?: string;
  longitude?: string;
  activeClient?: string;
}

const mapContainerStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: -16.702358987690342,
  lng: -64.8647109444175,
};

const ICONS = {
  renewClient: {
    path: "M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z",
    fillColor: "#FF5C00", // Naranja
    fillOpacity: 1,
    scale: 1,
    strokeWeight: 0,
  },
  inProgress: {
    path: "M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z",
    fillColor: "#DD0000", // Rojo
    fillOpacity: 1,
    scale: 1,
    strokeWeight: 0,
  },
  attended: {
    path: "M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z",
    fillColor: "#1FAF38", // Verde
    fillOpacity: 1,
    scale: 1,
    strokeWeight: 0,
  },
  default: {
    path: "M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z",
    fillColor: "#960090", // Lila
    fillOpacity: 1,
    scale: 1,
    strokeWeight: 0,
  },
};

const GoogleMaps: React.FC<MapProps> = ({
  apiKey,
  latitude,
  longitude,
  activeClient,
}) => {
  const [clients, setClients] = useState<any[]>([]);
  const [filteredClients, setFilteredClients] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  const [activeMarker, setActiveMarker] = useState<any>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const clustererRef = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await ClientsApiConector.getClients({ pagination: { page: 1, pageSize: 3000 } });
        setClients(clientsData?.data || []);
        setFilteredClients(clientsData?.data || []);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    fetchClients();
  }, []);

  const handleScriptLoad = () => {
    setScriptLoaded(true);
  };

  const getMarkerIcon = (client: any) => {
    const oneMonthAgo = subMonths(new Date(), 1);
    const isNewClient = isAfter(new Date(client.created), oneMonthAgo);

    const hasOrderInProgress = orders.some(
      (order) =>
        order.clientNotRegistered.district === client.district &&
        new Date(order.deadLine) > new Date()
    );
    const hasAttendedOrder = orders.some(
      (order) =>
        order.clientNotRegistered.district === client.district &&
        new Date(order.deliverDate) < new Date()
    );

    if (hasOrderInProgress) {
      return ICONS.inProgress;
    }
    if (hasAttendedOrder) {
      return ICONS.attended;
    }
    if (!client.isClient) {
      return ICONS.renewClient;
    }

    return ICONS.default;
  };

  const isValidCoordinate = (latitude: string, longitude: string) => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const isValid = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
    if (!isValid) {
      console.warn(`Invalid coordinates: (${latitude}, ${longitude})`);
    }
    return isValid;
  };

  const handleMarkerClick = (client: any) => {
    setActiveMarker(client);
  };

  const initializeMarkers = useCallback(() => {
    if (mapRef.current) {
      // Clear existing markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      const bounds = new google.maps.LatLngBounds();

      const clientsToShow = activeClient
        ? filteredClients.filter((client) => client._id === activeClient)
        : filteredClients;

      clientsToShow.forEach((client) => {
        const position = {
          lat: parseFloat(client.location.latitude),
          lng: parseFloat(client.location.longitude),
        };

        const marker = new google.maps.Marker({
          position,
          map: mapRef.current,
          icon: getMarkerIcon(client),
          title: client.fullName,
        });

        marker.addListener("click", () => setActiveMarker(client));
        markersRef.current.push(marker);
        bounds.extend(position);
      });

      // Initialize or update marker clusterer
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current.addMarkers(markersRef.current);
      } else {
        clustererRef.current = new MarkerClusterer({
          map: mapRef.current,
          markers: markersRef.current,
        });
      }

      if (!activeClient) {
        mapRef.current.fitBounds(bounds);
      } else if (activeMarker) {
        mapRef.current.setCenter({
          lat: parseFloat(activeMarker.location.latitude),
          lng: parseFloat(activeMarker.location.longitude),
        });
        mapRef.current.setZoom(15);
      }
    }
  }, [activeClient, filteredClients]);

  useEffect(() => {
    if (scriptLoaded) {
      initializeMarkers();
    }
  }, [scriptLoaded, initializeMarkers]);

  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      onLoad={handleScriptLoad}
      libraries={["places"]}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={
          latitude && longitude
            ? { lat: parseFloat(latitude), lng: parseFloat(longitude) }
            : center
        }
        zoom={latitude && longitude ? 15 : 6}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        {activeMarker && (
          <InfoWindow
            position={{
              lat: parseFloat(activeMarker.location.latitude),
              lng: parseFloat(activeMarker.location.longitude),
            }}
            onCloseClick={() => setActiveMarker(null)}
          >
            <div
              style={{
                width: "800px", // Ajusta el ancho según sea necesario
                height: "800px", // Ajusta la altura máxima para evitar desbordamientos
                overflowY: "auto", // Permite el desplazamiento vertical
                padding: "10px", // Agrega padding para el contenido
              }}
            >
              <p>{activeMarker.fullName}</p>
              <img
                src={activeMarker.storeImage}
                alt="imagen no disponible"
                style={{
                  width: "600px",
                  height: "auto", // Ajusta la altura automáticamente
                  maxHeight: "700px", // Limita la altura máxima de la imagen
                  objectFit: "cover",
                  borderRadius: "20px",
                  padding: "10px",
                }}
              />
              <div style={{ padding: "8px" }}>
                <p>{activeMarker.name}</p>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMaps;
