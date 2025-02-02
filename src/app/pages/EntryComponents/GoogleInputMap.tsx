import React, { useCallback, useEffect, useRef, useState } from "react";

type GoogleMapWithSelectionProps = {
  onChange: (coordinates: { lat: number; lng: number }) => void;
  latitude?: number;
  longitude?: number;
  visible: boolean;
  linkAddress?: string;
  disable?: boolean;
};

const GoogleMapWithSelection: React.FC<GoogleMapWithSelectionProps> = ({
  onChange,
  latitude,
  longitude,
  visible,
  linkAddress,
  disable,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const apiKey = `${process.env.REACT_APP_API_GOOGLE}`;
  const [mapInteractive, setMapInteractive] = useState<boolean>(false);

  useEffect(() => {
    setMapInteractive(disable ? true : false);
  }, [disable]);

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
          fullscreenControl: false,
          disableDefaultUI: true,

        });

        setMap(mapInstance);

        const centerMarker = new google.maps.Marker({
          position: mapInstance.getCenter(),
          map: mapInstance,
          draggable: true,
          clickable: false,
        });
        setMarker(centerMarker);

        if (latitude && !isNaN(latitude) && longitude && !isNaN(longitude)) {
          centerMarker.setPosition({ lat: latitude, lng: longitude })
          onChange({ lat: latitude, lng: longitude });
        } else {
          centerMarker.setPosition({ lat: initialPosition.lat, lng: initialPosition.lng })
          onChange(initialPosition);
        }

        mapInstance.addListener("click", (e: any) => {
          const newPosition = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };
          centerMarker.setPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
          onChange(newPosition);
        });

        centerMarker.addListener('dragend', (e: any) => {
          const newPosition = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };
          onChange(newPosition);
        })

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

        const findMarkerButton = document.createElement("button");
        findMarkerButton.classList.add("custom-map-control-button");
        findMarkerButton.classList.add("!rounded-full");
        findMarkerButton.classList.add("!left-0");
        findMarkerButton.classList.add("!bottom-4");
        findMarkerButton.setAttribute("type", "button");
        findMarkerButton.style.cursor = "pointer";
        findMarkerButton.innerHTML =
          '<i class="fa fa-map-marker"></i>';

        mapInstance.controls[google.maps.ControlPosition.BOTTOM_LEFT].push(
          findMarkerButton
        );

        findMarkerButton.addEventListener("click", async () => {
          try {
            const currentPosition = centerMarker.getPosition();
            if (currentPosition) {
              mapInstance.setCenter({ lat: currentPosition.lat(), lng: currentPosition.lng() });
            }
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
      if (latitude !== undefined && !isNaN(latitude) && longitude !== undefined && !isNaN(longitude)) {
        map.setCenter({ lat: latitude, lng: longitude });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, getCurrentLocation, map, updateMarkerPosition, visible]);

  useEffect(() => {
    if (map && latitude !== undefined && !isNaN(latitude) && longitude !== undefined && !isNaN(longitude)) {
      const position = { lat: latitude, lng: longitude };
      centerMap(position);
      updateMarkerPosition(new google.maps.LatLng(latitude, longitude));
    }
  }, [map, latitude, longitude, centerMap, updateMarkerPosition]);

  const getCoordinatesFromLink = useCallback(
    async (link: string): Promise<{ lat: number; lng: number } | null> => {
      try {
        const url = new URL(link);
        const params = url.searchParams.get("q");

        if (params) {
          const [lat, lng] = params.split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            return { lat, lng };
          }
        }

        // Manejo de URLs de Google Maps con formato @lat,lng
        const path = url.pathname;
        const match = path.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (match) {
          const [, lat, lng] = match;
          return { lat: parseFloat(lat), lng: parseFloat(lng) };
        }
      } catch (error) {
        console.error("Error al analizar el enlace:", error);
      }
      return null;
    },
    []
  );

  const getCoordinatesFromAddress = async (
    address: string
  ): Promise<{ lat: number; lng: number } | null> => {
    const apiKey = process.env.REACT_APP_API_GOOGLE;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status === "OK" && data.results[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      }
    } catch (error) {
      console.error("Error al obtener coordenadas:", error);
    }
    return null;
  };

  // Uso en tu componente
  useEffect(() => {
    if (linkAddress) {
      const fetchCoordinates = async () => {
        const coordinates = await getCoordinatesFromAddress(linkAddress);
        if (coordinates && map) {
          centerMap(coordinates);
          updateMarkerPosition(
            new google.maps.LatLng(coordinates.lat, coordinates.lng)
          );
          onChange(coordinates);
          setMapInteractive(true);
          console.log(coordinates);
        }
      };
      fetchCoordinates();
    }
  }, [linkAddress, map, centerMap, updateMarkerPosition, onChange]);

  useEffect(() => {
    if (linkAddress) {
      getCoordinatesFromLink(linkAddress).then(
        (coordinates: { lat: number; lng: number } | null) => {
          if (coordinates && map) {
            centerMap(coordinates);
            updateMarkerPosition(
              new google.maps.LatLng(coordinates.lat, coordinates.lng)
            );
            onChange(coordinates);
            setMapInteractive(true);
          }
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [linkAddress, map, centerMap, updateMarkerPosition]);

  return (
    <div
      style={{ position: "relative" }}
      className={`rounded-lg ${mapInteractive ? "pointer-events-none" : ""}`}
    >
      <div
        ref={mapRef}
        style={{ width: "100%", height: "450px" }}
        className="rounded-lg"
      ></div>
      {mapInteractive && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            zIndex: 10,
          }}
        />
      )}
    </div>
  );
};

export default GoogleMapWithSelection;
