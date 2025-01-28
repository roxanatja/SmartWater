import { useContext, useEffect, useState } from 'react';
import InventariosLayout from '../InventariosLayout/InventariosLayout'
import { InventariosOtrosContext, otroInventario } from './InventariosOtrosProvider';
import Modal from '../../../EntryComponents/Modal';
import FiltrosEntradas from './Filtros/FiltrosEntradas';
import TableOtrosIngresos from './Tables/TableOtrosIngresos';
import { otros_invetarios } from '../mock-data';
import OtrosIngresosForm from './Modals/OtrosIngresosForm';
import Product from '../../../../../type/Products/Products';
import { Item } from '../../../../../type/Item';
import { ItemsApiConector, ProductsApiConector } from '../../../../../api/classes';
import OtrosIgresosDetails from './Modals/OtrosIgresosDetails';

const Ingresos = () => {
    const {
        setShowFiltro, showFiltro,
        setShowModal, showModal,
        showMiniModal, setShowMiniModal,
        selectedInventario, setSelectedInvetario,
        selectedOption, setSelectedOption
    } = useContext(InventariosOtrosContext)

    const itemsPerPage: number = 12;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    const [products, setProducts] = useState<Product[]>([])
    const [items, setItems] = useState<Item[]>([])

    const [savedFilters, setSavedFilters] = useState<any>({})

    const handleFilterChange = (filters: any) => {
        setCurrentPage(1);
        setSavedFilters(filters);
    };

    useEffect(() => {
        ProductsApiConector.get({ pagination: { page: 1, pageSize: 3000 } }).then(res => setProducts(res?.data || []))
        ItemsApiConector.get({ pagination: { page: 1, pageSize: 3000 } }).then(res => setItems(res?.data || []))
    }, [])

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
                ]} add onAdd={() => setShowMiniModal(true)}>
                <TableOtrosIngresos data={otros_invetarios} className='w-full xl:!w-3/4 no-inner-border border !border-font-color/20 !rounded-[10px]' />
            </InventariosLayout>

            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <FiltrosEntradas initialFilters={savedFilters} onChange={handleFilterChange} />
            </Modal>

            <Modal isOpen={showMiniModal} onClose={() => setShowMiniModal(false)}>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Registro otros ingresos
                </h2>
                <OtrosIngresosForm onCancel={() => setShowMiniModal(false)} products={products} items={items} />
            </Modal>

            <Modal
                isOpen={selectedInventario._id !== "" && showModal}
                onClose={() => { setSelectedInvetario(otroInventario); setShowModal(false) }}
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Editar otros ingresos
                </h2>
                <OtrosIngresosForm onCancel={() => { setSelectedInvetario(otroInventario); setShowModal(false) }} products={products} items={items} />
            </Modal>

            <Modal
                isOpen={selectedInventario._id !== "" && selectedOption}
                onClose={() => { setSelectedInvetario(otroInventario); setSelectedOption(false) }}
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Otros ingresos
                </h2>
                <OtrosIgresosDetails type='in' onCancel={() => { setSelectedInvetario(otroInventario); setSelectedOption(false) }} products={products} items={items} />
            </Modal>
        </>
    )
}

export default Ingresos