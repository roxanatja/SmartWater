import { createContext, useEffect, useMemo, useState } from "react";
import { Client } from "../../../../type/Cliente/Client";
import { ClientStatus } from "../../components/LeafletMap/constants";
import { Order } from "../../../../type/Order/Order";
import { Zone } from "../../../../type/City";
import { clientWithStatus } from "../MapaClientes/MapaClientesContext";
import { order } from "../Pedidos/PedidosContext";
import { AuthService } from "../../../../api/services/AuthService";
import { io } from "socket.io-client";
import { UserGeoMonitoring } from "../../../../type/User";

type MonitoreoDistribuidoresContextType = {
    // Client management
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    showMiniModal: boolean;
    setShowMiniModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: boolean;
    setSelectedOption: React.Dispatch<React.SetStateAction<boolean>>;
    showFiltro: boolean;
    setShowFiltro: React.Dispatch<React.SetStateAction<boolean>>;

    selectedClient: Client & { status: ClientStatus };
    setSelectedClient: React.Dispatch<React.SetStateAction<Client & { status: ClientStatus }>>;

    allClients: Client[];
    setAllClients: React.Dispatch<React.SetStateAction<Client[]>>;
    zones: Zone[];
    setZones: React.Dispatch<React.SetStateAction<Zone[]>>;

    selectedOrder: Order;
    setSelectedOrder: React.Dispatch<React.SetStateAction<Order>>;

    // Monitoring
    monitoring: UserGeoMonitoring[];
    setMonitoring: React.Dispatch<React.SetStateAction<UserGeoMonitoring[]>>;
}

export const MonitoreoDistribuidoresContext = createContext<MonitoreoDistribuidoresContextType>(
    {} as MonitoreoDistribuidoresContextType
);

export const MonitoreoDistribuidoresProvider = ({ children }: any) => {
    // Client management
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showMiniModal, setShowMiniModal] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<boolean>(false);
    const [showFiltro, setShowFiltro] = useState<boolean>(false);
    const [zones, setZones] = useState<Zone[]>([]);
    const [allClients, setAllClients] = useState<Client[]>([]);

    const [selectedClient, setSelectedClient] = useState<Client & { status: ClientStatus }>(clientWithStatus);
    const [selectedOrder, setSelectedOrder] = useState<Order>(order);

    // Monitoring
    const user = useMemo(() => AuthService.getUser(), [])
    const [monitoring, setMonitoring] = useState<UserGeoMonitoring[]>([]);

    useEffect(() => {
        if (!user || !user.organization) return;
        const socket = io(process.env.REACT_APP_API_HEROKU);

        console.log('Attempting to connect to socket with organization', user.organization);

        socket.on('connect', () => {
            console.log("Conectado al servidor");
            socket.emit('join organization', user.organization);
        });

        socket.emit("admin_rooms", user);

        const handleDistributorDisconnected = (data: UserGeoMonitoring) => {
            console.log("disconnected", data)
            setMonitoring(prev => {
                const exists = prev.some(m => m._id === data._id);
                return exists
                    ? prev.filter(m => m._id !== data._id)
                    : prev;
            });
        };

        const handleSendGeolocateDelivery = (data: UserGeoMonitoring) => {
            console.log("geodata", data)
            setMonitoring(prev => {
                const exists = prev.some(m => m._id === data._id);
                return exists
                    ? prev.map(m => m._id === data._id ? { ...m, geolocation: data.geolocation } : m)
                    : [...prev, data];
            });
        };

        // Asegurar que los eventos no se dupliquen
        socket.off('distributor_disconnected', handleDistributorDisconnected);
        socket.off('send_geolocate_delibery', handleSendGeolocateDelivery);

        socket.on('distributor_disconnected', handleDistributorDisconnected);
        socket.on('send_geolocate_delibery', handleSendGeolocateDelivery);

        return () => {
            socket.off('distributor_disconnected', handleDistributorDisconnected);
            socket.off('send_geolocate_delibery', handleSendGeolocateDelivery);
            socket.disconnect();
        };
    }, [user])

    return (
        <MonitoreoDistribuidoresContext.Provider value={{
            showModal,
            setShowModal,
            showMiniModal,
            setShowMiniModal,
            selectedOption,
            setSelectedOption,
            showFiltro,
            setShowFiltro,
            selectedClient,
            setSelectedClient,
            zones,
            setZones,
            allClients,
            setAllClients,
            selectedOrder,
            setSelectedOrder,
            monitoring,
            setMonitoring,
        }}>
            {children}
        </MonitoreoDistribuidoresContext.Provider>
    );
}