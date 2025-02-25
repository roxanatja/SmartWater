import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ComisionesEspecificosContext, especificoMock } from './ComisionesEspecificosProvider';
import { User } from '../../../../../type/User';
import { ProductsApiConector, UsersApiConector } from '../../../../../api/classes';
import { PageTitle } from '../../../components/PageTitle/PageTitle';
import InventariosLayout from '../../Inventarios/InventariosLayout/InventariosLayout';
import TableEspecificos from './TableEspecificos';
import Modal from '../../../EntryComponents/Modal';
import Filterespecificos from './Filterespecificos';
import FormEspecificos from './FormEspecificos';
import Product from '../../../../../type/Products/Products';
import { useGlobalContext } from '../../../../SmartwaterContext';
import { Comission } from '../../../../../type/Comission';
import { ComissionsApiConector } from '../../../../../api/classes/comissions';
import moment from 'moment';

const ComisionesEspecificos = () => {
    const {
        setShowFiltro, showFiltro,
        setShowMiniModal, showMiniModal,
        setShowModal, showModal,
        setSelectedInvetario, selectedInventario
    } = useContext(ComisionesEspecificosContext)
    const { setLoading } = useGlobalContext()

    const [currentData, setCurrentData] = useState<Comission<'specific'>[]>([])
    const [allComissions, setAllComissions] = useState<Comission<'specific'>[]>([])
    const [savedFilters, setSavedFilters] = useState<any>({})

    const [distribuidores, setDistribuidores] = useState<User[]>([])
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        UsersApiConector.get({ filters: { desactivated: false }, pagination: { page: 1, pageSize: 30000 } }).then(res => setDistribuidores(res?.data || []))
        ProductsApiConector.get({ pagination: { page: 1, pageSize: 30000 } }).then(res => setProducts(res?.data || []))
        ComissionsApiConector.get({ type: 'specific' }).then(res => setAllComissions(res || []))
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
            filters.initialDate = "2024-01-01"
        }

        const res = await ComissionsApiConector.get({ type: 'specific', filters })
        setCurrentData(res || [])

        setLoading(false)
    }, [setLoading, savedFilters])

    useEffect(() => {
        getData()
    }, [getData])

    const allPercentages = useMemo<number[]>(() => {
        const aux: number[] = []
        allComissions.forEach(d => aux.push(...d.details.map(det => { return det?.percentageElem })))
        return Array.from(new Set(aux.sort((a, b) => a - b)))
    }, [allComissions])

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
                    <TableEspecificos data={currentData} distribuidores={distribuidores} className='w-full no-inner-border border !border-font-color/20 !rounded-[10px]' />
                </InventariosLayout>
            </div>

            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <Filterespecificos distribuidores={distribuidores} initialFilters={savedFilters} onChange={handleFilterChange}
                    percentages={allPercentages} />
            </Modal>

            <Modal isOpen={showMiniModal} onClose={() => setShowMiniModal(false)} className='!w-3/4 md:!w-2/3'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Generar porcentaje específico
                </h2>
                <FormEspecificos onCancel={() => setShowMiniModal(false)} distribuidores={distribuidores} products={products} />
            </Modal>

            <Modal isOpen={showModal && selectedInventario._id !== ""} onClose={() => { setShowModal(false); setSelectedInvetario(especificoMock); }} className='!w-3/4 md:!w-2/3'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Editar porcentaje específico
                </h2>
                <FormEspecificos onCancel={() => { setShowModal(false); setSelectedInvetario(especificoMock); }} distribuidores={distribuidores} products={products} />
            </Modal>
        </>
    )
}

export default ComisionesEspecificos