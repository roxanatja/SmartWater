import { FiltroPaginado, IFiltroPaginadoReference } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./Pedidos.css";
import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { PedidosContext } from "./PedidosContext";
import { OpcionesPedidos } from "./CuadroPedidos/OpcionesPedidos/OpcionesPedidos";
import { useGlobalContext } from "../../../SmartwaterContext";
import { FiltroPedidos } from "./FiltroPedidos/FiltroPedidos";
import { useNavigate, useParams } from "react-router-dom";
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

const Pedidos: FC = () => {
  const params = useParams()
  const navigate = useNavigate();

  const { section } = params

  const { showFiltro, setShowFiltro, showModal, setShowModal, setSelectedClient, selectedClient } = useContext(PedidosContext);
  const { setLoading } = useGlobalContext();

  const [currentData, setCurrentData] = useState<Array<Order>>([]);

  const [products, setProducts] = useState<Product[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [dists, setDists] = useState<User[]>([]);

  const itemsPerPage: number = 12;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const [clientsFilter, setClientsFilter] = useState<string[] | null>(null);
  const [searchParam, setSearchParam] = useState<string>('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [savedFilters, setSavedFilters] = useState<IOrdersGetParams['filters']>({});

  const filterRef = useRef<IFiltroPaginadoReference>(null)

  const getSales = useCallback(async () => {
    if (section) {
      setLoading(true)

      const promises: Promise<{ data: Order[] } & QueryMetadata | null>[] = []

      const filters = { ...savedFilters }

      if (section === "Atendidos") {
        if (!filters.attendedDate) {
          filters.attendedDate = (new Date()).toISOString()
        }
        if (filters.hasOwnProperty('attended')) {
          delete filters.attended
        }
      } else {
        filters.attended = false
      }

      if (clientsFilter) {
        clientsFilter.forEach(cf =>
          promises.push(OrdersApiConector.get({ pagination: { page: 1, pageSize: 3000, sort }, filters: { ...filters, client: cf } }))
        )
      } else {
        promises.push(OrdersApiConector.get({ pagination: { page: currentPage, pageSize: itemsPerPage, sort }, filters }))
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
  }, [currentPage, setLoading, savedFilters, sort, clientsFilter, section]);

  const orderArray = (orden: string) => {
    if (orden === "new") {
      setSort('desc')
    } else if (orden === "older") {
      setSort('asc')
    }
  };

  useEffect(() => {
    const getData = setTimeout(async () => {
      if (searchParam && searchParam.trim() !== "") {
        const clients = await ClientsApiConector.searchClients({ filters: { text: searchParam } })
        const clientsData = clients?.data || []
        if (clientsData.length > 0) {
          setClientsFilter(clientsData.map(c => c._id))
        } else {
          setClientsFilter([])
        }
        setCurrentPage(1);
      } else {
        setClientsFilter(null)
      }
    }, 800);
    return () => clearTimeout(getData)
  }, [searchParam])

  useEffect(() => {
    const fetchZones = async () => {
      setZones((await ZonesApiConector.get({}))?.data || []);
      setProducts((await ProductsApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || []);
      setDists((await UsersApiConector.get({ pagination: { page: 1, pageSize: 3000 }, filters: { role: "user", desactivated: false } }))?.data || []);
    }
    fetchZones()
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getSales();
  }, [getSales]);

  const handleFilterChange = (filters: IOrdersGetParams['filters']) => {
    setCurrentPage(1);
    setSavedFilters(filters);
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
          }} />
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
