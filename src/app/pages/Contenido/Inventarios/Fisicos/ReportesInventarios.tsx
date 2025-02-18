import React, { useCallback, useContext, useEffect, useState } from 'react'
import InventariosLayout from '../InventariosLayout/InventariosLayout'
import { InventariosFisicosContext } from './InventariosFisicosProvider';
import { User } from '../../../../../type/User';
import { UsersApiConector } from '../../../../../api/classes';
import Modal from '../../../EntryComponents/Modal';
import FiltrosReportesInventarios from './Filtros/FiltrosReportesInventarios';
import TableFisicosReportes from './Tables/TableFisicosReportes';
import { fisicos_saldos } from '../mock-data';
import { MatchedElementRoot } from '../../../../../type/Kardex';
import { PhysiscalGeneratedReport } from '../../../../../type/PhysicalInventory';
import { PhysicalInventoryApiConector } from '../../../../../api/classes/physical-inventory';
import { useGlobalContext } from '../../../../SmartwaterContext';
import moment from 'moment';

const ReportesInventarios = () => {
    const { setShowFiltro, showFiltro } = useContext(InventariosFisicosContext)
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
                ]} add onAdd={() => { alert("OnAdd") }}>
                <TableFisicosReportes data={currentData} className='w-full no-inner-border border !border-font-color/20 !rounded-[10px]' distribuidores={distribuidores} />
            </InventariosLayout>

            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <FiltrosReportesInventarios distribuidores={distribuidores} initialFilters={savedFilters} onChange={handleFilterChange} />
            </Modal>
        </>
    )
}

export default ReportesInventarios