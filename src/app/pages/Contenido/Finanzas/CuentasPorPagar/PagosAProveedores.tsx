import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CuentasPorPagarContext } from './CuentasPorPagarContext';
import { useGlobalContext } from '../../../../SmartwaterContext';
import { InvoceExpense } from '../../../../../type/InvoceExpense';
import { Providers } from '../../../../../type/providers';
import { User } from '../../../../../type/User';
import { Zone } from '../../../../../type/City';
import { IInvExpensesGetParams } from '../../../../../api/types/invoice-expenses';
import { FiltroPaginado, IFiltroPaginadoReference } from '../../../components/FiltroPaginado/FiltroPaginado';
import { PaginatedSearch, QueryMetadata } from '../../../../../api/types/common';
import { InvoiceExpensesApiConector, ProvidersApiConector, UsersApiConector, ZonesApiConector } from '../../../../../api/classes';
import { CuadroPagosProveedor } from './CuadroPagosProveedor/CuadroPagosProveedor';
import Modal from '../../../EntryComponents/Modal';
import { FiltroPagos } from './FiltroPagos.tsx/FiltroPagos';

interface Props {
    proveedor?: string
}

const PagosAProveedores = ({ proveedor }: Props) => {
    const navigate = useNavigate()

    const { showFiltro, setShowFiltro } = useContext(CuentasPorPagarContext);

    const { setLoading } = useGlobalContext()
    const [currentData, setCurrentData] = useState<Array<InvoceExpense>>([]);
    const [summary, setSumary] = useState<Array<InvoceExpense>>([]);

    const [providers, setProviders] = useState<Providers[]>([]);
    const [distribuidores, setDistribuidores] = useState<User[]>([]);
    const [zones, setZones] = useState<Zone[]>([]);

    const itemsPerPage: number = 12;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    const [searchParam, setSearchParam] = useState<string>('');
    const [sort, setSort] = useState<'asc' | 'desc'>('desc');
    const [savedFilters, setSavedFilters] = useState<IInvExpensesGetParams['filters']>({});

    const filterRef = useRef<IFiltroPaginadoReference>(null)

    const [query, setQuery] = useSearchParams()
    const [queryData, setQueryData] = useState<IInvExpensesGetParams & { text?: string, clients?: string[] } & PaginatedSearch | null>(null)

    useEffect(() => {
        if (query && query.has('filters')) {
            const queryRes: IInvExpensesGetParams & { text?: string, clients?: string[] } & PaginatedSearch = JSON.parse(atob(query.get('filters')!))
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

        const promises: Promise<{ data: InvoceExpense[] } & QueryMetadata | null>[] = []
        let filters: IInvExpensesGetParams['filters'] = {}

        if (queryData) {
            filters = { ...queryData.filters }

            if (proveedor) {
                promises.push(InvoiceExpensesApiConector.get({ filters: { ...filters, provider: proveedor, sort: queryData.pagination?.sort } }))
            } else {
                if (queryData.clients) {
                    queryData.clients.forEach(cf =>
                        promises.push(InvoiceExpensesApiConector.get({ filters: { ...filters, provider: cf, sort: queryData.pagination?.sort } }))
                    )
                } else {
                    promises.push(InvoiceExpensesApiConector.get({ filters: { ...filters, sort: queryData.pagination?.sort } }))
                }
            }
        }

        const responses = await Promise.all(promises)
        const datSales: InvoceExpense[] = []
        let totalcount: number = 0
        responses.forEach(r => {
            datSales.push(...(r?.data || []))
            totalcount += r?.metadata.totalCount || 0
        })

        setSumary(datSales);
        setTotalPage(Math.ceil(totalcount / itemsPerPage)); // Update total pages
        setTotal(totalcount)
        setLoading(false)
    }, [setLoading, queryData, proveedor]);

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
        if (queryData && summary) {
            setCurrentData(summary.slice(((queryData.pagination?.page || 1) - 1) * itemsPerPage, ((queryData.pagination?.page || 1)) * itemsPerPage))
        }
    }, [queryData, summary])

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
            setProviders((await ProvidersApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || []);
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

    const handleFilterChange = (filters: IInvExpensesGetParams['filters']) => {
        setCurrentPage(1);
        setSavedFilters(filters);
        setQuery({ filters: btoa(JSON.stringify({ ...queryData, pagination: { ...queryData?.pagination, page: 1 }, filters })) })
    };

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
                hasSearch={!proveedor}
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
                                    if (!!proveedor) {
                                        navigate(`/Finanzas/CuentasPorPagar/Historial/${proveedor}/Cuentas`)
                                    } else {
                                        navigate("/Finanzas/CuentasPorPagar/Cuentas")
                                    }
                                }}
                            >
                                Cuentas por pagar
                            </div>
                            <div
                                className={`switch-option selected`}
                                onClick={() => {
                                    if (!!proveedor) {
                                        navigate(`/Finanzas/CuentasPorPagar/Historial/${proveedor}/Pagos`)
                                    } else {
                                        navigate("/Finanzas/CuentasPorCobrarCobros/Pagos")
                                    }
                                }}
                            >
                                {!!proveedor ? "Pagos" : "Pagos a proveedores"}
                            </div>
                        </div>
                    </div>
                </div>

                {
                    currentData.length > 0 &&
                    <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 gap-4 pb-10 overflow-x-hidden">
                        {currentData.map((bill: InvoceExpense) => (
                            <CuadroPagosProveedor key={bill._id} invoice={bill} providers={providers} />
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
                <FiltroPagos
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

export default PagosAProveedores