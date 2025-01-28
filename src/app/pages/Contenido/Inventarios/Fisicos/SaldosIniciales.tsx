import React, { useContext, useEffect, useState } from 'react'
import InventariosLayout from '../InventariosLayout/InventariosLayout'
import { User } from '../../../../../type/User'
import { InventariosFisicosContext } from './InventariosFisicosProvider'
import Modal from '../../../EntryComponents/Modal'
import FiltrosSaldosIniciales from './Filtros/FiltrosSaldosIniciales'
import { UsersApiConector } from '../../../../../api/classes'
import TableFisicosSaldosIniciales from './Tables/TableFisicosSaldosIniciales'
import { fisicos_saldos } from '../mock-data'

const SaldosIniciales = () => {
    const { setShowFiltro, showFiltro } = useContext(InventariosFisicosContext)

    const itemsPerPage: number = 12;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    const [savedFilters, setSavedFilters] = useState<any>({})

    const [distribuidores, setDistribuidores] = useState<User[]>([])

    useEffect(() => {
        UsersApiConector.get({ filters: { desactivated: false }, pagination: { page: 1, pageSize: 3000 } }).then(res => setDistribuidores(res?.data || []))
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
                        isSelected: true,
                        text: "Saldos iniciales diarios",
                        url: "/Finanzas/Inventarios/Fisicos/Saldos"
                    },
                    {
                        isSelected: false,
                        text: "Reportes de inventario",
                        url: "/Finanzas/Inventarios/Fisicos/ReporteInventario"
                    },
                ]} add onAdd={() => { alert("OnAdd") }} >
                <TableFisicosSaldosIniciales data={fisicos_saldos} className='w-full lg:!w-3/4 no-inner-border border !border-font-color/20 !rounded-[10px]' />
            </InventariosLayout>

            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <FiltrosSaldosIniciales distribuidores={distribuidores} initialFilters={savedFilters} onChange={handleFilterChange} />
            </Modal>
        </>
    )
}

export default SaldosIniciales