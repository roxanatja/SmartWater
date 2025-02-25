import { useGlobalContext } from "../../../SmartwaterContext";
import { FiltroPaginado, IFiltroPaginadoReference } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./MonitoreoDistribuidores.css";
import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { MonitoreoDistribuidoresContext } from "./MonitoreoDistribuidoresContext";
import { Client } from "../../../../type/Cliente/Client";
import { ClientStatus } from "../../components/LeafletMap/constants";
import { IClientGetParams } from "../../../../api/types/clients";
import { useNavigate, useSearchParams } from "react-router-dom";
import moment from "moment";
import { Order } from "../../../../type/Order/Order";
import { ClientsApiConector, LoansApiConector, OrdersApiConector, UsersApiConector, ZonesApiConector } from "../../../../api/classes";
import { useDebounce } from "@uidotdev/usehooks";
import LeafletMap from "../../components/LeafletMap/LeafletMap";
import Modal from "../../EntryComponents/Modal";
import ClientForm from "../../EntryComponents/Client.form";
import { client } from "../Clientes/ClientesContext";
import { User } from "../../../../type/User";
import { OpcionesMap } from "./OpcionesMap/OpcionesMap";
import FiltroClientesMapa from "../MapaClientes/FiltroClientesMapa/FiltroClientesMapa";

const colorsDistribuidors = [
    "#005B96",
    "#FBBC04",
    "#00AFEF",
]

const DISABLED_DISTRIUDOR = "#AEAEAE"

const MonitoreoDistribuidores: FC = () => {
    const {
        showFiltro, setShowFiltro,
        showModal, setShowModal,
        selectedOption, setSelectedOption,
        zones, setZones,
        allClients, setAllClients,
        setSelectedClient,
        monitoring
    } = useContext(MonitoreoDistribuidoresContext);
    const { setLoading } = useGlobalContext()

    const [clients, setClients] = useState<(Client & { status: ClientStatus })[]>([]);
    const [passedThis, setPassedThis] = useState<boolean>(false);

    const [latitude, setLatitude] = useState<number | undefined>(undefined);
    const [longitude, setLongitude] = useState<number | undefined>(undefined);

    const [distribuidores, setDistribuidores] = useState<User[]>([]);

    const filterRef = useRef<IFiltroPaginadoReference>(null)
    const [savedFilters, setSavedFilters] = useState<IClientGetParams['filters'] & { status?: ClientStatus[] }>({});
    const [query, setQuery] = useSearchParams()
    const [queryData, setQueryData] = useState<IClientGetParams & { text?: string; status?: ClientStatus[] } | null>(null)

    const navigate = useNavigate()

    useEffect(() => {
        if (query.has('latitude') && query.has('longitude')) {
            console.log("Hi there", latitude, longitude)
            setLatitude(parseFloat(query.get('latitude')!))
            setLongitude(parseFloat(query.get('longitude')!))
        } else {
            setLatitude(undefined)
            setLongitude(undefined)
        }

        if (query.has('filters')) {
            const queryRes: IClientGetParams & { text?: string; status?: ClientStatus[] } = JSON.parse(atob(query.get('filters')!))
            setQueryData(queryRes)

            if (queryRes.filters) {
                if (queryRes.text) {
                    filterRef.current?.setSearch(queryRes.text)
                } else {
                    filterRef.current?.clearSearch()
                }

                if (queryRes.filters) {
                    const filters: IClientGetParams['filters'] & { status?: ClientStatus[] } = { ...queryRes.filters }
                    if (queryRes.status) { filters.status = queryRes.status }
                    setSavedFilters(filters)
                }
            }
        } else {
            setQuery({ filters: btoa(JSON.stringify({ filters: {} })) })
        }

        setPassedThis(true)
    }, [query, setQuery])

    const getClientStatus = (client: Client, orders: Order[]): ClientStatus => {
        if (orders.some(o => !o.attended && o.client === client._id)) { return 'inProgress' }
        if (orders.some(o => o.attended && moment(o.attended).isSame(moment(), 'day') && o.client === client._id)) { return 'attended' }
        if (client.renewDate) {
            if (moment().isAfter(client.renewDate)) { return 'renewClient' }
        }
        return 'default'
    }

    const getClientActiveOrders = (client: Client, orders: Order[]): string[] => {
        const ords = orders.filter(o => !o.attended && moment(o.attended).isSame(moment(), 'day') && o.client === client._id)
        return ords.map(o => o._id)
    }

    const getClientStatusFromOrder = (o: Order): ClientStatus => {
        if (!o.attended) { return 'inProgress' }
        if (o.attended && moment(o.attended).isSame(moment(), 'day')) { return 'attended' }
        return 'default'
    }

    const fetchClients = useCallback(async () => {
        if (passedThis) {
            setLoading(true)
            const ordersData = await OrdersApiConector.get({ pagination: { page: 1, pageSize: 30000 } });
            const ords = ordersData?.data || [];
            const loansData = await LoansApiConector.get({ pagination: { page: 1, pageSize: 30000 } });
            const loans = loansData?.data || [];

            const qd = { ...queryData }
            const extraFilters: IClientGetParams['filters'] = {}

            if (!!qd.filters?.initialDate && !qd.filters?.finalDate) {
                extraFilters.finalDate = moment().format("YYYY-MM-DD")
            }
            if (!qd.filters?.initialDate && !!qd.filters?.finalDate) {
                extraFilters.initialDate = "2020-01-01"
            }

            const clientsData = await ClientsApiConector.getClients({ pagination: { page: 1, pageSize: 30000 }, filters: { ...qd.filters, ...extraFilters, clientDeleted: false } });
            let clientsToSet = clientsData?.data || [];

            let clientsWithStatus: (Client & { status: ClientStatus })[] = clientsToSet.map((client) => {
                const status = getClientStatus(client, ords)
                if (status === 'inProgress') {
                    const activeOrders = getClientActiveOrders(client, ords)
                    return { ...client, status, numberOfOrders: activeOrders.length, associatedOrders: activeOrders, numberOfLoans: loans.filter(l => l.client.some(c => c._id === client._id)).length }
                } else {
                    return { ...client, status, associatedOrders: [], numberOfLoans: loans.filter(l => l.client.some(c => c._id === client._id)).length }
                }
            });

            if (ords) {
                clientsWithStatus.push(...ords.filter(o => !o.client && !o.attended).map((o) => ({ ...o.clientNotRegistered as unknown as Client, isClient: false, isAgency: false, associatedOrders: [o._id], status: getClientStatusFromOrder(o), numberOfOrders: 1 })))
            }

            if (qd.text) {
                clientsWithStatus = clientsWithStatus.filter(
                    (client) =>
                        client.fullName?.toLowerCase().includes(qd.text!.toLowerCase()) ||
                        client.phoneNumber?.includes(qd.text!)
                )
            }

            if (qd.status) {
                clientsWithStatus = clientsWithStatus.filter((client) => qd.status!.includes(client.status))
            }
            setClients(clientsWithStatus);

            setLoading(false)
        }
    }, [queryData, setLoading, passedThis]);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    useEffect(() => {
        const fetchZones = async () => {
            setZones((await ZonesApiConector.get({}))?.data || []);
            setAllClients((await ClientsApiConector.getClients({ pagination: { page: 1, pageSize: 30000 } }))?.data || []);
            setDistribuidores((await UsersApiConector.get({ pagination: { page: 1, pageSize: 30000, sort: 'desc' }, filters: { desactivated: false } }))?.data || []);
        }
        fetchZones()
    }, [])

    const handleFilterChange = (filters: IClientGetParams['filters'] & { status?: ClientStatus[] }) => {
        const status = filters.status
        delete filters.status

        setQuery({ filters: btoa(JSON.stringify({ filters, text: queryData?.text, status })) })
        setSavedFilters(filters);
    };

    const [searchTerm, setSearchTerm] = useState<string>("")
    const searchParam = useDebounce<string>(searchTerm, 400)
    useEffect(() => {
        if (searchParam && searchParam.trim() !== "") {
            if (!queryData?.text || queryData.text !== searchParam) {
                setQuery({ filters: btoa(JSON.stringify({ ...queryData, text: searchParam })) })
            }
        } else {
            if (!!queryData?.text) {
                setQuery({ filters: btoa(JSON.stringify({ ...queryData, text: undefined })) })
            }
        }
    }, [searchParam])

    return (
        <>
            <div className="px-10 overflow-auto h-screen flex justify-between flex-col">
                <PageTitle titulo="Monitoreo de distribuidores" icon="./ubicacion-icon.svg" />
                <FiltroPaginado
                    ref={filterRef}
                    noContent
                    filtro
                    paginacion={false}
                    exportar={false}
                    iconUbicacion
                    iconUbicacionInject={
                        <div className="flex gap-8 mb-[25px] mt-[10px] overflow-auto py-2">
                            {
                                distribuidores.filter(d => d.role === 'user').map((d, index) => {
                                    const monitored = monitoring.find(m => m._id === d._id)
                                    const isActive = !!monitored

                                    return <div className="Mapaclientes-ubicacion cursor-pointer" key={d._id} onClick={() => {
                                        if (isActive) {
                                            setLatitude(monitored.geolocation.latitude)
                                            setLongitude(monitored.geolocation.longitude)

                                            setTimeout(() => {
                                                setLatitude(undefined)
                                                setLongitude(undefined)
                                            }, 500);
                                        }
                                    }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 39 38" fill="none">
                                            <path d="M17.2319 2.09792C24 19.5978 7.23193 22.5979 0.231928 16.0979C-0.968072 23.698 2.7324 29.0979 5.73193 29.0979H23.7319C26.5 7.59778 21 1.09766 17.2319 2.09792Z" fill={isActive ? colorsDistribuidors[index % colorsDistribuidors.length] : DISABLED_DISTRIUDOR} />
                                            <path d="M27 17.5976V8.59756C37.4 7.79756 38.6667 14.5976 38 18.0976L27 17.5976Z" fill={isActive ? colorsDistribuidors[index % colorsDistribuidors.length] : DISABLED_DISTRIUDOR} />
                                            <path d="M27 21.068V29.5366C37.2632 30.2893 38.6579 24.891 38 21.5977L27 21.068Z" fill={isActive ? colorsDistribuidors[index % colorsDistribuidors.length] : DISABLED_DISTRIUDOR} />
                                            <path d="M32 32.0977H24C24 33.931 24.9 37.4977 28.5 37.0977C32.1 36.6977 32.3333 33.5977 32 32.0977Z" fill={isActive ? colorsDistribuidors[index % colorsDistribuidors.length] : DISABLED_DISTRIUDOR} />
                                            <path d="M14 32.5977H6C6 34.431 6.9 37.9977 10.5 37.5977C14.1 37.1977 14.3333 34.0977 14 32.5977Z" fill={isActive ? colorsDistribuidors[index % colorsDistribuidors.length] : DISABLED_DISTRIUDOR} />
                                            <path d="M12.5 1.11658C13.7569 1.84229 14.8025 2.88368 15.5332 4.13766C16.2639 5.39164 16.6545 6.81472 16.6662 8.26603C16.6779 9.71733 16.3104 11.1465 15.6 12.4122C14.8896 13.6778 13.861 14.7359 12.616 15.4818C11.371 16.2278 9.95281 16.6356 8.50175 16.665C7.05069 16.6943 5.61713 16.3442 4.34296 15.6493C3.0688 14.9543 1.99823 13.9387 1.23722 12.7028C0.476219 11.467 0.0511744 10.0538 0.00416676 8.60324L0 8.33324L0.00416676 8.06324C0.050836 6.62407 0.469623 5.22154 1.2197 3.9924C1.96978 2.76326 3.02554 1.74945 4.28408 1.04981C5.54261 0.350171 6.96096 -0.0114257 8.40084 0.000275205C9.84072 0.0119761 11.253 0.396575 12.5 1.11658ZM8.33333 3.33324C8.12922 3.33327 7.93222 3.40821 7.77969 3.54384C7.62716 3.67947 7.52971 3.86637 7.50583 4.06908L7.5 4.16658V8.33324L7.5075 8.44241C7.5265 8.58699 7.58311 8.72406 7.67167 8.83991L7.74417 8.92324L10.2442 11.4232L10.3225 11.4916C10.4686 11.605 10.6484 11.6665 10.8333 11.6665C11.0183 11.6665 11.198 11.605 11.3442 11.4916L11.4225 11.4224L11.4917 11.3441C11.6051 11.1979 11.6666 11.0182 11.6666 10.8332C11.6666 10.6483 11.6051 10.4686 11.4917 10.3224L11.4225 10.2441L9.16667 7.98741V4.16658L9.16083 4.06908C9.13695 3.86637 9.03951 3.67947 8.88698 3.54384C8.73445 3.40821 8.53745 3.33327 8.33333 3.33324Z" fill={isActive ? colorsDistribuidors[index % colorsDistribuidors.length] : DISABLED_DISTRIUDOR} />
                                        </svg>
                                        <span className="whitespace-nowrap text-sm">{d.fullName || "Sin nombre"}</span>
                                    </div>
                                }
                                )
                            }
                        </div>
                    }
                    search={(val: string) => setSearchTerm(val)}
                    onFilter={() => setShowFiltro(true)}
                    hasFilter={!!savedFilters && Object.keys(savedFilters).length > 0}
                ></FiltroPaginado>
                <div className="MapaClientes w-full flex-1 pb-10">
                    <LeafletMap onAdd={() => setSelectedOption(true)} clients={clients} latitude={latitude} longitude={longitude} setSelectedClient={setSelectedClient}
                        origin="/MonitoreoDistribuidores"
                        monitoring={monitoring.map(m =>
                            ({ color: colorsDistribuidors[distribuidores.findIndex(d => d._id === m._id) % colorsDistribuidors.length], user: m })
                        )} />
                    {/* <GoogleMaps apiKey={api} onAdd={() => setShowModal(true)} clients={filteredClients} /> */}
                </div>
            </div>

            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <FiltroClientesMapa
                    setShowFiltro={setShowFiltro}
                    distribuidores={distribuidores}
                    zones={zones}
                    onChange={handleFilterChange}
                    initialFilters={savedFilters}
                />
            </Modal>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Registrar Cliente
                </h2>
                <ClientForm zones={zones} isOpen={showModal} onCancel={() => setShowModal(false)} allClients={allClients} selectedClient={client} />
            </Modal>

            <Modal
                isOpen={selectedOption}
                onClose={() => {
                    setSelectedOption(false);
                }}
                className="w-3/12"
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    {/* Registrar Cliente */}
                </h2>
                <div className="p-6">
                    <OpcionesMap onClose={() => { setSelectedOption(false); }} />
                </div>
            </Modal>
        </>
    );
}

export { MonitoreoDistribuidores }