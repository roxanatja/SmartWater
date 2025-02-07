import { useContext, useEffect, useState } from 'react'
import { ComisionesGeneralContext, generalMock } from './ComisionesGeneralProvider';
import { UsersApiConector } from '../../../../../api/classes';
import InventariosLayout from '../../Inventarios/InventariosLayout/InventariosLayout';
import TableGeneral from './TableGeneral';
import { fisicos_saldos } from '../mock-data';
import { PageTitle } from '../../../components/PageTitle/PageTitle';
import { User } from '../../../../../type/User';
import Modal from '../../../EntryComponents/Modal';
import FilterGeneral from './FilterGeneral';
import FormGeneral from './FormGeneral';

const ComisionesGeneral = () => {
    const {
        setShowFiltro, showFiltro,
        setShowMiniModal, showMiniModal,
        setShowModal, showModal,
        setSelectedInvetario, selectedInventario
    } = useContext(ComisionesGeneralContext)

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
            <div className="px-10 h-full">
                <PageTitle
                    titulo="Comisiones / Porcentaje general"
                    icon="/Finanzas-icon.svg"
                />
                <InventariosLayout filtro
                    onFilter={() => setShowFiltro(true)}
                    hasFilter={!!savedFilters && Object.keys(savedFilters).length > 0}
                    add onAdd={() => setShowMiniModal(true)} >
                    <TableGeneral data={fisicos_saldos} className='w-full no-inner-border border !border-font-color/20 !rounded-[10px]' />
                </InventariosLayout>
            </div>

            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <FilterGeneral distribuidores={distribuidores} initialFilters={savedFilters} onChange={handleFilterChange} />
            </Modal>

            <Modal isOpen={showMiniModal} onClose={() => setShowMiniModal(false)} className='!w-3/4 md:!w-1/2 xl:!w-1/3'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Generar porcentaje general
                </h2>
                <FormGeneral onCancel={() => setShowMiniModal(false)} />
            </Modal>

            <Modal isOpen={showModal && selectedInventario._id !== ""} onClose={() => { setShowModal(false); setSelectedInvetario(generalMock); }} className='!w-3/4 md:!w-1/2 xl:!w-1/3'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Editar porcentaje general
                </h2>
                <FormGeneral onCancel={() => { setShowModal(false); setSelectedInvetario(generalMock); }} />
            </Modal>
        </>
    )
}

export default ComisionesGeneral