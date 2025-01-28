import { useContext, useState } from 'react';
import InventariosLayout from '../InventariosLayout/InventariosLayout'
import { InventariosOtrosContext } from './InventariosOtrosProvider';
import Modal from '../../../EntryComponents/Modal';
import FiltrosEntradas from './Filtros/FiltrosEntradas';
import TableOtrosIngresos from './Tables/TableOtrosIngresos';
import { otros_invetarios } from '../mock-data';

const Ingresos = () => {
    const { setShowFiltro, showFiltro } = useContext(InventariosOtrosContext)

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
                        isSelected: true,
                        text: "Otros ingresos de almacén",
                        url: "/Finanzas/Inventarios/Otros/Ingresos"
                    },
                    {
                        isSelected: false,
                        text: "Otras salidas de almacén",
                        url: "/Finanzas/Inventarios/Otros/Salidas"
                    },
                ]} add onAdd={() => { alert("OnAdd") }}>
                <TableOtrosIngresos data={otros_invetarios} className='w-full xl:!w-3/4 no-inner-border border !border-font-color/20 !rounded-[10px]' />
            </InventariosLayout>

            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <FiltrosEntradas initialFilters={savedFilters} onChange={handleFilterChange} />
            </Modal>
        </>
    )
}

export default Ingresos