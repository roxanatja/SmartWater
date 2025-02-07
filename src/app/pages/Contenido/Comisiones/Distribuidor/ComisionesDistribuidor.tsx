import React, { useContext, useEffect, useState } from 'react'
import { ComisionesDistribuidorContext, distribuidorMock } from './ComisionesDistribuidorProvider';
import { User } from '../../../../../type/User';
import { UsersApiConector } from '../../../../../api/classes';
import { PageTitle } from '../../../components/PageTitle/PageTitle';
import InventariosLayout from '../../Inventarios/InventariosLayout/InventariosLayout';
import TableDistribuidor from './TableDistribuidor';
import { fisicos_saldos } from '../mock-data';
import Modal from '../../../EntryComponents/Modal';
import FilterDistribuidor from './FilterDistribuidor';
import FormDistribuidor from './FormDistribuidor';

const ComisionesDistribuidor = () => {
    const {
        setShowFiltro, showFiltro,
        setShowMiniModal, showMiniModal,
        setShowModal, showModal,
        setSelectedInvetario, selectedInventario
    } = useContext(ComisionesDistribuidorContext)

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
                    titulo="Comisiones / Porcentaje por Distribuidor"
                    icon="/Finanzas-icon.svg"
                />
                <InventariosLayout filtro
                    onFilter={() => setShowFiltro(true)}
                    hasFilter={!!savedFilters && Object.keys(savedFilters).length > 0}
                    add onAdd={() => { setShowMiniModal(true) }} >
                    <TableDistribuidor data={fisicos_saldos} className='w-full no-inner-border border !border-font-color/20 !rounded-[10px]' />
                </InventariosLayout>
            </div>

            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <FilterDistribuidor distribuidores={distribuidores} initialFilters={savedFilters} onChange={handleFilterChange} />
            </Modal>

            <Modal isOpen={showMiniModal} onClose={() => setShowMiniModal(false)} className='!w-3/4 md:!w-1/2 xl:!w-1/3'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Generar porcentaje distribuidor
                </h2>
                <FormDistribuidor onCancel={() => setShowMiniModal(false)} distribuidores={distribuidores} />
            </Modal>

            <Modal isOpen={showModal && selectedInventario._id !== ""} onClose={() => { setShowModal(false); setSelectedInvetario(distribuidorMock); }} className='!w-3/4 md:!w-1/2 xl:!w-1/3'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Editar porcentaje distribuidor
                </h2>
                <FormDistribuidor onCancel={() => { setShowModal(false); setSelectedInvetario(distribuidorMock); }} distribuidores={distribuidores} />
            </Modal>
        </>
    )
}

export default ComisionesDistribuidor