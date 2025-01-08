import { CuadroVentaCliente } from "./CuadroVentaCliente/CuadroVentaCliente";
import { FiltroPaginado, IFiltroPaginadoReference } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { OpcionesVentas } from "./OpcionesVentas/OpcionesVentas";
import "./Ventas.css";
import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { VentasContext } from "./VentasContext";
import FiltroVenta from "./FiltroVenta/FiltroVenta";
import { Sale, SaleProduct } from "../../../../type/Sale/Sale";
import Modal from "../../EntryComponents/Modal";
import { client } from "../Clientes/ClientesContext";
import { useGlobalContext } from "../../../SmartwaterContext";
import { ClientsApiConector, ProductsApiConector, SalesApiConector, ZonesApiConector } from "../../../../api/classes";
import { ISalesGetParams } from "../../../../api/types/sales";
import Product from "../../../../type/Products/Products";
import { Zone } from "../../../../type/City";
import { QueryMetadata } from "../../../../api/types/common";
import millify from "millify";

const Ventas: FC = () => {
  const {
    showModal,
    setShowModal,
    setShowFiltro,
    showFiltro,
    setSelectedClient,
    selectedClient
  } = useContext(VentasContext);
  const { setLoading } = useGlobalContext()
  const [currentData, setCurrentData] = useState<Array<Sale>>([]);
  const [summary, setSumary] = useState<Array<SaleProduct>>([]);

  const [products, setProducts] = useState<Product[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  const itemsPerPage: number = 12;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const [clientsFilter, setClientsFilter] = useState<string[] | null>(null);
  const [searchParam, setSearchParam] = useState<string>('');
  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [savedFilters, setSavedFilters] = useState<ISalesGetParams['filters']>({});

  const filterRef = useRef<IFiltroPaginadoReference>(null)

  const getSales = useCallback(async () => {
    setLoading(true)

    const promises: Promise<{ data: Sale[] } & QueryMetadata | null>[] = []

    if (clientsFilter) {
      clientsFilter.forEach(cf =>
        promises.push(SalesApiConector.get({ pagination: { page: 1, pageSize: 3000, sort }, filters: { ...savedFilters, client: cf } }))
      )
    } else {
      promises.push(SalesApiConector.get({ pagination: { page: currentPage, pageSize: itemsPerPage, sort }, filters: savedFilters }))
    }

    const responses = await Promise.all(promises)
    const datSales: Sale[] = []
    let totalcount: number = 0
    responses.forEach(r => {
      datSales.push(...(r?.data || []))
      totalcount += r?.metadata.totalCount || 0
    })

    setCurrentData(datSales);
    setTotalPage(Math.ceil(totalcount / itemsPerPage)); // Update total pages
    setTotal(totalcount)
    setLoading(false)
  }, [currentPage, setLoading, savedFilters, sort, clientsFilter]);

  useEffect(() => {
    SalesApiConector.getSalesProducts({ filters: { initialDate: "2020-01-01", finalDate: (new Date()).toISOString() } }).then(res => {
      setSumary(res || [])
    })
  }, [])

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
    }
    fetchZones()
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    getSales();
  }, [getSales]);

  const handleFilterChange = (filters: ISalesGetParams['filters']) => {
    setCurrentPage(1);
    setSavedFilters(filters);
  };

  return (
    <>
      <div className="px-10">
        <PageTitle titulo="Ventas" icon="./Ventas-icon.svg" />
        <FiltroPaginado
          ref={filterRef}
          add={false}
          exportar={true}
          typeDataToExport={"sales"}
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
          infoPedidos={true}
          infoPedidosData={summary.filter(s => s.cant > 0).map(s => ({ text: `${s.cant} ${s.prod}`, value: `${millify(s.total, { precision: 2 })} Bs.` }))}
        >
          {
            currentData.length > 0 &&
            <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-4 pb-10 overflow-x-hidden">
              {currentData.map((sale: Sale) => (
                <CuadroVentaCliente sale={sale} key={sale._id} products={products} />
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
          <OpcionesVentas
            onClose={() => {
              setShowModal(false);
              setSelectedClient(client);
            }}
          />
        </div>
      </Modal >

      <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
        <FiltroVenta
          zones={zones}
          onChange={handleFilterChange}
          initialFilters={savedFilters}
        />
      </Modal>
    </>
  );
};

export { Ventas };
