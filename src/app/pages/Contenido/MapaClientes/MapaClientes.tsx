import React, { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./MapaClientes.css";
import { MapaClientesContext } from "./MapaClientesContext";
import GoogleMaps from "../../components/GoogleMaps/GoogleMaps";
import { Client } from "../../../../type/Cliente/Client";
import { ClientsApiConector, UsersApiConector, ZonesApiConector } from "../../../../api/classes";
import { IClientGetParams } from "../../../../api/types/clients";
import Modal from "../../EntryComponents/Modal";
import FiltroClientes from "../Clientes/FiltroClientes/FiltroClientes";
import { User } from "../../../../type/User";
import { Zone } from "../../../../type/City";
import { useDebounce } from "@uidotdev/usehooks";
import moment from "moment";
import ClientForm from "../../EntryComponents/Client.form";
import { client } from "../Clientes/ClientesContext";

const MapaClientes: React.FC = () => {
  const { showFiltro, setShowFiltro, showModal, setShowModal } = useContext(MapaClientesContext);
  const api: string = process.env.REACT_APP_API_GOOGLE!;

  const [clients, setClients] = useState<Client[]>([]);

  const [distribuidores, setDistribuidores] = useState<User[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);

  const [savedFilters, setSavedFilters] = useState<IClientGetParams['filters']>({});

  const fetchClients = useCallback(async () => {
    try {
      const filters = { ...savedFilters }

      if (!!filters?.initialDate && !filters?.finalDate) {
        filters.finalDate = moment().format("YYYY-MM-DD")
      }
      if (!filters?.initialDate && !!filters?.finalDate) {
        filters.initialDate = "2020-01-01"
      }

      const clientsData = await ClientsApiConector.getClients({ pagination: { page: 1, pageSize: 30000 }, filters });
      setClients(clientsData?.data || []);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  }, [savedFilters]);

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

  const handleFilterChange = (filters: IClientGetParams['filters']) => {
    setSavedFilters(filters);
  };

  const [searchTerm, setSearchTerm] = useState<string>("")
  const searchParam = useDebounce<string>(searchTerm, 800)
  const filteredClients = useMemo<Client[]>(() => {
    if (searchParam) {
      return clients.filter(
        (client) =>
          client.fullName?.toLowerCase().includes(searchParam?.toLowerCase()) ||
          client.phoneNumber?.includes(searchParam)
      );
    } else {
      return clients
    }
  }, [clients, searchParam])

  return (
    <>
      <div className="px-10 overflow-auto h-screen flex justify-between flex-col">
        <PageTitle titulo="Mapa de clientes" icon="./ubicacion-icon.svg" />
        <FiltroPaginado
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
          <GoogleMaps apiKey={api} onAdd={() => setShowModal(true)} clients={filteredClients} />
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
