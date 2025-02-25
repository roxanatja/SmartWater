import React, { useState, useContext, useEffect, useCallback, useRef } from "react";
import { FiltroPaginado, IFiltroPaginadoReference } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./MapaClientes.css";
import { MapaClientesContext } from "./MapaClientesContext";
import { Client } from "../../../../type/Cliente/Client";
import { ClientsApiConector, LoansApiConector, OrdersApiConector, UsersApiConector, ZonesApiConector } from "../../../../api/classes";
import { IClientGetParams } from "../../../../api/types/clients";
import Modal from "../../EntryComponents/Modal";
import { User } from "../../../../type/User";
import { Zone } from "../../../../type/City";
import { useDebounce } from "@uidotdev/usehooks";
import moment from "moment";
import ClientForm from "../../EntryComponents/Client.form";
import { client } from "../Clientes/ClientesContext";
import LeafletMap from "../../components/LeafletMap/LeafletMap";
import { useSearchParams } from "react-router-dom";
import { useGlobalContext } from "../../../SmartwaterContext";
import { Order } from "../../../../type/Order/Order";
import { ClientStatus } from "../../components/LeafletMap/constants";
import FiltroClientesMapa from "./FiltroClientesMapa/FiltroClientesMapa";
import { OpcionesMap } from "./OpcionesMap/OpcionesMap";

const MapaClientes: React.FC = () => {
  const { showFiltro, setShowFiltro, showModal, setShowModal, selectedOption, setSelectedOption, zones, setZones, allClients, setAllClients, setSelectedClient } = useContext(MapaClientesContext);
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
        <PageTitle titulo="Mapa de clientes" icon="./ubicacion-icon.svg" />
        <FiltroPaginado
          ref={filterRef}
          noContent
          filtro
          paginacion={false}
          exportar={false}
          iconUbicacion
          iconUbicacionInject={
            <div
              style={{
                display: "flex",
                gap: "35px",
                marginBottom: "25px",
                marginTop: "10px",
              }}
            >
              <div className="Mapaclientes-ubicacion">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="30"
                  viewBox="0 0 31 47"
                  fill="#DD0000"
                >
                  <path d="M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z" />
                </svg>
                <span>Pedidos en curso</span>
              </div>
              <div className="Mapaclientes-ubicacion">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="30"
                  viewBox="0 0 31 47"
                  fill="#FF5C00"
                >
                  <path d="M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z" />
                </svg>
                <span>Clientes deben renovar</span>
              </div>
              <div className="Mapaclientes-ubicacion">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="30"
                  viewBox="0 0 31 47"
                  fill="#960090"
                >
                  <path d="M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z" />
                </svg>
                <span>Resto de clientes</span>
              </div>
              <div className="Mapaclientes-ubicacion">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="30"
                  viewBox="0 0 31 47"
                  fill="#1FAF38"
                >
                  <path d="M31 15.3918C31 23.8925 23.1159 33.807 15.5 47C6.78557 33.807 0 23.8925 0 15.3918C0 6.89115 6.93959 0 15.5 0C24.0604 0 31 6.89115 31 15.3918Z" />
                </svg>
                <span>Pedidos atendidos</span>
              </div>
            </div>
          }
          search={(val: string) => setSearchTerm(val)}
          onFilter={() => setShowFiltro(true)}
          hasFilter={!!savedFilters && Object.keys(savedFilters).length > 0}
        ></FiltroPaginado>
        <div className="MapaClientes w-full flex-1 pb-10">
          <LeafletMap onAdd={() => setSelectedOption(true)} clients={clients} latitude={latitude} longitude={longitude} setSelectedClient={setSelectedClient} />
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
};

export { MapaClientes };
