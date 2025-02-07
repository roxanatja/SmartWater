import React, { useRef, useState, useEffect, useCallback } from "react";
import Modal from "../../EntryComponents/Modal";

interface MapProps {
  apiKey: string;
  latitude?: number;
  longitude?: number;
  activeClient?: string;
}

// const ICONS = {
//   renewClient: {
//     path: "M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z",
//     fillColor: "#FF5C00", // Naranja
//     fillOpacity: 1,
//     scale: 1,
//     strokeWeight: 0,
//   },
//   inProgress: {
//     path: "M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z",
//     fillColor: "#DD0000", // Rojo
//     fillOpacity: 1,
//     scale: 1,
//     strokeWeight: 0,
//   },
//   attended: {
//     path: "M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z",
//     fillColor: "#1FAF38", // Verde
//     fillOpacity: 1,
//     scale: 1,
//     strokeWeight: 0,
//   },
//   default: {
//     path: "M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z",
//     fillColor: "#960090", // Lila
//     fillOpacity: 1,
//     scale: 1,
//     strokeWeight: 0,
//   },
// };

const GoogleMaps: React.FC<MapProps> = ({
  apiKey,
  latitude,
  longitude,
  activeClient,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const [changeMapType, setChangeMapType] = useState<boolean>(false);
  const [mapType, setMapType] = useState<google.maps.MapTypeId | null>(null);

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
          zoom: latitude && longitude ? 15 : 10,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true
        });

        const locationButton = document.createElement("button");
        locationButton.classList.add("custom-map-control-button");
        locationButton.classList.add("!rounded-full");
        locationButton.classList.add("!h-[30px]");
        locationButton.classList.add("!w-[30px]");
        locationButton.classList.add("flex");
        locationButton.classList.add("items-center");
        locationButton.classList.add("justify-center");
        locationButton.classList.add("!right-[20px]");
        locationButton.classList.add("!bottom-[70px]");
        locationButton.setAttribute("type", "button");
        locationButton.style.cursor = "pointer";
        locationButton.innerHTML =
          '<i class="fa-solid fa-location-crosshairs text-sm w-fit h-fit"></i>';

        mapInstance.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(
          locationButton
        );

        locationButton.addEventListener("click", async () => {
          try {
            const currentPosition = await getCurrentLocation();
            mapInstance.setCenter(currentPosition);
          } catch (error) {
            console.error("Error al obtener ubicación:", error);
          }
        });

        setMap(mapInstance);

        const findMarkerButton = document.createElement("button");
        findMarkerButton.classList.add("custom-map-control-button");
        findMarkerButton.classList.add("!rounded-full");
        findMarkerButton.classList.add("!bg-blue_custom");
        findMarkerButton.classList.add("flex");
        findMarkerButton.classList.add("items-center");
        findMarkerButton.classList.add("justify-center");
        findMarkerButton.classList.add("!right-[10px]");
        findMarkerButton.classList.add("!bottom-[10px]");
        findMarkerButton.classList.add("!h-[50px]");
        findMarkerButton.classList.add("!w-[50px]");
        findMarkerButton.setAttribute("type", "button");
        findMarkerButton.style.cursor = "pointer";
        findMarkerButton.innerHTML =
          '<i class="fa fa-plus text-white"></i>';

        mapInstance.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(
          findMarkerButton
        );

        findMarkerButton.addEventListener("click", async () => {
          alert('onAdd')
        });

        const mapTypeButton = document.createElement("button");
        mapTypeButton.classList.add("custom-map-control-button");
        mapTypeButton.classList.add("!rounded-full");
        mapTypeButton.classList.add("flex");
        mapTypeButton.classList.add("items-center");
        mapTypeButton.classList.add("justify-center");
        mapTypeButton.classList.add("!right-[20px]");
        mapTypeButton.classList.add("!top-[10px]");
        mapTypeButton.classList.add("!h-[30px]");
        mapTypeButton.classList.add("!w-[30px]");
        mapTypeButton.setAttribute("type", "button");
        mapTypeButton.style.cursor = "pointer";
        mapTypeButton.innerHTML =
          '<i class="fa-solid fa-layer-group black text-sm w-fit h-fit"></i>';

        mapInstance.controls[google.maps.ControlPosition.TOP_RIGHT].push(
          mapTypeButton
        );

        mapTypeButton.addEventListener("click", async () => {
          setChangeMapType(true)
        });
      }
    };

    if (!map) {
      loadGoogleMapsScript();
    }

    if (map) {
      google.maps.event.trigger(map, "resize");
      if (latitude !== undefined && !isNaN(latitude) && longitude !== undefined && !isNaN(longitude)) {
        map.setCenter({ lat: latitude, lng: longitude });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, map, getCurrentLocation]);

  useEffect(() => {
    if (map) {
      map.setMapTypeId(mapType || google.maps.MapTypeId.ROADMAP)
    }
  }, [map, mapType])

  // const [clients, setClients] = useState<any[]>([]);
  // const [filteredClients, setFilteredClients] = useState<any[]>([]);
  // const [orders, setOrders] = useState<any[]>([]);
  // const [scriptLoaded, setScriptLoaded] = useState<boolean>(false);
  // const [activeMarker, setActiveMarker] = useState<any>(null);
  // const markersRef = useRef<google.maps.Marker[]>([]);
  // const clustererRef = useRef<MarkerClusterer | null>(null);

  // // useEffect(() => {
  // //   const fetchClients = async () => {
  // //     try {
  // //       const clientsData = await ClientsApiConector.getClients({ pagination: { page: 1, pageSize: 30000 } });
  // //       setClients(clientsData?.data || []);
  // //       setFilteredClients(clientsData?.data || []);
  // //     } catch (error) {
  // //       console.error("Error fetching clients:", error);
  // //     }
  // //   };

  // //   fetchClients();
  // // }, []);

  // const handleScriptLoad = () => {
  //   setScriptLoaded(true);
  // };

  // const getMarkerIcon = useCallback((client: any) => {
  //   const hasOrderInProgress = orders.some(
  //     (order) =>
  //       order.clientNotRegistered.district === client.district &&
  //       new Date(order.deadLine) > new Date()
  //   );

  //   const hasAttendedOrder = orders.some(
  //     (order) =>
  //       order.clientNotRegistered.district === client.district &&
  //       new Date(order.deliverDate) < new Date()
  //   );

  //   if (hasOrderInProgress) {
  //     return ICONS.inProgress;
  //   }
  //   if (hasAttendedOrder) {
  //     return ICONS.attended;
  //   }
  //   if (!client.isClient) {
  //     return ICONS.renewClient;
  //   }

  //   return ICONS.default;
  // }, [orders]);

  // const isValidCoordinate = (latitude: string, longitude: string) => {
  //   const lat = parseFloat(latitude);
  //   const lng = parseFloat(longitude);
  //   const isValid = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
  //   if (!isValid) {
  //     console.warn(`Invalid coordinates: (${latitude}, ${longitude})`);
  //   }
  //   return isValid;
  // };

  // const handleMarkerClick = (client: any) => {
  //   setActiveMarker(client);
  // };

  // const initializeMarkers = useCallback(() => {
  //   if (mapRef) {
  //     // Clear existing markers
  //     markersRef.current.forEach((marker) => marker.setMap(null));
  //     markersRef.current = [];

  //     const bounds = new google.maps.LatLngBounds();

  //     const clientsToShow = activeClient
  //       ? filteredClients.filter((client) => client._id === activeClient)
  //       : filteredClients;

  //     clientsToShow.forEach((client) => {
  //       const position = {
  //         lat: parseFloat(client.location.latitude),
  //         lng: parseFloat(client.location.longitude),
  //       };

  //       const marker = new google.maps.Marker({
  //         position,
  //         map: mapRef,
  //         icon: getMarkerIcon(client),
  //         title: client.fullName,
  //       });

  //       marker.addListener("click", () => setActiveMarker(client));
  //       markersRef.current.push(marker);
  //       bounds.extend(position);
  //     });

  //     // Initialize or update marker clusterer
  //     if (clustererRef.current) {
  //       clustererRef.current.clearMarkers();
  //       clustererRef.current.addMarkers(markersRef.current);
  //     } else {
  //       clustererRef.current = new MarkerClusterer({
  //         map: mapRef,
  //         markers: markersRef.current,
  //       });
  //     }

  //     if (!activeClient) {
  //       mapRef.fitBounds(bounds);
  //     } else if (activeMarker) {
  //       mapRef.setCenter({
  //         lat: parseFloat(activeMarker.location.latitude),
  //         lng: parseFloat(activeMarker.location.longitude),
  //       });
  //       mapRef.setZoom(15);
  //     }
  //   }
  // }, [activeClient, filteredClients, activeMarker, getMarkerIcon, mapRef]);

  // useEffect(() => {
  //   if (scriptLoaded) {
  //     initializeMarkers();
  //   }
  // }, [scriptLoaded, initializeMarkers]);

  return (
    <>
      <div
        style={{ position: "relative", height: "100%" }}
        className={`rounded-lg`}
      >
        <div
          ref={mapRef}
          className="rounded-lg h-full w-full"
        ></div>
      </div>

      {
        map &&
        <Modal isOpen={changeMapType} onClose={() => setChangeMapType(false)} className="w-fit">
          <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30">
            Tipo de mapa
          </h2>

          <div className="flex flex-col w-full gap-6 justify-center items-center py-6 px-10">
            <div className="flex flex-row gap-4">
              <div className={`flex flex-col gap-3 items-center cursor-pointer`} onClick={() => { setMapType(!!google ? google.maps.MapTypeId.ROADMAP : null); setChangeMapType(false) }}>
                <img src="/map-standard.png" alt="standard" className={`w-[100px] h-[100px] rounded-[25px] ${!mapType || mapType === google.maps.MapTypeId.ROADMAP ? "border-4 border-blue-500" : ""}`} />
                <span>Estandar</span>
              </div>
              <div className={`flex flex-col gap-3 items-center cursor-pointer`} onClick={() => { setMapType(!!google ? google.maps.MapTypeId.HYBRID : null); setChangeMapType(false) }}>
                <img src="/map-satelite.png" alt="satelite" className={`w-[100px] h-[100px] rounded-[25px] ${mapType === google.maps.MapTypeId.HYBRID ? "border-4 border-blue-500" : ""}`} />
                <span>Satélite</span>
              </div>
              <div className={`flex flex-col gap-3 items-center cursor-pointer`} onClick={() => { setMapType(!!google ? google.maps.MapTypeId.TERRAIN : null); setChangeMapType(false) }}>
                <img src="/map-terrain.png" alt="terrain" className={`w-[100px] h-[100px] rounded-[25px] ${mapType === google.maps.MapTypeId.TERRAIN ? "border-4 border-blue-500" : ""}`} />
                <span>Relieve</span>
              </div>
            </div>

            <button
              onClick={() => setChangeMapType(false)}
              className="w-full outline outline-2 outline-blue-500 bg-blue-500 py-2 rounded-full text-white font-black shadow-xl"
            >
              Cerrar
            </button>
          </div>
        </Modal>
      }
    </>
  );
};

export default GoogleMaps;
