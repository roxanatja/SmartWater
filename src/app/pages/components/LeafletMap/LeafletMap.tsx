import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet'
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { divIcon, LatLng, Map } from 'leaflet';
import { Client } from '../../../../type/Cliente/Client';
import toast from 'react-hot-toast';
import Modal from '../../EntryComponents/Modal';
import MarkerClusterGroup, { MarkerClusterGroupProps } from 'react-leaflet-markercluster';
import 'leaflet.markercluster'
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { ClientStatus, getMarkerHtml, markerStyles } from './constants';
import { MapaClientesContext } from '../../Contenido/MapaClientes/MapaClientesContext';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useSessionStorage } from '@uidotdev/usehooks';

const center = {
    lat: -16.702358987690342,
    lng: -64.8647109444175,
};

export const POSITION_CLASSES = {
    bottomleft: 'leaflet-bottom leaflet-left',
    bottomright: 'leaflet-bottom leaflet-right',
    topleft: 'leaflet-top leaflet-left',
    topright: 'leaflet-top leaflet-right',
}

export type MapPosition = keyof typeof POSITION_CLASSES

interface MapProps {
    latitude?: number;
    longitude?: number;
    activeClient?: string;
    onAdd: VoidFunction;
    clients: (Client & { status: ClientStatus })[]
}

const LeafletMap = ({ clients, onAdd, activeClient, latitude, longitude }: MapProps) => {
    const { setSelectedClient } = useContext(MapaClientesContext);
    const [query, setQuery] = useSearchParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [returnUrl, setReturnUrl] = useSessionStorage("returnUrl", "")

    const map = useRef<Map>(null)

    const [changeMapType, setChangeMapType] = useState<boolean>(false);
    const [mapType, setMapType] = useState<string>('roadmap');

    const currentLocation = useMemo(() => new Promise<{ lat: number; lng: number }>((resolve, reject) => {
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
    }), []);

    const getCustomIcon = (status: ClientStatus) => {
        return divIcon({
            className: 'custom-marker',
            html: getMarkerHtml(markerStyles[status].backgroundColor),
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -12]
        });
    }

    useEffect(() => {
        if (map.current && latitude && longitude) {
            const mapZoom = map.current?.getZoom()
            map.current.flyTo([latitude, longitude], mapZoom && mapZoom > 14 ? mapZoom : 14)

            query.delete('latitude')
            query.delete('longitude')
            setQuery(query)
        }
    }, [latitude, longitude, map, query, setQuery])

    return (
        <>
            <div
                style={{ position: "relative", height: "100%" }}
                className={`rounded-lg overflow-hidden`}
            >
                <MapContainer ref={map} center={center}
                    zoom={7} style={{ width: "100%", height: "100%" }} zoomControl={false}>
                    {
                        mapType === 'roadmap' &&
                        // <TileLayer
                        //     minZoom={2}
                        //     maxZoom={17}
                        //     attribution={`&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors`}
                        //     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        // />
                        <TileLayer
                            minZoom={2}
                            maxZoom={17}
                            attribution={`Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012`}
                            url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                        />
                    }
                    {
                        mapType === 'satellite' &&
                        <>
                            <TileLayer
                                minZoom={2}
                                maxZoom={17}
                                attribution={`Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community`}
                                url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            />
                            <TileLayer
                                minZoom={2}
                                maxZoom={17}
                                subdomains={['a', 'b', 'c', 'd']}
                                attribution={`&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}
                                url='https://tiles.stadiamaps.com/tiles/stamen_toner_labels/{z}/{x}/{y}{r}.png' />
                            {/* <TileLayer
                                minZoom={2}
                                maxZoom={17}
                                subdomains={['a', 'b', 'c', 'd']}
                                attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>`}
                                url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png' /> */}
                        </>
                    }
                    {
                        mapType === 'terrain' &&
                        <TileLayer
                            minZoom={2}
                            maxZoom={17}
                            attribution={`Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community`}
                            url="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
                        />
                    }

                    <MarkerClusterGroup {...{
                        chunkedLoading: true,
                        animate: true
                    } as MarkerClusterGroupProps}>
                        {
                            clients.filter(c => !!c.location?.latitude && !!c.location?.longitude && !isNaN(Number(c.location.latitude)) && !isNaN(Number(c.location.longitude))).map((client) => {
                                return (
                                    <Marker
                                        eventHandlers={{
                                            click: (event) => {
                                                setSelectedClient(client);
                                                setReturnUrl(`${location.pathname}${location.search}&latitude=${client.location.latitude}&longitude=${client.location.longitude}`)
                                                navigate("/MapaClientes/DetallesCliente")
                                            }
                                        }}
                                        position={new LatLng(Number(client.location.latitude), Number(client.location.longitude))}
                                        key={client._id} icon={getCustomIcon(client.status)}>
                                        <Tooltip direction='top' offset={[0, -12]}>
                                            {client.fullName || "Sin nombre"} {(!client.isClient && !client.isAgency) ? ('from' in client && client.from === "customer") ? "(De SmartApp)" : "(Cliente no registrado)" : ""}
                                        </Tooltip>
                                    </Marker>
                                )
                            })
                        }
                    </MarkerClusterGroup>

                    <button type='button' className={`${POSITION_CLASSES.topright} !rounded-full cursor-pointer flex items-center justify-center !right-[20px] !top-[10px] !w-[30px] !h-[30px] custom-map-control-button !pointer-events-auto shadow-lg shadow-black/60 !border !border-black/25`}
                        onClick={() => setChangeMapType(true)}>
                        <i className="fa-solid fa-layer-group black text-sm w-fit h-fit"></i>
                    </button>

                    <button type='button' className={`${POSITION_CLASSES.bottomright} !rounded-full cursor-pointer flex items-center justify-center !right-[20px] !bottom-[70px] !w-[30px] !h-[30px] custom-map-control-button !pointer-events-auto shadow-lg shadow-black/60 !border !border-black/25`}
                        onClick={async () => {
                            if (map.current) {
                                let initialPosition = center

                                try {
                                    initialPosition = await currentLocation;
                                } catch (error) {
                                    console.error(error);
                                }

                                map.current.flyTo(initialPosition, 17)
                            } else {
                                toast.error("Instancia del mapa no inicializada")
                            }
                        }}>
                        <i className="fa-solid fa-location-crosshairs text-sm w-fit h-fit"></i>
                    </button>
                    <button type='button' className={`${POSITION_CLASSES.bottomright} !bg-blue_custom !rounded-full cursor-pointer flex items-center justify-center !right-[10px] !bottom-[10px] !w-[50px] !h-[50px] custom-map-control-button !pointer-events-auto shadow-lg shadow-black/60`}
                        onClick={() => onAdd()}>
                        <i className="fa fa-plus text-white"></i>
                    </button>
                </MapContainer>
            </div>

            <Modal isOpen={changeMapType} onClose={() => setChangeMapType(false)} className="w-fit">
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30">
                    Tipo de mapa
                </h2>

                <div className="flex flex-col w-full gap-6 justify-center items-center py-6 px-10">
                    <div className="flex flex-row gap-4">
                        <div className={`flex flex-col gap-3 items-center cursor-pointer`} onClick={() => {
                            setMapType('roadmap');
                            setChangeMapType(false);
                        }}>
                            <img src="/map-standard.png" alt="standard" className={`w-[100px] h-[100px] rounded-[25px] ${mapType === "roadmap" ? "border-4 border-blue-500" : ""}`} />
                            <span>Estandar</span>
                        </div>
                        <div className={`flex flex-col gap-3 items-center cursor-pointer`} onClick={() => {
                            setMapType('satellite');
                            setChangeMapType(false);
                        }}>
                            <img src="/map-satelite.png" alt="satelite" className={`w-[100px] h-[100px] rounded-[25px] ${mapType === "satellite" ? "border-4 border-blue-500" : ""}`} />
                            <span>Satélite</span>
                        </div>
                        <div className={`flex flex-col gap-3 items-center cursor-pointer`} onClick={() => {
                            setMapType("terrain");
                            setChangeMapType(false);
                        }}>
                            <img src="/map-terrain.png" alt="terrain" className={`w-[100px] h-[100px] rounded-[25px] ${mapType === "terrain" ? "border-4 border-blue-500" : ""}`} />
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
        </>
    )
}

export default LeafletMap