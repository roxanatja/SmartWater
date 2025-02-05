import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CuentasPorCobrarContext } from "../CuentasPorCobrarContext";
import { useGlobalContext } from "../../../../../SmartwaterContext";
import { Sale } from "../../../../../../type/Sale/Sale";
import { User } from "../../../../../../type/User";
import { Zone } from "../../../../../../type/City";
import Product from "../../../../../../type/Products/Products";
import { ISalesGetParams } from "../../../../../../api/types/sales";
import { FiltroPaginado, IFiltroPaginadoReference } from "../../../../components/FiltroPaginado/FiltroPaginado";
import moment from "moment";
import { ProductsApiConector, SalesApiConector, UsersApiConector, ZonesApiConector } from "../../../../../../api/classes";
import { QueryMetadata } from "../../../../../../api/types/common";
import Modal from "../../../../EntryComponents/Modal";
import { CuadroVentaCliente } from "../../../Ventas/CuadroVentaCliente/CuadroVentaCliente";
import FiltroHistorialCuentasPorCobrar from "./FiltroHistorialCuentasPorCobrar/FiltroHistorialCuentasPorCobrar";
import millify from "millify";

interface Props {
  client: string
}

const HistorialCuentasPorCobrar = ({ client }: Props) => {
  const navigate = useNavigate()

  const { showFiltro, setShowFiltro } = useContext(CuentasPorCobrarContext);

  const { setLoading } = useGlobalContext()
  const [currentData, setCurrentData] = useState<Array<Sale>>([]);
  const [summary, setSumary] = useState<Array<Sale>>([]);
  const [summaryDetails, setSumaryDetails] = useState<Array<{ product: string, quantity: number, price: number }>>([]);

  const [distribuidores, setDistribuidores] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  const itemsPerPage: number = 12;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const [sort, setSort] = useState<'asc' | 'desc'>('desc');
  const [savedFilters, setSavedFilters] = useState<ISalesGetParams['filters']>({});

  const filterRef = useRef<IFiltroPaginadoReference>(null)

  const [query, setQuery] = useSearchParams()
  const [queryData, setQueryData] = useState<ISalesGetParams & { text?: string, clients?: string[] } | null>(null)

  useEffect(() => {
    if (query && query.has('filters')) {
      const queryRes: ISalesGetParams & { text?: string, clients?: string[] } = JSON.parse(atob(query.get('filters')!))
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

    const promises: Promise<{ data: Sale[] } & QueryMetadata | null>[] = []
    let filters: ISalesGetParams['filters'] = {}

    if (queryData) {
      filters = { ...queryData.filters }

      if (!filters.initialDate) {
        filters.initialDate = "2020-01-01"
      }

      if (!filters.finalDate) {
        filters.finalDate = moment().format("YYYY-MM-DD")
      }

      promises.push(SalesApiConector.get({ pagination: queryData.pagination, filters: { ...filters, creditSale: true, client } }))
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
    const fetchZones = async () => {
      setZones((await ZonesApiConector.get({}))?.data || []);
      setProducts((await ProductsApiConector.get({ pagination: { page: 1, pageSize: 30000 } }))?.data || []);
      setDistribuidores((await UsersApiConector.get({ pagination: { page: 1, pageSize: 30000 }, filters: { role: 'user', desactivated: false } }))?.data || []);
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

  const handleFilterChange = (filters: ISalesGetParams['filters']) => {
    setCurrentPage(1);
    setSavedFilters(filters);
    setQuery({ filters: btoa(JSON.stringify({ ...queryData, pagination: { ...queryData?.pagination, page: 1 }, filters })) })
  };

  useEffect(() => {
    const promises: Promise<{ data: Sale[] } & QueryMetadata | null>[] = []
    let filters: ISalesGetParams['filters'] = {}

    if (queryData) {
      filters = { ...queryData.filters }

      if (!filters.initialDate) {
        filters.initialDate = "2020-01-01"
      }

      if (!filters.finalDate) {
        filters.finalDate = moment().format("YYYY-MM-DD")
      }

      promises.push(SalesApiConector.get({ pagination: { page: 1, pageSize: 30000 }, filters: { ...filters, creditSale: true, client } }))
    }

    Promise.all(promises).then(responses => {
      const datSales: Sale[] = []
      responses.forEach(r => {
        datSales.push(...(r?.data || []))
      })

      setSumary(datSales)
    })
  }, [queryData, client])

  useEffect(() => {
    const partial: Sale['detail'][0][] = []

    summary.forEach(s => {
      partial.push(...s.detail)
    })

    setSumaryDetails(
      partial.reduce<{ product: string, quantity: number, price: number }[]>((acc, det) => {
        if (acc.some(a => a.product === det.product)) {
          return acc.map(a => ({ ...a, quantity: a.product === det.product ? a.quantity + det.quantity : a.quantity, price: a.product === det.product ? a.price + (det.price * det.quantity) : a.price }))
        } else {
          return [...acc, { product: det.product, quantity: det.quantity, price: det.price * det.quantity }]
        }
      }, []))
  }, [summary])

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
        total={total}
        hasSearch={false}
        orderArray={orderArray}
        onFilter={() => setShowFiltro(true)}
        hasFilter={!!savedFilters && Object.keys(savedFilters).length > 0}
        sorted={sort === 'asc' ? "older" : "new"}
        infoPedidos={true}
        infoPedidosClass='mb-0'
        infoPedidosData={summaryDetails.filter(s => s.quantity > 0).map(s => ({ text: `${s.quantity} ${products.find(p => p._id === s.product)?.name || "Producto desconocido"}`, value: `${millify(s.price, { precision: 2 })} Bs` }))}
        activeFilters={{ ...queryData?.filters, clients: queryData?.clients }}
        otherResults={[{
          text: "Total:",
          value: `${summaryDetails.reduce((cont, sale) => cont += sale.price, 0).toLocaleString()} Bs`
        }]}
      >
        <div className="w-full pb-10 sticky top-0 bg-main-background z-[20]">
          <div className="w-full sm:w-1/2">
            <div className="switch-contenido">
              <div
                className={`switch-option selected`}
                onClick={() => navigate(`/Finanzas/CuentasPorCobrarCobros/Historial/${client}/VentaCredito`)}
              >
                Ventas al crédito
              </div>
              <div
                className={`switch-option`}
                onClick={() => navigate(`/Finanzas/CuentasPorCobrarCobros/Historial/${client}/Cobros`)}
              >
                Cobros
              </div>
            </div>
          </div>
        </div>

        {
          currentData.length > 0 &&
          <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-4 pb-10 overflow-x-hidden">
            {currentData.map((sale: Sale) => (
              <CuadroVentaCliente sale={sale} key={sale._id} products={products} isCobro />
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
        <FiltroHistorialCuentasPorCobrar
          zones={zones}
          distribuidores={distribuidores}
          onChange={handleFilterChange}
          initialFilters={savedFilters}
        />
      </Modal>
    </>
  );
};

export { HistorialCuentasPorCobrar };
