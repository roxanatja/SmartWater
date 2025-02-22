import React, { useCallback, useContext, useEffect, useState } from 'react'
import { ComisionesDistribuidorContext, distribuidorMock } from './ComisionesDistribuidorProvider';
import { User } from '../../../../../type/User';
import { UsersApiConector } from '../../../../../api/classes';
import { PageTitle } from '../../../components/PageTitle/PageTitle';
import InventariosLayout from '../../Inventarios/InventariosLayout/InventariosLayout';
import TableDistribuidor from './TableDistribuidor';
import Modal from '../../../EntryComponents/Modal';
import FilterDistribuidor from './FilterDistribuidor';
import FormDistribuidor from './FormDistribuidor';
import { Comission } from '../../../../../type/Comission';
import { IComissionGetParams } from '../../../../../api/types/comissions';
import { ComissionsApiConector } from '../../../../../api/classes/comissions';
import { useGlobalContext } from '../../../../SmartwaterContext';
import moment from 'moment';
import FormGeneral from '../General/FormGeneral';

const ComisionesDistribuidor = () => {
    const {
        setShowFiltro, showFiltro,
        setShowMiniModal, showMiniModal,
        setShowModal, showModal,
        setSelectedInvetario, selectedInventario
    } = useContext(ComisionesDistribuidorContext)
    const { setLoading } = useGlobalContext()


    const [currentData, setCurrentData] = useState<Comission<'byuser'>[]>([])
    const [allComissions, setAllComissions] = useState<Comission<'byuser'>[]>([])
    const [savedFilters, setSavedFilters] = useState<IComissionGetParams['filters']>({})

    const [distribuidores, setDistribuidores] = useState<User[]>([])

    useEffect(() => {
        UsersApiConector.get({ filters: { desactivated: false }, pagination: { page: 1, pageSize: 30000 } }).then(res => setDistribuidores(res?.data || []))
        ComissionsApiConector.get({ type: 'byuser' }).then(res => setAllComissions(res || []))
    }, [])

    const handleFilterChange = (filters: IComissionGetParams['filters']) => {
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

        const res = await ComissionsApiConector.get({ type: 'byuser', filters })
        setCurrentData(res || [])

        setLoading(false)
    }, [setLoading, savedFilters])

    useEffect(() => {
        getData()
    }, [getData])

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
                    <TableDistribuidor data={currentData} distribuidores={distribuidores} className='w-full no-inner-border border !border-font-color/20 !rounded-[10px]' />
                </InventariosLayout>
            </div>

            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <FilterDistribuidor distribuidores={distribuidores} initialFilters={savedFilters} onChange={handleFilterChange}
                    percentages={Array.from(new Set(allComissions.map(d => d.percentage).sort((a, b) => a - b)))} />
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
                <FormGeneral onCancel={() => { setShowModal(false); setSelectedInvetario(distribuidorMock); }} selectedInventario={selectedInventario} />
            </Modal>
        </>
    )
}

export default ComisionesDistribuidor