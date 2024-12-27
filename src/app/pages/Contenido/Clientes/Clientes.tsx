import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { FiltroPaginado, IFiltroPaginadoReference } from "../../components/FiltroPaginado/FiltroPaginado";
import { InfoCliente } from "./InfoCliente/InfoCliente";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { OpcionesClientes } from "./OpcionesClientes/OpcionesClientes";
import { ClientesContext, client } from "./ClientesContext";
import Modal from "../../EntryComponents/Modal";
import ClientForm from "../../EntryComponents/Client.form";
import FiltroClientes from "./FiltroClientes/FiltroClientes";
import { ClientsApiConector, ZonesApiConector } from "../../../../api/classes";
import { Client } from "../../../../type/Cliente/Client";
import { Zone } from "../../../../type/City";
import { useGlobalContext } from "../../../SmartwaterContext";
import { IClientGetParams } from "../../../../api/types/clients";
import { QueryMetadata } from "../../../../api/types/common";

const Clientes: FC = () => {
  const {
    showModal,
    setShowModal,
    showMiniModal,
    showFiltro,
    setShowFiltro,
    selectedClient,
    setShowMiniModal,
    setSelectedClient,
  } = useContext(ClientesContext);

  const { setLoading } = useGlobalContext()

  const [currentData, setCurrentData] = useState<Client[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  const itemsPerPage: number = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const [searchParamDebounced, setSearchParamDebounced] = useState<string>('');
  const [searchParam, setSearchParam] = useState<string>('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [savedFilters, setSavedFilters] = useState<IClientGetParams['filters']>({});

  const filterRef = useRef<IFiltroPaginadoReference>(null)

  useEffect(() => {
    const fetchZones = async () => {
      setZones((await ZonesApiConector.get({}))?.data || []);
    }
    fetchZones()
  }, [])

  const getClients = useCallback(async () => {
    setLoading(true)

    let datClients: { data: Client[] } & QueryMetadata | null
    if (searchParamDebounced && searchParamDebounced !== "") {
      if (savedFilters && Object.keys(savedFilters).length > 0) { setSavedFilters({}) }
      datClients = await ClientsApiConector.searchClients({ pagination: { page: currentPage, pageSize: itemsPerPage, sort }, filters: { text: searchParamDebounced } });
    } else {
      datClients = await ClientsApiConector.getClients({ pagination: { page: currentPage, pageSize: itemsPerPage, sort }, filters: savedFilters });
    }

    setCurrentData(datClients?.data || []);
    setTotalPage(Math.ceil((datClients?.metadata.totalCount || 0) / itemsPerPage)); // Update total pages
    setTotal(datClients?.metadata.totalCount || 0)
    setLoading(false)
  }, [currentPage, setLoading, savedFilters, sort, searchParamDebounced]);

  useEffect(() => {
    getClients();
  }, [getClients]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const orderClients = (orden: string) => {
    if (orden === "new") {
      setSort('desc')
    } else if (orden === "older") {
      setSort('asc')
    }
  };

  useEffect(() => {
    const getData = setTimeout(() => {
      setSearchParamDebounced(searchParam);
      setCurrentPage(1);
    }, 800);
    return () => clearTimeout(getData)
  }, [searchParam])

  const handleFilterChange = (filters: IClientGetParams['filters']) => {
    setCurrentPage(1);
    if (searchParamDebounced !== "") {
      setSearchParamDebounced("")
      setSearchParam("")
      console.log('calling clear search in Clientes')
      if (filterRef?.current) { filterRef.current.clearSearch() }
    }
    setSavedFilters(filters);
  };

  return (
    <div className="px-10">
      <PageTitle titulo="Clientes" icon="./clientes-icon.svg" />
      <FiltroPaginado
        ref={filterRef}
        add={true}
        exportar={true}
        typeDataToExport="clients"
        paginacion={true}
        totalPage={totalPage}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        onAdd={() => setShowModal(true)}
        resultados={true}
        filtro
        total={total}
        search={setSearchParam}
        orderArray={orderClients}
        onFilter={() => setShowFiltro(true)}
        hasFilter={!!savedFilters && Object.keys(savedFilters).length > 0}
      >
        {
          currentData.length > 0 &&
          <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
            {currentData.map((client: Client) => (
              <InfoCliente key={client._id} client={client} zones={zones} />
            ))}
          </div>
        }
        {
          currentData.length === 0 &&
          <div className="font-semibold text-xl min-h-[300px] flex items-center justify-center">
            Sin resultados
          </div>
        }
      </FiltroPaginado>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
          Registrar Cliente
        </h2>
        <ClientForm isOpen={showModal} onCancel={() => setShowModal(false)} />
      </Modal>

      <Modal
        isOpen={selectedClient._id !== "" && !showMiniModal}
        onClose={() => setSelectedClient(client)}
      >
        <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
          Editar Cliente
        </h2>
        <ClientForm
          isOpen={
            selectedClient._id !== "" && showMiniModal === false ? true : false
          }
          onCancel={() => setSelectedClient(client)}
        />
      </Modal>

      <Modal
        isOpen={selectedClient._id !== "" && showMiniModal ? true : false}
        onClose={() => {
          setSelectedClient(client);
          setShowMiniModal(false);
        }}
        className="w-3/12"
      >
        <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30">
          Opciones Cliente
        </h2>
        <div className="p-6">
          <OpcionesClientes
            onClose={() => {
              setSelectedClient(client);
              setShowMiniModal(false);
            }}
          />
        </div>
      </Modal>

      <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)} className="lg:!w-1/2 md:!w-3/4 !w-full">
        <FiltroClientes
          zones={zones}
          onChange={handleFilterChange}
          initialFilters={savedFilters}
        />
      </Modal>
    </div>
  );
};

export { Clientes };
