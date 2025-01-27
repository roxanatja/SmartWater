import { useCallback, useContext, useEffect, useRef, useState } from "react";
import "./CuentasPorPagar.css";
import { FiltroPaginado, IFiltroPaginadoReference } from "../../../components/FiltroPaginado/FiltroPaginado";
import { CuadroCuentasPorPagar } from "./CuadroCuentasPorPagar/CuadroCuentasPorPagar";
import { useGlobalContext } from "../../../../SmartwaterContext";
import { CuentasPorPagarContext } from "./CuentasPorPagarContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Expense } from "../../../../../type/Expenses";
import { Zone } from "../../../../../type/City";
import { User } from "../../../../../type/User";
import { IExpensesGetParams } from "../../../../../api/types/expenses";
import { QueryMetadata } from "../../../../../api/types/common";
import moment from "moment";
import { ExpensesApiConector, ProvidersApiConector, UsersApiConector, ZonesApiConector } from "../../../../../api/classes";
import { Providers } from "../../../../../type/providers";
import Modal from "../../../EntryComponents/Modal";
import { providerBlank } from "../Proveedores/ProveedoresContext";
import { FiltroCuentasPorPagar } from "./FiltroCuentasPorPagar/FiltroCuentasPorPagar";
import OpcionesCuentasPorPagar from "./OpcionesCuentasPorPagar";

const CuentasPorPagar = () => {
    const navigate = useNavigate()

    const { showMiniModal, showFiltro, setShowFiltro, setShowMiniModal, providerSelect, setProviderSelected } = useContext(CuentasPorPagarContext);

    const { setLoading } = useGlobalContext()
    const [currentData, setCurrentData] = useState<Array<Expense>>([]);
    const [summary, setSumary] = useState<Array<Expense>>([]);

    const [distribuidores, setDistribuidores] = useState<User[]>([]);
    const [providers, setProviders] = useState<Providers[]>([]);
    const [zones, setZones] = useState<Zone[]>([]);

    const itemsPerPage: number = 12;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    const [searchParam, setSearchParam] = useState<string>('');
    const [sort, setSort] = useState<'asc' | 'desc'>('desc');
    const [savedFilters, setSavedFilters] = useState<IExpensesGetParams['filters']>({});
    const [showAll, setShowAll] = useState<boolean>(false);

    const filterRef = useRef<IFiltroPaginadoReference>(null)

    const [query, setQuery] = useSearchParams()
    const [queryData, setQueryData] = useState<IExpensesGetParams & { text?: string, clients?: string[], showAll?: boolean; } | null>(null)

    useEffect(() => {
        if (query && query.has('filters')) {
            const queryRes: IExpensesGetParams & { text?: string, clients?: string[], showAll?: boolean; } = JSON.parse(atob(query.get('filters')!))
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

            setShowAll(!!queryRes.showAll)
        } else {
            setQuery({ filters: btoa(JSON.stringify({ pagination: { page: 1, pageSize: itemsPerPage, sort: 'desc' }, showAll: false })) })
        }
    }, [query, setQuery])

    const getSales = useCallback(async () => {
        setLoading(true)

        const promises: Promise<{ data: Expense[] } & QueryMetadata | null>[] = []
        let filters: IExpensesGetParams['filters'] = {}

        if (queryData) {
            filters = { ...queryData.filters }

            if (!filters.initialDate && !!filters.finalDate) {
                filters.initialDate = "2020-01-01"
            }

            if (!filters.finalDate && !!filters.initialDate) {
                filters.finalDate = moment().format("YYYY-MM-DD")
            }

            if (queryData.clients) {
                queryData.clients.forEach(cf =>
                    promises.push(ExpensesApiConector.get({ pagination: { page: 1, pageSize: 3000, sort: queryData.pagination?.sort }, filters: { ...filters, provider: cf, creditBuy: true, pendingBalance: queryData.showAll ? undefined : true } }))
                )
            } else {
                promises.push(ExpensesApiConector.get({ pagination: queryData.pagination, filters: { ...filters, creditBuy: true, pendingBalance: queryData.showAll ? undefined : true } }))
            }
        }

        const responses = await Promise.all(promises)
        const datSales: Expense[] = []
        let totalcount: number = 0
        responses.forEach(r => {
            datSales.push(...(r?.data || []))
            totalcount += r?.metadata.totalCount || 0
        })

        setCurrentData(datSales);
        setTotalPage(Math.ceil(totalcount / itemsPerPage)); // Update total pages
        setTotal(totalcount)
        setLoading(false)
    }, [setLoading, queryData]);

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
                    const providersFilteres = providers.filter(p => p.fullName.toLowerCase().includes(searchParam.toLowerCase()) || p.fullName.toLowerCase().includes(searchParam.toLowerCase()))
                    if (providersFilteres.length > 0) {
                        setQuery({ filters: btoa(JSON.stringify({ ...queryData, pagination: { ...queryData?.pagination, pageSize: itemsPerPage, page: 1 }, clients: providersFilteres.map(c => c._id), text: searchParam })) })
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
            setDistribuidores((await UsersApiConector.get({ pagination: { page: 1, pageSize: 3000 }, filters: { desactivated: false } }))?.data || []);
            setProviders((await ProvidersApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || []);
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

    const handleFilterChange = (filters: IExpensesGetParams['filters']) => {
        setCurrentPage(1);
        setSavedFilters(filters);
        setQuery({ filters: btoa(JSON.stringify({ ...queryData, pagination: { ...queryData?.pagination, page: 1 }, filters })) })
    };

    const handleShowAllChange = (val: boolean) => {
        setCurrentPage(1);
        setShowAll(val);
        setQuery({ filters: btoa(JSON.stringify({ ...queryData, pagination: { ...queryData?.pagination, page: 1 }, showAll: val })) })
    };

    useEffect(() => {
        const promises: Promise<{ data: Expense[] } & QueryMetadata | null>[] = []
        let filters: IExpensesGetParams['filters'] = {}

        if (queryData) {
            filters = { ...queryData.filters }

            if (!filters.initialDate && !!filters.finalDate) {
                filters.initialDate = "2020-01-01"
            }

            if (!filters.finalDate && !!filters.initialDate) {
                filters.finalDate = moment().format("YYYY-MM-DD")
            }

            if (queryData.clients) {
                queryData.clients.forEach(cf =>
                    promises.push(ExpensesApiConector.get({ pagination: { page: 1, pageSize: 3000, sort: queryData.pagination?.sort }, filters: { ...filters, provider: cf, creditBuy: true, pendingBalance: queryData.showAll ? undefined : true } }))
                )
            } else {
                promises.push(ExpensesApiConector.get({ pagination: { page: 1, pageSize: 3000, sort: queryData.pagination?.sort }, filters: { ...filters, creditBuy: true, pendingBalance: queryData.showAll ? undefined : true } }))
            }
        }

        Promise.all(promises).then(responses => {
            const datSales: Expense[] = []
            responses.forEach(r => {
                datSales.push(...(r?.data || []))
            })

            setSumary(datSales)
        })
    }, [queryData])

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
                search={setSearchParam}
                orderArray={orderArray}
                onFilter={() => setShowFiltro(true)}
                hasFilter={!!savedFilters && Object.keys(savedFilters).length > 0}
                searchPlaceholder="Buscar por nombre o teléfono de cliente"
                sorted={sort === 'asc' ? "older" : "new"}
                activeFilters={{ ...queryData?.filters, clients: queryData?.clients }}
                otherResults={[{
                    text: "Total:",
                    value: `${summary.reduce((cont, sale) => cont += sale.amount, 0).toLocaleString()} Bs`
                }]}
            >
                <div className="w-full pb-10 sticky top-0 bg-main-background z-[20] flex justify-between items-center gap-10 flex-wrap">
                    <div className="w-full sm:w-1/2">
                        <div className="switch-contenido">
                            <div
                                className={`switch-option selected`}
                                onClick={() => navigate("/Finanzas/CuentasPorPagar/Cuentas")}
                            >
                                Cuentas por pagar
                            </div>
                            <div
                                className={`switch-option`}
                                onClick={() => navigate("/Finanzas/CuentasPorPagar/Pagos")}
                            >
                                Pagos a proveedores
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <input type="checkbox" id="all" className="accent-blue_custom" checked={showAll} onChange={() => handleShowAllChange(!showAll)} />
                        <label htmlFor="all" className="text-sm">Mostrar todos</label>
                    </div>
                </div>

                {
                    currentData.length > 0 &&
                    <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-4 pb-10 overflow-x-hidden">
                        {currentData.map((sale: Expense) => (
                            <CuadroCuentasPorPagar expense={sale} key={sale._id} />
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
                <FiltroCuentasPorPagar
                    providers={providers}
                    zones={zones}
                    distribuidores={distribuidores}
                    onChange={handleFilterChange}
                    initialFilters={savedFilters}
                />
            </Modal>

            <Modal
                isOpen={showMiniModal && providerSelect._id !== ""}
                onClose={() => {
                    setProviderSelected(providerBlank);
                    setShowMiniModal(false);
                }}
                className="w-3/12"
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30">
                    Opciones Cuentas
                </h2>
                <div className="p-6">
                    <OpcionesCuentasPorPagar
                        onClose={() => {
                            setProviderSelected(providerBlank);
                            setShowMiniModal(false);
                        }}
                    />
                </div>
            </Modal >
        </>
    );
}

export { CuentasPorPagar }