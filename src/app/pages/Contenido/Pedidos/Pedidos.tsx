import { FiltroPaginado, IFiltroPaginadoReference } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./Pedidos.css";
import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { PedidosContext } from "./PedidosContext";
import { OpcionesPedidos } from "./CuadroPedidos/OpcionesPedidos/OpcionesPedidos";
import { useGlobalContext } from "../../../SmartwaterContext";
import { FiltroPedidos } from "./FiltroPedidos/FiltroPedidos";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Order } from "../../../../type/Order/Order";
import Product from "../../../../type/Products/Products";
import { Zone } from "../../../../type/City";
import { IOrdersGetParams } from "../../../../api/types/orders";
import { QueryMetadata } from "../../../../api/types/common";
import { ClientsApiConector, OrdersApiConector, ProductsApiConector, UsersApiConector, ZonesApiConector } from "../../../../api/classes";
import { CuadroPedido } from "./CuadroPedidos/CuadroPedido";
import Modal from "../../EntryComponents/Modal";
import { client } from "../Clientes/ClientesContext";
import { User } from "../../../../type/User";
import RegistrarClientePedido from "./RegistrarCliente/RegistrarClientePedido";
import moment from "moment";
import { Client } from "../../../../type/Cliente/Client";

const Pedidos: FC = () => {
  const params = useParams()
  const navigate = useNavigate();

  const { section } = params

  const { showFiltro, setShowFiltro, showModal, setShowModal, setSelectedClient, selectedClient, showMiniModal, setShowMiniModal, selectedOrder } = useContext(PedidosContext);
  const { setLoading } = useGlobalContext();

  const [currentData, setCurrentData] = useState<Array<Order>>([]);

  const [products, setProducts] = useState<Product[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [dists, setDists] = useState<User[]>([]);
  const [allClients, setAllClients] = useState<Client[]>([]);

  const itemsPerPage: number = 12;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const [searchParam, setSearchParam] = useState<string>('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [savedFilters, setSavedFilters] = useState<IOrdersGetParams['filters']>({});

  const filterRef = useRef<IFiltroPaginadoReference>(null)
  const [query, setQuery] = useSearchParams()
  const [queryData, setQueryData] = useState<IOrdersGetParams & { text?: string, clients?: string[] } | null>(null)

  useEffect(() => {
    if (query && query.has('filters')) {
      const queryRes: IOrdersGetParams & { text?: string, clients?: string[] } = JSON.parse(atob(query.get('filters')!))
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
    if (section) {
      setLoading(true)

      const promises: Promise<{ data: Order[] } & QueryMetadata | null>[] = []

      let filters: IOrdersGetParams['filters'] = {}

      if (queryData) {
        filters = { ...queryData.filters }

        if (section === "Atendidos") {
          if (!filters.attendedDate && (!filters.initialDate && !filters.finalDate && !filters.distributorAttendedId)) {
            filters.attendedDate = moment().format("YYYY-MM-DD")
          }
          filters.attended = true

          if (!filters.initialDate) {
            filters.initialDate = "2020-01-01"
          }
          if (!filters.finalDate) {
            filters.finalDate = moment().format("YYYY-MM-DD")
          }
        } else {
          filters.attended = false
        }

        if (queryData.clients) {
          queryData.clients.forEach(cf =>
            promises.push(OrdersApiConector.get({ pagination: { page: 1, pageSize: 30000, sort: queryData.pagination?.sort }, filters: { ...filters, client: cf } }))
          )
        } else {
          promises.push(OrdersApiConector.get({ pagination: queryData.pagination, filters }))
        }
      }

      const responses = await Promise.all(promises)
      const datSales: Order[] = []
      let totalcount: number = 0
      responses.forEach(r => {
        datSales.push(...(r?.data || []))
        totalcount += r?.metadata.totalCount || 0
      })

      setCurrentData(datSales);
      setTotalPage(Math.ceil(totalcount / itemsPerPage)); // Update total pages
      setTotal(totalcount)
      setLoading(false)
    } else {
      setCurrentData([]);
      setTotalPage(0); // Update total pages
      setTotal(0)
    }
  }, [queryData, setLoading, section]);

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
      setAllClients((await ClientsApiConector.getClients({ pagination: { page: 1, pageSize: 30000 } }))?.data || []);
      setZones((await ZonesApiConector.get({}))?.data || []);
      setProducts((await ProductsApiConector.get({ pagination: { page: 1, pageSize: 30000 } }))?.data || []);
      setDists((await UsersApiConector.get({ pagination: { page: 1, pageSize: 30000 }, filters: { desactivated: false } }))?.data || []);
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

  const handleFilterChange = (filters: IOrdersGetParams['filters']) => {
    setCurrentPage(1);
    setSavedFilters(filters);
    setQuery({ filters: btoa(JSON.stringify({ ...queryData, pagination: { ...queryData?.pagination, page: 1 }, filters })) })
  };

  if (!section) { return null }

  return (
    <>
      <div className="px-10">
        <PageTitle titulo="Pedidos" icon="/Pedidos-icon.svg" />
        <FiltroPaginado
          ref={filterRef}
          add={false}
          paginacion={totalPage > 1}
          totalPage={totalPage}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          resultados={true}
          filtro
          total={total}
          search={setSearchParam}
          orderArray={orderArray}
          onFilter={() => setShowFiltro(true)}
          hasFilter={!!savedFilters && Object.keys(savedFilters).length > 0}
          searchPlaceholder="Buscar por nombre o teléfono de cliente"
          sorted={sort === 'asc' ? "older" : "new"}
        >
          <div className="w-full pb-10 sticky top-0 bg-main-background z-[40]">
            <div className="w-full sm:w-1/2">
              <div className="switch-contenido">
                <div
                  className={`switch-option ${params.section === "EnCurso" ? "selected" : ""}`}
                  onClick={() => {
                    setSavedFilters({});
                    filterRef.current?.clearSearch()
                    setSearchParam("")
                    navigate("/Pedidos/EnCurso")
                  }}
                >
                  En curso
                </div>
                <div
                  className={`switch-option ${params.section === "Atendidos" ? "selected" : ""}`}
                  onClick={() => {
                    setSavedFilters({});
                    filterRef.current?.clearSearch()
                    setSearchParam("")
                    navigate("/Pedidos/Atendidos")
                  }}
                >
                  Atendidos
                </div>
              </div>
            </div>
          </div>

          <div className="w-full">
            {

              currentData.length > 0 &&
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
                {
                  currentData.map(p => <CuadroPedido key={p._id} order={p} products={products} zones={zones} />)
                }
              </div>
            }
            {
              currentData.length === 0 &&
              <div className="font-semibold text-xl min-h-[300px] flex items-center justify-center">
                Sin resultados
              </div>
            }
          </div>
        </FiltroPaginado>
      </div>

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
          <OpcionesPedidos onClose={() => {
            setShowModal(false);
            setSelectedClient(client);
          }}
            isNoRegisteredClient={!selectedClient.isClient}
          />
        </div>
      </Modal >

      <Modal
        isOpen={showMiniModal && selectedClient._id !== ""}
        onClose={() => {
          setSelectedClient(client);
          setShowMiniModal(false);
        }}
        className="w-3/12"
      >
        <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
          Registrar Cliente
        </h2>
        <div className="p-6">
          <RegistrarClientePedido onCancel={() => {
            setShowMiniModal(false);
            setSelectedClient(client);
          }}
            allClients={allClients}
            isOpen={showMiniModal && selectedClient._id !== ""}
            zones={zones}
            selectedClient={selectedClient}
            associatedOrder={selectedOrder._id}
          />
        </div>
      </Modal >

      <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
        <FiltroPedidos isAttended={(!!section && section === "Atendidos")}
          initialFilters={savedFilters} zones={zones} distribuidores={dists}
          onChange={handleFilterChange} />
      </Modal>
    </>
  );
};

export { Pedidos };
