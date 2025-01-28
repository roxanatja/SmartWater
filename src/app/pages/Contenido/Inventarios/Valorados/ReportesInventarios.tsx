import React, { useContext, useState } from 'react'
import InventariosLayout from '../InventariosLayout/InventariosLayout'
import { InventariosValoradosContext } from './InventariosValoradosProvider';
import Modal from '../../../EntryComponents/Modal';
import FiltrosSaldosIniciales from './Filtros/FiltrosSaldosIniciales';
import FiltrosReportesInventarios from './Filtros/FiltrosReportesInventarios';

const ReportesInventarios = () => {
    const { setShowFiltro, showFiltro } = useContext(InventariosValoradosContext)

    const itemsPerPage: number = 12;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    const [savedFilters, setSavedFilters] = useState<any>({})

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
                        text: "Saldos iniciales",
                        url: "/Finanzas/Inventarios/Valorados/Saldos"
                    },
                    {
                        isSelected: true,
                        text: "Reportes de inventario",
                        url: "/Finanzas/Inventarios/Valorados/ReporteInventario"
                    },
                ]}>
                Reportes Inventarios
            </InventariosLayout>


            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <FiltrosReportesInventarios initialFilters={savedFilters} onChange={handleFilterChange} />
            </Modal>
        </>
    )
}

export default ReportesInventarios