import { useContext, useEffect, useState } from 'react'
import { ComisionesEspecificosContext, especificoMock } from './ComisionesEspecificosProvider';
import { User } from '../../../../../type/User';
import { ProductsApiConector, UsersApiConector } from '../../../../../api/classes';
import { PageTitle } from '../../../components/PageTitle/PageTitle';
import InventariosLayout from '../../Inventarios/InventariosLayout/InventariosLayout';
import TableEspecificos from './TableEspecificos';
import { fisicos_saldos } from '../mock-data';
import Modal from '../../../EntryComponents/Modal';
import Filterespecificos from './Filterespecificos';
import FormEspecificos from './FormEspecificos';
import Product from '../../../../../type/Products/Products';

const ComisionesEspecificos = () => {
    const {
        setShowFiltro, showFiltro,
        setShowMiniModal, showMiniModal,
        setShowModal, showModal,
        setSelectedInvetario, selectedInventario
    } = useContext(ComisionesEspecificosContext)

    const itemsPerPage: number = 12;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);

    const [savedFilters, setSavedFilters] = useState<any>({})

    const [distribuidores, setDistribuidores] = useState<User[]>([])
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        UsersApiConector.get({ filters: { desactivated: false }, pagination: { page: 1, pageSize: 30000 } }).then(res => setDistribuidores(res?.data || []))
        ProductsApiConector.get({ pagination: { page: 1, pageSize: 30000 } }).then(res => setProducts(res?.data || []))
    }, [])

    const handleFilterChange = (filters: any) => {
        setCurrentPage(1);
        setSavedFilters(filters);
    };

    return (
        <>
            <div className="px-10 h-full">
                <PageTitle
                    titulo="Comisiones / Porcentajes específicos generados"
                    icon="/Finanzas-icon.svg"
                />
                <InventariosLayout filtro
                    onFilter={() => setShowFiltro(true)}
                    hasFilter={!!savedFilters && Object.keys(savedFilters).length > 0}
                    add onAdd={() => { setShowMiniModal(true) }} >
                    <TableEspecificos data={fisicos_saldos} className='w-full no-inner-border border !border-font-color/20 !rounded-[10px]' />
                </InventariosLayout>
            </div>

            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <Filterespecificos distribuidores={distribuidores} initialFilters={savedFilters} onChange={handleFilterChange} />
            </Modal>

            <Modal isOpen={showMiniModal} onClose={() => setShowMiniModal(false)} className='!w-3/4 md:!w-2/3'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Generar porcentaje distribuidor
                </h2>
                <FormEspecificos onCancel={() => setShowMiniModal(false)} distribuidores={distribuidores} products={products} />
            </Modal>

            <Modal isOpen={showModal && selectedInventario._id !== ""} onClose={() => { setShowModal(false); setSelectedInvetario(especificoMock); }} className='!w-3/4 md:!w-2/3'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Editar porcentaje distribuidor
                </h2>
                <FormEspecificos onCancel={() => { setShowModal(false); setSelectedInvetario(especificoMock); }} distribuidores={distribuidores} products={products} />
            </Modal>
        </>
    )
}

export default ComisionesEspecificos