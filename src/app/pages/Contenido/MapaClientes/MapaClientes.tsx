import React, { useState, useContext, useEffect, useCallback, useRef } from "react";
import { FiltroPaginado, IFiltroPaginadoReference } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./MapaClientes.css";
import { MapaClientesContext } from "./MapaClientesContext";
import { Client } from "../../../../type/Cliente/Client";
import { ClientsApiConector, OrdersApiConector, UsersApiConector, ZonesApiConector } from "../../../../api/classes";
import { IClientGetParams } from "../../../../api/types/clients";
import Modal from "../../EntryComponents/Modal";
import FiltroClientes from "../Clientes/FiltroClientes/FiltroClientes";
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

const MapaClientes: React.FC = () => {
  const { showFiltro, setShowFiltro, showModal, setShowModal } = useContext(MapaClientesContext);
  const { setLoading } = useGlobalContext()

  const [clients, setClients] = useState<Client[]>([]);
  const [passedThis, setPassedThis] = useState<boolean>(false);

  const [distribuidores, setDistribuidores] = useState<User[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);

  const filterRef = useRef<IFiltroPaginadoReference>(null)
  const [savedFilters, setSavedFilters] = useState<IClientGetParams['filters']>({});
  const [query, setQuery] = useSearchParams()
  const [queryData, setQueryData] = useState<IClientGetParams & { text?: string } | null>(null)

  useEffect(() => {
    if (query.has('filters')) {
      const queryRes: IClientGetParams & { text?: string } = JSON.parse(atob(query.get('filters')!))
      setQueryData(queryRes)

      if (queryRes.filters) {
        if (queryRes.text) {
          filterRef.current?.setSearch(queryRes.text)
        } else {
          filterRef.current?.clearSearch()
        }

        if (queryRes.filters) {
          setSavedFilters(queryRes.filters)
        }
      }
    } else {
      setQuery({ filters: btoa(JSON.stringify({ filters: {} })) })
    }
    setPassedThis(true)
  }, [query, setQuery])

  const fetchClients = useCallback(async () => {
    if (passedThis) {
      setLoading(true)

      const qd = { ...queryData }
      const extraFilters: IClientGetParams['filters'] = {}

      if (!!qd.filters?.initialDate && !qd.filters?.finalDate) {
        extraFilters.finalDate = moment().format("YYYY-MM-DD")
      }
      if (!qd.filters?.initialDate && !!qd.filters?.finalDate) {
        extraFilters.initialDate = "2020-01-01"
      }

      const clientsData = await ClientsApiConector.getClients({ pagination: { page: 1, pageSize: 30000 }, filters: { ...qd.filters, ...extraFilters } });

      if (qd.text) {
        setClients(
          (clientsData?.data || []).filter(
            (client) =>
              client.fullName?.toLowerCase().includes(qd.text!.toLowerCase()) ||
              client.phoneNumber?.includes(qd.text!)
          )
        );
      } else {
        setClients(clientsData?.data || []);
      }

      setLoading(false)
    }
  }, [queryData, setLoading]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    const fetchZones = async () => {
      setZones((await ZonesApiConector.get({}))?.data || []);
      setAllClients((await ClientsApiConector.getClients({ pagination: { page: 1, pageSize: 30000 } }))?.data || []);
      setDistribuidores((await UsersApiConector.get({ pagination: { page: 1, pageSize: 30000, sort: 'desc' }, filters: { desactivated: false } }))?.data || []);
      setOrders((await OrdersApiConector.get({ pagination: { page: 1, pageSize: 30000 } }))?.data || []);
    }
    fetchZones()
  }, [])

  const handleFilterChange = (filters: IClientGetParams['filters']) => {
    setQuery({ filters: btoa(JSON.stringify({ filters, text: queryData?.text })) })
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
          search={(val: string) => setSearchTerm(val)}
          onFilter={() => setShowFiltro(true)}
          hasFilter={!!savedFilters && Object.keys(savedFilters).length > 0}
        ></FiltroPaginado>
        <div className="MapaClientes w-full flex-1 pb-10">
          <LeafletMap onAdd={() => setShowModal(true)} clients={clients} orders={orders} />
          {/* <GoogleMaps apiKey={api} onAdd={() => setShowModal(true)} clients={filteredClients} /> */}
        </div>
      </div>

      <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
        <FiltroClientes
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
    </>
  );
};

export { MapaClientes };
