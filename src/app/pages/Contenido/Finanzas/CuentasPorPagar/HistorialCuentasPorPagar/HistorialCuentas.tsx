import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import "./HistorialCuentas.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiltroPaginado, IFiltroPaginadoReference } from "../../../../components/FiltroPaginado/FiltroPaginado";
import { CuentasPorPagarContext } from "../CuentasPorPagarContext";
import { useGlobalContext } from "../../../../../SmartwaterContext";
import { Expense } from "../../../../../../type/Expenses";
import { User } from "../../../../../../type/User";
import { Providers } from "../../../../../../type/providers";
import { Zone } from "../../../../../../type/City";
import { IExpensesGetParams } from "../../../../../../api/types/expenses";
import { QueryMetadata } from "../../../../../../api/types/common";
import moment from "moment";
import { AccountEntryApiConector, ExpensesApiConector, ProvidersApiConector, UsersApiConector, ZonesApiConector } from "../../../../../../api/classes";
import Modal from "../../../../EntryComponents/Modal";
import { FiltroCuentasPorPagar } from "../FiltroCuentasPorPagar/FiltroCuentasPorPagar";
import { Account } from "../../../../../../type/AccountEntry";
import { CuadroRegistrarEyG } from "../../EgresosGastos/RegistrosEyG/CuadroRegistrarEyG";

interface Props {
    provider: string
}

const HistorialCuentas = ({ provider }: Props) => {
    const navigate = useNavigate()

    const { showFiltro, setShowFiltro } = useContext(CuentasPorPagarContext);

    const { setLoading } = useGlobalContext()
    const [currentData, setCurrentData] = useState<Array<Expense>>([]);
    const [summary, setSumary] = useState<Array<Expense>>([]);

    const [distribuidores, setDistribuidores] = useState<User[]>([]);
    const [providers, setProviders] = useState<Providers[]>([]);
    const [zones, setZones] = useState<Zone[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);

    const itemsPerPage: number = 12;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    const [searchParam, setSearchParam] = useState<string>('');
    const [sort, setSort] = useState<'asc' | 'desc'>('desc');
    const [savedFilters, setSavedFilters] = useState<IExpensesGetParams['filters']>({});

    const filterRef = useRef<IFiltroPaginadoReference>(null)

    const [query, setQuery] = useSearchParams()
    const [queryData, setQueryData] = useState<IExpensesGetParams & { text?: string, clients?: string[] } | null>(null)

    useEffect(() => {
        if (query && query.has('filters')) {
            const queryRes: IExpensesGetParams & { text?: string, clients?: string[] } = JSON.parse(atob(query.get('filters')!))
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

            promises.push(ExpensesApiConector.get({ pagination: queryData.pagination, filters: { ...filters, creditBuy: true, provider } }))
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
    }, [setLoading, queryData, provider]);

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
            setDistribuidores((await UsersApiConector.get({ pagination: { page: 1, pageSize: 30000 }, filters: { role: 'user', desactivated: false } }))?.data || []);
            setProviders((await ProvidersApiConector.get({ pagination: { page: 1, pageSize: 30000 } }))?.data || []);
            setAccounts((await AccountEntryApiConector.get() || []));
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


            promises.push(ExpensesApiConector.get({ pagination: { page: 1, pageSize: 30000, sort: queryData.pagination?.sort }, filters: { ...filters, creditBuy: true, provider } }))
        }

        Promise.all(promises).then(responses => {
            const datSales: Expense[] = []
            responses.forEach(r => {
                datSales.push(...(r?.data || []))
            })

            setSumary(datSales)
        })
    }, [queryData, provider])

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
                searchPlaceholder="Buscar por nombre o teléfono de cliente"
                sorted={sort === 'asc' ? "older" : "new"}
                activeFilters={{ ...queryData?.filters, clients: queryData?.clients }}
                otherResults={[{
                    text: "Total:",
                    value: `${summary.reduce((cont, sale) => cont += sale.amount, 0).toLocaleString()} Bs`
                }]}
            >
                <div className="w-full pb-10 sticky top-0 bg-main-background z-[20]">
                    <div className="w-full sm:w-1/2">
                        <div className="switch-contenido">
                            <div
                                className={`switch-option selected`}
                                onClick={() => navigate(`/Finanzas/CuentasPorPagar/Historial/${provider}/Cuentas`)}
                            >
                                Gastos al crédito
                            </div>
                            <div
                                className={`switch-option`}
                                onClick={() => navigate(`/Finanzas/CuentasPorPagar/Historial/${provider}/Pagos`)}
                            >
                                Pagos
                            </div>
                        </div>
                    </div>
                </div>

                {
                    currentData.length > 0 &&
                    <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-4 pb-10 overflow-x-hidden">
                        {currentData.map((sale: Expense) => (
                            <CuadroRegistrarEyG expense={sale} accounts={accounts} isPayment={true} users={distribuidores} providers={providers} />
                        ))}
                    </div>
                }
                {
                    currentData.length === 0 &&
                    <div className="font-semibold text-xl min-h-[300px] flex items-center justify-center">
                        Sin resultados
                    </div>
                }
            </FiltroPaginado >

            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <FiltroCuentasPorPagar
                    isPayment
                    providers={providers}
                    zones={zones}
                    distribuidores={distribuidores}
                    onChange={handleFilterChange}
                    initialFilters={savedFilters}
                />
            </Modal>
        </>
    );
}

export { HistorialCuentas }