import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { FiltroPaginado, IFiltroPaginadoReference } from "../../components/FiltroPaginado/FiltroPaginado";
import { InfoCliente } from "./InfoCliente/InfoCliente";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { OpcionesClientes } from "./OpcionesClientes/OpcionesClientes";
import { ClientesContext, client } from "./ClientesContext";
import Modal from "../../EntryComponents/Modal";
import ClientForm from "../../EntryComponents/Client.form";
import FiltroClientes from "./FiltroClientes/FiltroClientes";
import { ClientsApiConector, UsersApiConector, ZonesApiConector } from "../../../../api/classes";
import { Client } from "../../../../type/Cliente/Client";
import { Zone } from "../../../../type/City";
import { useGlobalContext } from "../../../SmartwaterContext";
import { IClientGetParams, ISearchGetParams } from "../../../../api/types/clients";
import { QueryMetadata } from "../../../../api/types/common";
import { useSearchParams } from "react-router-dom";
import { User } from "../../../../type/User";

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
  const [distribuidores, setDistribuidores] = useState<User[]>([]);

  const itemsPerPage: number = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const [searchParamDebounced, setSearchParamDebounced] = useState<string>('');
  const [searchParam, setSearchParam] = useState<string>('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [savedFilters, setSavedFilters] = useState<IClientGetParams['filters']>({});

  const filterRef = useRef<IFiltroPaginadoReference>(null)

  const [query, setQuery] = useSearchParams()
  const [queryData, setQueryData] = useState<IClientGetParams | ISearchGetParams | null>(null)

  useEffect(() => {
    if (query && query.has('filters')) {
      const queryRes: IClientGetParams = JSON.parse(atob(query.get('filters')!))
      setQueryData(queryRes)

      if (queryRes.pagination) {
        setCurrentPage(queryRes.pagination.page)
        if (queryRes.pagination.sort) setSort(queryRes.pagination.sort)
      }

      if (queryRes.filters) {
        if (queryRes.filters.hasOwnProperty('text')) {
          filterRef.current?.setSearch((queryRes.filters as any).text)
        } else {
          filterRef.current?.clearSearch()
          setSavedFilters(queryRes.filters)
        }
      }
    } else {
      setQuery({ filters: btoa(JSON.stringify({ pagination: { page: 1, pageSize: itemsPerPage, sort: 'desc' } })) })
    }
  }, [query, setQuery])

  useEffect(() => {
    const fetchZones = async () => {
      setZones((await ZonesApiConector.get({}))?.data || []);
      setDistribuidores((await UsersApiConector.get({ pagination: { page: 1, pageSize: 3000 }, filters: { role: 'user', desactivated: false } }))?.data || []);
    }
    fetchZones()
  }, [])

  const getClients = useCallback(async () => {
    setLoading(true)

    let datClients: { data: Client[] } & QueryMetadata | null = null
    if (queryData) {
      if (queryData?.filters?.hasOwnProperty('text')) {
        datClients = await ClientsApiConector.searchClients(queryData as ISearchGetParams);
      } else {
        datClients = await ClientsApiConector.getClients(queryData as IClientGetParams);
      }
    }

    setCurrentData(datClients?.data || []);
    setTotalPage(Math.ceil((datClients?.metadata.totalCount || 0) / itemsPerPage)); // Update total pages
    setTotal(datClients?.metadata.totalCount || 0)
    setLoading(false)
  }, [setLoading, queryData]);

  useEffect(() => {
    getClients();
  }, [getClients]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setQuery({ filters: btoa(JSON.stringify({ ...queryData, pagination: { ...queryData?.pagination, page } })) })
  };

  const orderClients = (orden: string) => {
    if (orden === "new") {
      setSort('desc')
      setQuery({ filters: btoa(JSON.stringify({ ...queryData, pagination: { ...queryData?.pagination, sort: 'desc' } })) })
    } else if (orden === "older") {
      setSort('asc')
      setQuery({ filters: btoa(JSON.stringify({ ...queryData, pagination: { ...queryData?.pagination, sort: 'asc' } })) })
    }
  };

  useEffect(() => {
    const getData = setTimeout(() => {
      if (searchParam && searchParam !== "") {
        if (!(queryData?.filters as any)?.text || (queryData?.filters as any)?.text !== searchParam) {
          setSavedFilters({})
          setSearchParamDebounced(searchParam);
          setCurrentPage(1);
          setQuery({ filters: btoa(JSON.stringify({ pagination: { ...queryData?.pagination, pageSize: itemsPerPage, page: 1 }, filters: { text: searchParam } })) })
        }
      } else {
        if ((!savedFilters || Object.keys(savedFilters).length === 0) && (!!(queryData?.filters as any)?.text)) {
          setSearchParamDebounced("");
          setCurrentPage(1);
          setQuery({ filters: btoa(JSON.stringify({ pagination: { ...queryData?.pagination, pageSize: itemsPerPage, page: 1 } })) })
        }
      }
    }, 800);
    return () => clearTimeout(getData)
  }, [searchParam])

  const handleFilterChange = (filters: IClientGetParams['filters']) => {
    setCurrentPage(1);
    if (searchParamDebounced !== "") {
      setSearchParamDebounced("")
      setSearchParam("")
      if (filterRef?.current) { filterRef.current.clearSearch() }
    }
    setQuery({ filters: btoa(JSON.stringify({ pagination: { ...queryData?.pagination, page: 1 }, filters })) })
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
        paginacion={totalPage > 1}
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
        searchPlaceholder="Buscar clientes por nombre o teléfono"
        sorted={sort === 'asc' ? "older" : "new"}
        activeFilters={queryData?.filters}
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
        <ClientForm zones={zones} isOpen={showModal} onCancel={() => setShowModal(false)} />
      </Modal>

      <Modal
        isOpen={selectedClient._id !== "" && !showMiniModal}
        onClose={() => setSelectedClient(client)}
      >
        <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
          Editar Cliente
        </h2>
        <ClientForm zones={zones}
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

      <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
        <FiltroClientes
          distribuidores={distribuidores}
          zones={zones}
          onChange={handleFilterChange}
          initialFilters={savedFilters}
        />
      </Modal>
    </div>
  );
};

export { Clientes };
