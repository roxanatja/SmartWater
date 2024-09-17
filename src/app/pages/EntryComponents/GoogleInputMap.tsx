import React, { useCallback, useEffect, useRef, useState } from "react";

type GoogleMapWithSelectionProps = {
  onChange: (coordinates: { lat: number; lng: number }) => void;
  latitude?: number;
  longitude?: number;
  visible: boolean; // Estado de visibilidad del modal
};

const GoogleMapWithSelection: React.FC<GoogleMapWithSelectionProps> = ({
  onChange,
  latitude,
  longitude,
  visible, // Recibe la prop visible del modal
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const apiKey = `${process.env.REACT_APP_API_GOOGLE}`;

  // Mover el callback fuera del efecto para evitar cambios infinitos
  const getCurrentLocation = useCallback(
    () =>
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
      }),
    []
  );

  // Simplificar centerMap y updateMarkerPosition para evitar dependencias cambiantes
  const centerMap = useCallback(
    (position: { lat: number; lng: number }) => {
      if (map) {
        map.setCenter(position);
      }
    },
    [map]
  );

  const updateMarkerPosition = useCallback(
    (position: google.maps.LatLng | null) => {
      if (position && marker) {
        marker.setPosition(position);
      }
    },
    [marker]
  );

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
      let initialPosition = {
        lat: -16.702358987690342,
        lng: -64.8647109444175,
      };

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

        const centerMarker = new google.maps.Marker({
          position: mapInstance.getCenter(),
          map: mapInstance,
          draggable: true,
          clickable: false,
        });
        setMarker(centerMarker);

        mapInstance.addListener("center_changed", () => {
          const center = mapInstance.getCenter();
          if (center) {
            const newPosition = {
              lat: center.lat(),
              lng: center.lng(),
            };
            centerMarker.setPosition(center);
            onChange(newPosition); // Solo llamar cuando cambia
          }
        });

        const locationButton = document.createElement("button");
        locationButton.classList.add("custom-map-control-button");
        locationButton.setAttribute("type", "button");
        locationButton.style.cursor = "pointer";
        locationButton.innerHTML =
          '<i class="fa-solid fa-location-crosshairs"></i>';

        mapInstance.controls[google.maps.ControlPosition.TOP_RIGHT].push(
          locationButton
        );

        locationButton.addEventListener("click", async () => {
          try {
            const currentPosition = await getCurrentLocation();
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

    if (visible && !map) {
      loadGoogleMapsScript();
    }

    if (visible && map) {
      google.maps.event.trigger(map, "resize");
      if (latitude !== undefined && longitude !== undefined) {
        map.setCenter({ lat: latitude, lng: longitude });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, visible]);

  useEffect(() => {
    if (map && latitude !== undefined && longitude !== undefined) {
      const position = { lat: latitude, lng: longitude };
      centerMap(position);
      updateMarkerPosition(new google.maps.LatLng(latitude, longitude));
    }
  }, [map, latitude, longitude, centerMap, updateMarkerPosition]);

  return (
    <div style={{ position: "relative" }} className="rounded-lg">
      <div
        ref={mapRef}
        style={{ width: "100%", height: "450px" }}
        className="rounded-lg"
      ></div>
    </div>
  );
};

export default GoogleMapWithSelection;
