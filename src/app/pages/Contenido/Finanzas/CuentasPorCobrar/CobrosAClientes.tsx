import { useCallback, useContext, useEffect, useRef, useState } from "react";
import "./CuentasPorCobrar.css";
import { FiltroPaginado, IFiltroPaginadoReference } from "../../../components/FiltroPaginado/FiltroPaginado";
import { useGlobalContext } from "../../../../SmartwaterContext";
import { CuentasPorCobrarContext } from "./CuentasPorCobrarContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BillsApiConector, ClientsApiConector, UsersApiConector, ZonesApiConector } from "../../../../../api/classes";
import { IBillsGetParams } from "../../../../../api/types/bills";
import { Zone } from "../../../../../type/City";
import { User } from "../../../../../type/User";
import { QueryMetadata } from "../../../../../api/types/common";
import { Bills } from "../../../../../type/Bills";
import { CobrosClientes } from "./CuadroCuentasPorCobrar/CobrosClientes";
import { Client } from "../../../../../type/Cliente/Client";
import Modal from "../../../EntryComponents/Modal";
import FiltroCobros from "./FiltroCuentasPorCobrar/FiltroCobros";

interface Props {
  client?: string
}

const CobrosAClientes = ({ client }: Props) => {
  const navigate = useNavigate()

  const { showFiltro, setShowFiltro } = useContext(CuentasPorCobrarContext);

  const { setLoading } = useGlobalContext()
  const [currentData, setCurrentData] = useState<Array<Bills>>([]);
  const [summary, setSumary] = useState<Array<Bills>>([]);

  const [clients, setClients] = useState<Client[]>([]);
  const [distribuidores, setDistribuidores] = useState<User[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  const itemsPerPage: number = 12;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const [searchParam, setSearchParam] = useState<string>('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [savedFilters, setSavedFilters] = useState<IBillsGetParams['filters']>({});

  const filterRef = useRef<IFiltroPaginadoReference>(null)

  const [query, setQuery] = useSearchParams()
  const [queryData, setQueryData] = useState<IBillsGetParams & { text?: string, clients?: string[] } | null>(null)

  useEffect(() => {
    if (query && query.has('filters')) {
      const queryRes: IBillsGetParams & { text?: string, clients?: string[] } = JSON.parse(atob(query.get('filters')!))
      setQueryData(queryRes)

      if (queryRes.pagination) {
        setCurrentPage(queryRes.pagination.page)
        if (queryRes.pagination.sort) setSort(queryRes.pagination.sort)
      }

      if (queryRes.text) {
        filterRef.current?.setSearch(queryRes.text)
      } else {
        filterRef.current?.clearSearch()
      }

      if (queryRes.filters) {
        setSavedFilters(queryRes.filters)
      }
    } else {
      setQuery({ filters: btoa(JSON.stringify({ pagination: { page: 1, pageSize: itemsPerPage, sort: 'desc' } })) })
    }
  }, [query, setQuery])

  const getSales = useCallback(async () => {
    setLoading(true)

    const promises: Promise<{ data: Bills[] } & QueryMetadata | null>[] = []
    let filters: IBillsGetParams['filters'] = {}

    if (queryData) {
      filters = { ...queryData.filters }

      if (client) {
        promises.push(BillsApiConector.get({ pagination: queryData.pagination, filters: { ...filters, client } }))
      } else {
        if (queryData.clients) {
          queryData.clients.forEach(cf =>
            promises.push(BillsApiConector.get({ pagination: { page: 1, pageSize: 3000, sort: queryData.pagination?.sort }, filters: { ...filters, client: cf } }))
          )
        } else {
          promises.push(BillsApiConector.get({ pagination: queryData.pagination, filters: { ...filters } }))
        }
      }
    }

    const responses = await Promise.all(promises)
    const datSales: Bills[] = []
    let totalcount: number = 0
    responses.forEach(r => {
      datSales.push(...(r?.data || []))
      totalcount += r?.metadata.totalCount || 0
    })

    setCurrentData(datSales);
    setTotalPage(Math.ceil(totalcount / itemsPerPage)); // Update total pages
    setTotal(totalcount)
    setLoading(false)
  }, [setLoading, queryData, client]);

  const orderArray = (orden: string) => {
    if (orden === "new") {
      setSort('desc')
      setQuery({ filters: btoa(JSON.stringify({ ...queryData, pagination: { ...queryData?.pagination, sort: 'desc' } })) })
    } else if (orden === "older") {
      setSort('asc')
      setQuery({ filters: btoa(JSON.stringify({ ...queryData, pagination: { ...queryData?.pagination, sort: 'asc' } })) })
    }
  };

  useEffect(() => {
    const getData = setTimeout(async () => {
      if (searchParam && searchParam.trim() !== "") {
        if (!queryData?.text || queryData.text !== searchParam) {
          const clients = await ClientsApiConector.searchClients({ filters: { text: searchParam } })
          const clientsData = clients?.data || []
          if (clientsData.length > 0) {
            setQuery({ filters: btoa(JSON.stringify({ ...queryData, pagination: { ...queryData?.pagination, pageSize: itemsPerPage, page: 1 }, clients: clientsData.map(c => c._id), text: searchParam })) })
          } else {
            setQuery({ filters: btoa(JSON.stringify({ ...queryData, pagination: { ...queryData?.pagination, pageSize: itemsPerPage, page: 1 }, clients: [], text: searchParam })) })
          }
          setCurrentPage(1);
        }
      } else {
        if (!!queryData?.text) {
          setQuery({ filters: btoa(JSON.stringify({ ...queryData, pagination: { ...queryData?.pagination, pageSize: itemsPerPage, page: 1 }, clients: undefined, text: undefined })) })
        }
      }
    }, 800);
    return () => clearTimeout(getData)
  }, [searchParam])

  useEffect(() => {
    const fetchZones = async () => {
      setZones((await ZonesApiConector.get({}))?.data || []);
      setClients((await ClientsApiConector.getClients({ pagination: { page: 1, pageSize: 3000 } }))?.data || []);
      setDistribuidores((await UsersApiConector.get({ pagination: { page: 1, pageSize: 3000 }, filters: { role: 'user', desactivated: false } }))?.data || []);
    }
    fetchZones()
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setQuery({ filters: btoa(JSON.stringify({ ...queryData, pagination: { ...queryData?.pagination, page } })) })
  };

  useEffect(() => {
    getSales();
  }, [getSales]);

  const handleFilterChange = (filters: IBillsGetParams['filters']) => {
    setCurrentPage(1);
    setSavedFilters(filters);
    setQuery({ filters: btoa(JSON.stringify({ ...queryData, pagination: { ...queryData?.pagination, page: 1 }, filters })) })
  };

  useEffect(() => {
    const promises: Promise<{ data: Bills[] } & QueryMetadata | null>[] = []
    let filters: IBillsGetParams['filters'] = {}

    if (queryData) {
      filters = { ...queryData.filters }

      if (client) {
        promises.push(BillsApiConector.get({ pagination: { page: 1, pageSize: 3000 }, filters: { ...filters, client } }))
      } else {
        if (queryData.clients) {
          queryData.clients.forEach(cf =>
            promises.push(BillsApiConector.get({ pagination: { page: 1, pageSize: 3000 }, filters: { ...filters, client: cf } }))
          )
        } else {
          promises.push(BillsApiConector.get({ pagination: { page: 1, pageSize: 3000 }, filters: { ...filters } }))
        }
      }
    }

    Promise.all(promises).then(responses => {
      const datSales: Bills[] = []
      responses.forEach(r => {
        datSales.push(...(r?.data || []))
      })
      setSumary(datSales)
    })
  }, [queryData, client])

  return (
    <>
      <FiltroPaginado
        ref={filterRef}
        add={false}
        paginacion={totalPage > 1}
        totalPage={totalPage}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        resultados={true}
        filtro
        hasSearch={!client}
        total={total}
        search={setSearchParam}
        orderArray={orderArray}
        onFilter={() => setShowFiltro(true)}
        hasFilter={!!savedFilters && Object.keys(savedFilters).length > 0}
        searchPlaceholder="Buscar por nombre o teléfono de cliente"
        sorted={sort === 'asc' ? "older" : "new"}
        activeFilters={{ ...queryData?.filters, clients: queryData?.clients }}
        otherResults={[{
          text: "Total:",
          value: `${summary.reduce((cont, bill) => cont += bill.amount, 0).toLocaleString()} Bs`
        }]}
      >
        <div className="w-full pb-10 sticky top-0 bg-main-background z-[20]">
          <div className="w-full sm:w-1/2">
            <div className="switch-contenido">
              <div
                className={`switch-option`}
                onClick={() => {
                  if (!!client) {
                    navigate(`/Finanzas/CuentasPorCobrarCobros/Historial/${client}/VentaCredito`)
                  } else {
                    navigate("/Finanzas/CuentasPorCobrarCobros/Cuentas")
                  }
                }}
              >
                {!!client ? "Ventas al crédito" : "Cuentas por cobrar"}
              </div>
              <div
                className={`switch-option selected`}
                onClick={() => {
                  if (!!client) {
                    navigate(`/Finanzas/CuentasPorCobrarCobros/Historial/${client}/Cobros`)
                  } else {
                    navigate("/Finanzas/CuentasPorCobrarCobros/Cobros")
                  }
                }}
              >
                {!!client ? "Cobros" : "Cobros a clientes"}
              </div>
            </div>
          </div>
        </div>

        {
          currentData.length > 0 &&
          <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-4 pb-10 overflow-x-hidden">
            {currentData.map((bill: Bills) => (
              <CobrosClientes bill={bill} client={clients.find(c => c._id === bill.client)} />
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


      <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
        <FiltroCobros
          zones={zones}
          distribuidores={distribuidores}
          onChange={handleFilterChange}
          initialFilters={savedFilters}
          isHistory={!!client}
        />
      </Modal>
    </>
  );
};

export { CobrosAClientes };
