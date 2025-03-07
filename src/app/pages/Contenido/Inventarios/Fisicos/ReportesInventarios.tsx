import React, { useCallback, useContext, useEffect, useState } from 'react'
import InventariosLayout from '../InventariosLayout/InventariosLayout'
import { InventariosFisicosContext, physicalReport } from './InventariosFisicosProvider';
import { User } from '../../../../../type/User';
import { UsersApiConector } from '../../../../../api/classes';
import Modal from '../../../EntryComponents/Modal';
import FiltrosReportesInventarios from './Filtros/FiltrosReportesInventarios';
import TableFisicosReportes from './Tables/TableFisicosReportes';
import { PhysiscalGeneratedReport } from '../../../../../type/PhysicalInventory';
import { PhysicalInventoryApiConector } from '../../../../../api/classes/physical-inventory';
import { useGlobalContext } from '../../../../SmartwaterContext';
import moment from 'moment';
import FormPickDistribuidor from './Modals/FormPickDistribuidor';
import GenerateReportModal from './Modals/GenerateReportModal';
import ShowSelectedReport from './Modals/ShowSelectedReport';
import { MatchedElementRoot } from '../../../../../type/Kardex';

const ReportesInventarios = () => {
    const {
        setShowFiltro, showFiltro,
        setShowModal, showModal,
        setShowMiniModal, showMiniModal,
        setSelectedInvetario, selectedInventario,
        setSelectedReport, selectedReport,
        setSelectedOption, selectedOption
    } = useContext(InventariosFisicosContext)
    const { setLoading } = useGlobalContext()

    const [currentData, setCurrentData] = useState<PhysiscalGeneratedReport[]>([])
    const [elements, setElements] = useState<MatchedElementRoot[]>([]);

    const [savedFilters, setSavedFilters] = useState<any>({})
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
        if (!filters.endDate) {
            filters.endDate = moment().format("YYYY-MM-DD")
        }

        if (!filters.initialDate) {
            filters.initialDate = "2020-01-01"
        }

        const promises: Promise<PhysiscalGeneratedReport[] | { message: string; } | null>[] = []

        if (filters.user) {
            for (const dist of filters.user.split(',')) {
                promises.push(PhysicalInventoryApiConector.get({ type: 'generated-reports', filters: { ...filters, user: dist } }))
            }
        } else {
            promises.push(PhysicalInventoryApiConector.get({ type: 'generated-reports', filters }))
        }

        const responses = await Promise.all(promises)
        const array: PhysiscalGeneratedReport[] = []

        responses.forEach(res => {
            const results = res ? 'message' in res ? [] : res : []
            array.push(...results)
        })

        setCurrentData(array.sort((a, b) => moment(b.registerDate).diff(moment(a.registerDate))))
        setLoading(false)
    }, [savedFilters, setLoading])

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
                        isSelected: false,
                        text: "Saldos iniciales diarios",
                        url: "/Finanzas/Inventarios/Fisicos/Saldos"
                    },
                    {
                        isSelected: true,
                        text: "Reportes de inventario",
                        url: "/Finanzas/Inventarios/Fisicos/ReporteInventario"
                    },
                ]} add onAdd={() => { setShowModal(true) }}>
                <TableFisicosReportes data={currentData} className='w-full no-inner-border border !border-font-color/20 !rounded-[10px]' distribuidores={distribuidores} />
            </InventariosLayout>

            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <FiltrosReportesInventarios distribuidores={distribuidores} initialFilters={savedFilters} onChange={handleFilterChange} />
            </Modal>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">Reporte de inventarios</h2>
                <FormPickDistribuidor distribuidores={distribuidores} onCancel={() => setShowModal(false)} />
            </Modal>

            <Modal isOpen={showMiniModal && selectedInventario.length > 0} onClose={() => { setShowMiniModal(false); setSelectedInvetario([]) }} className='!w-[95%] md:!w-3/4'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">Generar reporte de inventarios</h2>
                <GenerateReportModal onCancel={() => { setShowMiniModal(false); setSelectedInvetario([]) }} />
            </Modal>

            <Modal isOpen={selectedOption && selectedReport._id !== ""} onClose={() => { setSelectedOption(false); setSelectedReport(physicalReport) }} className='!w-[95%] md:!w-3/4'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">Reporte de inventarios</h2>
                <ShowSelectedReport onCancel={() => { setSelectedOption(false); setSelectedReport(physicalReport) }} elements={elements} distribuidores={distribuidores} />
            </Modal>
        </>
    )
}

export default ReportesInventarios