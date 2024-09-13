import React, { useCallback, useEffect, useRef, useState } from "react";

type GoogleMapWithSelectionProps = {
  onChange: (coordinates: { lat: number; lng: number }) => void;
};

const GoogleMapWithSelection: React.FC<GoogleMapWithSelectionProps> = ({
  onChange,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const apiKey = `${process.env.REACT_APP_API_GOOGLE}`;

  // Obtener ubicación actual del usuario
  const getCurrentLocation = () =>
    new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            resolve({ lat: latitude, lng: longitude });
          },
          () => reject("No se pudo obtener la ubicación.")
        );
      } else {
        reject("Geolocalización no soportada por el navegador.");
      }
    });

  // Función para centrar el mapa en una posición
  const centerMap = useCallback(
    (position: { lat: number; lng: number }) => {
      if (map) {
        map.setCenter(position);
        onChange(position);
      }
    },
    [map, onChange]
  );

  const updateMarkerPosition = useCallback(
    (position: google.maps.LatLng | null) => {
      if (position && marker) {
        marker.setPosition(position);
        onChange({ lat: position.lat(), lng: position.lng() });
      }
    },
    [marker, onChange]
  );
  // Cargar y configurar el mapa
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        document.head.appendChild(script);
        script.onload = initMap;
      } else {
        initMap();
      }
    };

    const initMap = async () => {
      let initialPosition = { lat: 18.4861, lng: -69.9312 }; // Default a Santo Domingo

      try {
        initialPosition = await getCurrentLocation();
      } catch (error) {
        console.error(error);
      }

      if (mapRef.current && !map) {
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: initialPosition,
          zoom: 14,
          mapTypeId: google.maps.MapTypeId.HYBRID,
          clickableIcons: true,
          fullscreenControl: false,
        });

        setMap(mapInstance);

        // Crear el marcador fijo en el centro del mapa
        const centerMarker = new google.maps.Marker({
          position: mapInstance.getCenter(),
          map: mapInstance,
          draggable: false,
          clickable: false,
        });
        setMarker(centerMarker);

        // Enviar las coordenadas iniciales al componente padre
        onChange(initialPosition);

        // Actualizar la posición del marcador y las coordenadas cuando el centro del mapa cambie
        mapInstance.addListener("center_changed", () => {
          const center = mapInstance.getCenter();
          if (center) {
            const newPosition = {
              lat: center.lat(),
              lng: center.lng(),
            };
            centerMarker.setPosition(center);
            onChange(newPosition);
          }
        });

        // Añadir botón para obtener la ubicación actual
        const locationButton = document.createElement("button");
        locationButton.classList.add("custom-map-control-button");
        locationButton.setAttribute("type", "button");
        locationButton.style.cursor = "pointer";
        locationButton.innerHTML =
          '<i class="fa-solid fa-location-crosshairs"></i>';

        // Colocar el botón en la parte superior central del mapa
        mapInstance.controls[google.maps.ControlPosition.TOP_RIGHT].push(
          locationButton
        );

        // Agregar evento de clic al botón de ubicación actual
        locationButton.addEventListener("click", async () => {
          try {
            const currentPosition = await getCurrentLocation();
            console.log("Ubicación actual:", currentPosition); // Debug
            mapInstance.setCenter(currentPosition);
            updateMarkerPosition(
              new google.maps.LatLng(currentPosition.lat, currentPosition.lng)
            );
          } catch (error) {
            console.error("Error al obtener ubicación:", error);
          }
        });
      }
    };

    loadGoogleMapsScript();
  }, [apiKey, map, onChange, centerMap, updateMarkerPosition]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={mapRef} style={{ width: "100%", height: "450px" }}></div>
    </div>
  );
};

export default GoogleMapWithSelection;
