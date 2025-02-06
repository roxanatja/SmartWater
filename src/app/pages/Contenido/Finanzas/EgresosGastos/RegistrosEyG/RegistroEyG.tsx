import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useGlobalContext } from '../../../../../SmartwaterContext'
import { FiltroPaginado, IFiltroPaginadoReference } from '../../../../components/FiltroPaginado/FiltroPaginado'
import { useNavigate } from 'react-router-dom'
import { Expense } from '../../../../../../type/Expenses'
import { User } from '../../../../../../type/User'
import { Account } from '../../../../../../type/AccountEntry'
import { Providers } from '../../../../../../type/providers'
import { IExpensesGetParams } from '../../../../../../api/types/expenses'
import { QueryMetadata } from '../../../../../../api/types/common'
import { AccountEntryApiConector, ExpensesApiConector, ProvidersApiConector, UsersApiConector, ZonesApiConector } from '../../../../../../api/classes'
import { EgresosGastosContext, expense } from '../EgresosGastosContext'
import "./RegistrosEyG.css"
import { CuadroRegistrarEyG } from './CuadroRegistrarEyG'
import Modal from '../../../../EntryComponents/Modal'
import { FiltroEgresosGastos } from '../FiltroEgresosGastos/FiltroEgresosGastos'
import millify from 'millify'
import { Zone } from '../../../../../../type/City'
import AddEgresosGastos from '../AddEgresosGastos/AddEgresosGastos'
import { MatchedElement } from '../../../../../../type/Kardex'
import { KardexApiConector } from '../../../../../../api/classes/kardex'
import CuadroEgresoDetails from './CuadroEgresoDetails'

const RegistroEyG = () => {
    const navigate = useNavigate()

    const {
        setShowFiltro,
        showFiltro,
        showModal,
        setShowModal,
        selectedExpense,
        setSelectedExpense,
        selectedOption,
        setSelectedOption,
        showMiniModal,
        setShowMiniModal
    } = useContext(EgresosGastosContext);

    const { setLoading } = useGlobalContext()

    const [users, setUsers] = useState<User[]>([]);
    const [zones, setZones] = useState<Zone[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [providers, setProviders] = useState<Providers[]>([]);
    const [elements, setElements] = useState<MatchedElement[]>([]);

    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const ITEMS_PER_PAGE = 12

    const [itemsToShow, setItemsToShow] = useState<Expense[]>([])
    const [items, setItems] = useState<Expense[]>([])

    const [usersFilter, setUsersFilter] = useState<string[] | null>(null);
    const [searchParam, setSearchParam] = useState<string>('');
    const [sort, setSort] = useState<'asc' | 'desc'>('desc');
    const [savedFilters, setSavedFilters] = useState<IExpensesGetParams['filters']>({});

    const filterRef = useRef<IFiltroPaginadoReference>(null)

    const getSales = useCallback(async () => {
        setLoading(true)

        const promises: Promise<{ data: Expense[] } & QueryMetadata | null>[] = []

        if (usersFilter) {
            promises.push(ExpensesApiConector.get({ pagination: { page: 1, pageSize: 30000, sort }, filters: { ...savedFilters, user: usersFilter.join(",") } }))
        } else {
            promises.push(ExpensesApiConector.get({ pagination: { page: 1, pageSize: 30000, sort }, filters: savedFilters }))
        }

        const responses = await Promise.all(promises)
        const datSales: Expense[] = []
        let totalcount: number = 0
        responses.forEach(r => {
            datSales.push(...(r?.data || []))
            totalcount += r?.metadata.totalCount || 0
        })

        setItems(datSales);
        setTotalPages(Math.ceil(totalcount / ITEMS_PER_PAGE)); // Update total pages
        setLoading(false)
    }, [setLoading, savedFilters, sort, usersFilter]);

    useEffect(() => {
        if (items) {
            setItemsToShow(items.slice((page - 1) * ITEMS_PER_PAGE, (page * ITEMS_PER_PAGE)))
        }
    }, [items, page])

    const orderArray = (orden: string) => {
        if (orden === "new") {
            setSort('desc')
        } else if (orden === "older") {
            setSort('asc')
        }
    };

    useEffect(() => {
        const getData = setTimeout(() => {
            if (searchParam && searchParam.trim() !== "") {
                const clients = users.filter(u => u.fullName?.toLowerCase().includes(searchParam.trim().toLowerCase()))

                if (clients.length > 0) {
                    setUsersFilter(clients.map(c => c._id))
                } else {
                    setUsersFilter([])
                }
                setPage(1);
            } else {
                setUsersFilter(null)
            }
        }, 800);
        return () => clearTimeout(getData)
    }, [searchParam, users])

    useEffect(() => {
        const fetchZones = async () => {
            setUsers((await UsersApiConector.get({ pagination: { page: 1, pageSize: 30000 } }))?.data || []);
            setAccounts((await AccountEntryApiConector.get()) || []);
            setZones((await ZonesApiConector.get({ pagination: { page: 1, pageSize: 30000 } }))?.data || []);
            setProviders((await ProvidersApiConector.get({ pagination: { page: 1, pageSize: 30000 } }))?.data || []);
            setElements((await KardexApiConector.getKardexElements())?.elements || []);
        }
        fetchZones()
    }, [])

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    useEffect(() => {
        getSales();
    }, [getSales]);

    const handleFilterChange = (filters: IExpensesGetParams['filters']) => {
        setPage(1);
        setSavedFilters(filters);
    };

    const grouppedData = useMemo<{ [key: string]: { name: string, total: number } }>(() => {
        const result: { [key: string]: { name: string, total: number } } = {}

        items.forEach(exp => {
            if (result[exp.accountEntry._id]) {
                result[exp.accountEntry._id].total += exp.amount
            } else {
                result[exp.accountEntry._id] = {
                    name: exp.accountEntry.name,
                    total: exp.amount
                }
            }
        })

        return result
    }, [items])

    return (
        <>
            <FiltroPaginado
                ref={filterRef}
                add={true}
                onAdd={() => setShowModal(true)}
                paginacion={totalPages > 1}
                totalPage={totalPages}
                currentPage={page}
                handlePageChange={handlePageChange}
                resultados={true}
                filtro
                total={items.length}
                search={setSearchParam}
                orderArray={orderArray}
                onFilter={() => setShowFiltro(true)}
                hasFilter={!!savedFilters && Object.keys(savedFilters).length > 0}
                searchPlaceholder="Buscar por nombre de usuario"
                infoPedidos
                infoPedidosData={
                    Object.values(grouppedData)
                        .sort((a, b) => a.name > b.name ? 1 : a === b ? 0 : -1)
                        .map(row => (
                            {
                                text: (row?.name || "Cuenta no Reconociada"),
                                value: `${millify(row.total, { precision: 2 })} Bs.`
                            }
                        ))
                }
                infoPedidosClass='mb-0'
                otherResults={[{ text: "Total de egresos", value: `${items.reduce((cont, curr) => cont += curr.amount, 0).toLocaleString()} Bs.` }]}
            >
                <div className="w-full pb-6 sticky top-0 bg-main-background z-[20]">
                    <div className="w-full sm:w-1/2">
                        <div className="switch-contenido">
                            <div
                                className={`switch-option`}
                                onClick={() => navigate("/Finanzas/EgresosGastos/Cuentas")}
                            >
                                Cuentas contables
                            </div>
                            <div
                                className={`switch-option selected`}
                                onClick={() => navigate("/Finanzas/EgresosGastos/Registro")}
                            >
                                Registros Egresos y Gastos
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="w-full pb-10">
                        {

                            itemsToShow.length > 0 &&
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {
                                    itemsToShow.map(p => <CuadroRegistrarEyG key={p._id} expense={p} accounts={accounts} providers={providers} users={users} />)
                                }
                            </div>
                        }
                        {
                            itemsToShow.length === 0 &&
                            <div className="font-semibold text-xl min-h-[300px] flex items-center justify-center">
                                Sin resultados
                            </div>
                        }
                    </div>
                </div>
            </FiltroPaginado >

            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <FiltroEgresosGastos
                    distribuidores={users.filter(u => !u.deactivated)}
                    zones={zones}
                    accounts={accounts}
                    providers={providers}
                    onChange={handleFilterChange}
                    initialFilters={savedFilters}
                />
            </Modal>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)} className='!w-3/4 sm:!w-1/2 xl:!w-1/3'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Registro de egresos y gastos
                </h2>
                <AddEgresosGastos onCancel={() => setShowModal(false)} accounts={accounts} provider={providers} elements={elements} />
            </Modal>

            <Modal
                className='!w-3/4 sm:!w-1/2 xl:!w-1/3'
                isOpen={selectedExpense._id !== "" && selectedOption}
                onClose={() => { setSelectedExpense(expense); setSelectedOption(false) }}
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Editar egresos y gastos
                </h2>
                <AddEgresosGastos onCancel={() => { setSelectedExpense(expense); setSelectedOption(false) }} accounts={accounts} provider={providers} elements={elements} />
            </Modal> F

            <Modal
                isOpen={selectedExpense._id !== "" && showMiniModal}
                onClose={() => { setSelectedExpense(expense); setShowMiniModal(false) }}
                className='!w-3/4 sm:!w-1/2'
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Detalles de egreso
                </h2>
                <CuadroEgresoDetails onCancel={() => { setSelectedExpense(expense); setShowMiniModal(false) }} />
            </Modal> F
        </>
    )
}

export default RegistroEyG