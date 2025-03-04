import React, { useCallback, useContext, useEffect, useState } from 'react'
import InventariosLayout from '../InventariosLayout/InventariosLayout'
import { User } from '../../../../../type/User'
import { balance, InventariosFisicosContext } from './InventariosFisicosProvider'
import Modal from '../../../EntryComponents/Modal'
import FiltrosSaldosIniciales from './Filtros/FiltrosSaldosIniciales'
import { UsersApiConector } from '../../../../../api/classes'
import TableFisicosSaldosIniciales from './Tables/TableFisicosSaldosIniciales'
import { IPhysicalGetParams } from '../../../../../api/types/physical-inventory'
import { MatchedElementRoot } from '../../../../../type/Kardex'
import { PhysicalInventoryApiConector } from '../../../../../api/classes/physical-inventory'
import { useGlobalContext } from '../../../../SmartwaterContext'
import moment from 'moment'
import { PhysicalBalanceToShow, PhysicalInitialBalace } from '../../../../../type/PhysicalInventory'
import SaldosInicialesForm from './Modals/SaldosInicialesForm'
import ShowInitialBalancesModal from './Modals/ShowInitialBalancesModal'

const SaldosIniciales = () => {
    const {
        setShowFiltro, showFiltro,
        setShowMiniModal, showMiniModal,
        setShowModal, showModal,
        setSelectedBalance, selectedBalance,
        setSelectedOption, selectedOption
    } = useContext(InventariosFisicosContext)
    const { setLoading } = useGlobalContext()

    const [currentData, setCurrentData] = useState<PhysicalBalanceToShow[]>([])
    const [elements, setElements] = useState<MatchedElementRoot[]>([]);
    const [savedFilters, setSavedFilters] = useState<IPhysicalGetParams['filters']>({})

    const [distribuidores, setDistribuidores] = useState<User[]>([])

    useEffect(() => {
        PhysicalInventoryApiConector.getElements().then(res => setElements(res || []));
        UsersApiConector.get({ filters: { desactivated: false }, pagination: { page: 1, pageSize: 30000 } }).then(res => setDistribuidores(res?.data || []))
    }, [])

    const handleFilterChange = (filters: any) => {
        setSavedFilters(filters);
    };

    const getData = useCallback(async () => {
        setLoading(true)

        const filters = savedFilters ? { ...savedFilters } : {}
        if (!!filters.initialDate && !filters.endDate) {
            filters.endDate = moment().format("YYYY-MM-DD")
        }

        if (!filters.initialDate && !!filters.endDate) {
            filters.initialDate = "2020-01-01"
        }

        const promises: Promise<PhysicalInitialBalace[] | { message: string; } | null>[] = []

        if (filters.user) {
            for (const dist of filters.user.split(',')) {
                promises.push(PhysicalInventoryApiConector.get({ type: 'initial-balance', filters: { ...filters, user: dist } }))
            }
        } else {
            promises.push(PhysicalInventoryApiConector.get({ type: 'initial-balance', filters }))
        }

        const responses = await Promise.all(promises)
        const array: PhysicalInitialBalace[] = []

        responses.forEach(res => {
            const results = res ? 'message' in res ? [] : res : []
            array.push(...results)
        })

        const arrayTransformed: PhysicalBalanceToShow[] = []

        array.forEach((element) => {
            const dist = distribuidores.find(d => d._id === element.user)
            element.saldosIniciales.forEach((saldo) => {
                arrayTransformed.push({
                    code: saldo.code,
                    saldo: saldo.saldo,
                    showDate: moment.min(saldo.saldo.map(s => moment(s.registerDate))),
                    user: {
                        isAdmin: dist?.role === 'admin',
                        _id: element.user,
                        name: dist ? dist.fullName : 'No encontrado'
                    }
                })
            })
        })

        setCurrentData(arrayTransformed.sort((a, b) => b.showDate.diff(a.showDate)))
        setLoading(false)
    }, [savedFilters, setLoading, distribuidores])

    useEffect(() => {
        getData()
    }, [getData])

    return (
        <>
            <InventariosLayout filtro
                onFilter={() => setShowFiltro(true)}
                hasFilter={!!savedFilters && Object.keys(savedFilters).length > 0}
                swith switchDetails={[
                    {
                        isSelected: true,
                        text: "Saldos iniciales diarios",
                        url: "/Finanzas/Inventarios/Fisicos/Saldos"
                    },
                    {
                        isSelected: false,
                        text: "Reportes de inventario",
                        url: "/Finanzas/Inventarios/Fisicos/ReporteInventario"
                    },
                ]} add onAdd={() => { setShowMiniModal(true) }} >
                <TableFisicosSaldosIniciales data={currentData.sort((a, b) => Number(b.code.split("-")[2]) - Number(a.code.split("-")[2]))}
                    className='w-full xl:!w-3/4 no-inner-border border !border-font-color/20 !rounded-[10px]' />
            </InventariosLayout>

            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <FiltrosSaldosIniciales distribuidores={distribuidores} initialFilters={savedFilters} onChange={handleFilterChange} />
            </Modal>

            <Modal isOpen={showMiniModal} onClose={() => setShowMiniModal(false)}>
                <SaldosInicialesForm distribuidores={distribuidores} elements={elements} onCancel={() => { setShowMiniModal(false) }} />
            </Modal>

            <Modal isOpen={showModal && selectedBalance.code !== ""} onClose={() => { setShowModal(false); setSelectedBalance(balance) }}>
                <SaldosInicialesForm distribuidores={distribuidores} elements={elements} onCancel={() => { setShowModal(false); setSelectedBalance(balance) }} />
            </Modal>

            <Modal isOpen={selectedOption && selectedBalance.code !== ""} onClose={() => { setSelectedOption(false); setSelectedBalance(balance) }}>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Saldos iniciales
                </h2>
                <ShowInitialBalancesModal elements={elements} onCancel={() => { setSelectedOption(false); setSelectedBalance(balance) }} />
            </Modal>
        </>
    )
}

export default SaldosIniciales