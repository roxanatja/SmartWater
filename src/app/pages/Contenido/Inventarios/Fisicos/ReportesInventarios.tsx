import React, { useContext, useEffect, useState } from 'react'
import InventariosLayout from '../InventariosLayout/InventariosLayout'
import { InventariosFisicosContext } from './InventariosFisicosProvider';
import { User } from '../../../../../type/User';
import { UsersApiConector } from '../../../../../api/classes';
import Modal from '../../../EntryComponents/Modal';
import FiltrosReportesInventarios from './Filtros/FiltrosReportesInventarios';
import TableFisicosReportes from './Tables/TableFisicosReportes';
import { fisicos_saldos } from '../mock-data';

const ReportesInventarios = () => {
    const { setShowFiltro, showFiltro } = useContext(InventariosFisicosContext)

    const itemsPerPage: number = 12;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    const [savedFilters, setSavedFilters] = useState<any>({})

    const [distribuidores, setDistribuidores] = useState<User[]>([])

    useEffect(() => {
        UsersApiConector.get({ filters: { desactivated: false }, pagination: { page: 1, pageSize: 30000 } }).then(res => setDistribuidores(res?.data || []))
    }, [])

    const handleFilterChange = (filters: any) => {
        setCurrentPage(1);
        setSavedFilters(filters);
    };

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
                <TableFisicosReportes data={fisicos_saldos} className='w-full no-inner-border border !border-font-color/20 !rounded-[10px]' />
            </InventariosLayout>

            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <FiltrosReportesInventarios distribuidores={distribuidores} initialFilters={savedFilters} onChange={handleFilterChange} />
            </Modal>
        </>
    )
}

export default ReportesInventarios