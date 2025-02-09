import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { useMemo, useRef, useState } from 'react';
import { divIcon, LatLng, Map } from 'leaflet';
import { Client } from '../../../../type/Cliente/Client';
import toast from 'react-hot-toast';
import Modal from '../../EntryComponents/Modal';
import MarkerClusterGroup, { MarkerClusterGroupProps } from 'react-leaflet-markercluster';
import 'leaflet.markercluster'
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import { getMarkerHtml, markerStyles } from './constants';
import { Order } from '../../../../type/Order/Order';

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
    clients: Client[]
    orders: Order[]
}

const LeafletMap = ({ clients, onAdd, activeClient, latitude, longitude, orders }: MapProps) => {
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

    const getCustomIcon = (status: keyof typeof markerStyles) => {
        return divIcon({
            className: 'custom-marker',
            html: getMarkerHtml(markerStyles[status].backgroundColor),
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -12]
        });
    }

    const getClientStatus = (client: Client): keyof typeof markerStyles => {
        // TODO: Check the status assignament process
        if (orders.some(o => !o.attended && o.client === client._id)) { return 'inProgress' }
        if (orders.some(o => o.attended && o.client === client._id)) { return 'attended' }
        return 'default'
    }

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
                        <TileLayer
                            attribution={`&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    }
                    {
                        mapType === 'satellite' &&
                        <TileLayer
                            minZoom={0}
                            maxZoom={20}
                            attribution={`&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}
                            url="https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png"
                        />
                    }
                    {
                        mapType === 'terrain' &&
                        <TileLayer
                            minZoom={0}
                            maxZoom={18}
                            attribution={`'&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors`}
                            url="https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png"
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
                                                const mapZoom = map.current?.getZoom()
                                                map.current?.flyTo(event.latlng, mapZoom && mapZoom >= 13 ? mapZoom : 13)
                                            }
                                        }}
                                        position={new LatLng(Number(client.location.latitude), Number(client.location.longitude))}
                                        key={client._id} icon={getCustomIcon(getClientStatus(client))}>
                                        <Popup>
                                            {client.fullName || "Sin nombre"}
                                        </Popup>
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

                                map.current.flyTo(initialPosition, 13)
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