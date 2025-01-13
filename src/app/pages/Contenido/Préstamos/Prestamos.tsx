import { CuadroPrestamo } from "./CuadroPrestamo/CuadroPrestamo";
import { OpcionesPrestamo } from "./CuadroPrestamo/OpcionesPrestamo";
import { FiltroPaginado, IFiltroPaginadoReference } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./Prestamos.css";
import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { PrestamosContext } from "./PrestamosContext";
import { LoanConsolidated, Loans } from "../../../../type/Loans/Loans";
import Modal from "../../EntryComponents/Modal";
import { useGlobalContext } from "../../../SmartwaterContext";
import { ILoansGetParams } from "../../../../api/types/loans";
import { ClientsApiConector, ItemsApiConector, LoansApiConector, UsersApiConector, ZonesApiConector } from "../../../../api/classes";
import { QueryMetadata } from "../../../../api/types/common";
import FiltroPrestamos from "./FiltroPrestamos/FiltroPrestamos";
import { client } from "../Clientes/ClientesContext";
import { Zone } from "../../../../type/City";
import { User } from "../../../../type/User";
import { Item } from "../../../../type/Item";
import millify from "millify";
import { useSearchParams } from "react-router-dom";

const Prestamos: FC = () => {
  const { showFiltro, setShowFiltro, setShowModal, showModal, selectedClient, setSelectedClient } = useContext(PrestamosContext);
  const { setLoading } = useGlobalContext()

  const [currentData, setCurrentData] = useState<Loans[]>([]);
  const [products, setProducts] = useState<Array<Item>>([]);
  const [zones, setZones] = useState<Array<Zone>>([]);
  const [distribuidores, setDistribuidores] = useState<Array<User>>([]);
  const [summary, setSummary] = useState<Array<LoanConsolidated>>([]);

  const itemsPerPage: number = 12;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const [searchParam, setSearchParam] = useState<string>('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [savedFilters, setSavedFilters] = useState<ILoansGetParams['filters']>({});

  const filterRef = useRef<IFiltroPaginadoReference>(null)
  const [query, setQuery] = useSearchParams()
  const [queryData, setQueryData] = useState<ILoansGetParams & { text?: string, clients?: string[] } | null>(null)

  useEffect(() => {
    if (query && query.has('filters')) {
      const queryRes: ILoansGetParams & { text?: string, clients?: string[] } = JSON.parse(atob(query.get('filters')!))
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

    const promises: Promise<{ data: Loans[] } & QueryMetadata | null>[] = []

    let filters: ILoansGetParams['filters'] = {}

    if (queryData) {
      filters = { ...queryData.filters }

      if (queryData.clients) {
        queryData.clients.forEach(cf =>
          promises.push(LoansApiConector.get({ pagination: { page: 1, pageSize: 3000, sort: queryData.pagination?.sort }, filters: { ...filters, client: cf } }))
        )
      } else {
        promises.push(LoansApiConector.get({ pagination: queryData.pagination, filters: filters }))
      }
    }

    const responses = await Promise.all(promises)
    const datLoans: Loans[] = []
    let totalcount: number = 0
    responses.forEach(r => {
      datLoans.push(...(r?.data || []))
      totalcount += r?.metadata.totalCount || 0
    })

    setCurrentData(datLoans);
    setTotalPage(Math.ceil(totalcount / itemsPerPage)); // Update total pages
    setTotal(totalcount)
    setLoading(false)
  }, [queryData, setLoading]);

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
    LoansApiConector.getConsolidated({}).then(res => setSummary(res || []))
  }, [])

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
      setProducts((await ItemsApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || []);
      setZones((await ZonesApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || []);
      setDistribuidores((await UsersApiConector.get({ pagination: { page: 1, pageSize: 3000 }, filters: { role: "user", desactivated: false } }))?.data || []);
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

  const handleFilterChange = (filters: ILoansGetParams['filters']) => {
    setCurrentPage(1);
    setSavedFilters(filters);
    setQuery({ filters: btoa(JSON.stringify({ ...queryData, pagination: { ...queryData?.pagination, page: 1 }, filters })) })
  };

  const getContractState = (
    hasContract: boolean,
    hasExpiredContract: boolean
  ) => {
    if (hasExpiredContract === true) {
      return "Contrato Vencido";
    } else if (hasContract === true) {
      return "Con Contrato";
    } else {
      return "Sin Contrato";
    }
  };

  return (
    <>
      <div className="px-10">
        <PageTitle titulo="Préstamos" icon="./Prestamos-icon.svg" />
        <FiltroPaginado
          ref={filterRef}
          paginacion={totalPage > 1}
          totalPage={totalPage}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          resultados
          filtro
          total={total}
          search={setSearchParam}
          orderArray={orderArray}
          onFilter={() => setShowFiltro(true)}
          hasFilter={!!savedFilters && Object.keys(savedFilters).length > 0}
          searchPlaceholder="Buscar por nombre de cliente"
          infoPedidos
          infoPedidosData={summary.filter(s => s.quantity > 0).map(s => ({ text: s.itenName, value: s.quantity > 9999 ? millify(s.quantity, { precision: 2 }) : `${s.quantity}` }))}
          sorted={sort === 'asc' ? "older" : "new"}
        >
          {
            currentData.length > 0 &&
            <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-4 pb-10 overflow-x-hidden">
              {currentData.map((loan: Loans) => {
                const contratcEstate = getContractState(
                  loan.hasContract,
                  loan.hasExpiredContract
                );

                return <CuadroPrestamo
                  key={loan._id}
                  loan={loan}
                  productos={products}
                  estadoContrato={contratcEstate}
                />
              })}
            </div>
          }
          {
            currentData.length === 0 &&
            <div className="font-semibold text-xl min-h-[300px] flex items-center justify-center">
              Sin resultados
            </div>
          }
        </FiltroPaginado>
      </div>
      <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
        <FiltroPrestamos
          distribuidores={distribuidores}
          zones={zones}
          onChange={handleFilterChange}
          initialFilters={savedFilters}
        />
      </Modal>


      <Modal
        isOpen={showModal && selectedClient._id !== ""}
        onClose={() => {
          setSelectedClient(client);
          setShowModal(false);
        }}
        className="w-3/12"
      >
        <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30">
          Opciones Cliente
        </h2>
        <div className="p-6">
          <OpcionesPrestamo onClose={() => {
            setShowModal(false);
            setSelectedClient(client);
          }} />
        </div>
      </Modal >
    </>
  );
};

export { Prestamos };
