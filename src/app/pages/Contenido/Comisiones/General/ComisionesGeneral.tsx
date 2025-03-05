import { useCallback, useContext, useEffect, useState } from 'react'
import { ComisionesGeneralContext, generalMock } from './ComisionesGeneralProvider';
import { UsersApiConector } from '../../../../../api/classes';
import InventariosLayout from '../../Inventarios/InventariosLayout/InventariosLayout';
import TableGeneral from './TableGeneral';
import { PageTitle } from '../../../components/PageTitle/PageTitle';
import { User } from '../../../../../type/User';
import Modal from '../../../EntryComponents/Modal';
import FilterGeneral from './FilterGeneral';
import FormGeneral from './FormGeneral';
import type { Comission } from '../../../../../type/Comission';
import { useGlobalContext } from '../../../../SmartwaterContext';
import moment from 'moment';
import { ComissionsApiConector } from '../../../../../api/classes/comissions';
import { IComissionGetParams } from '../../../../../api/types/comissions';
import ShowComisionesGenerales from './ShowComisionesGenerales';

const ComisionesGeneral = () => {
    const {
        setShowFiltro, showFiltro,
        setShowMiniModal, showMiniModal,
        setShowModal, showModal,
        setSelectedInvetario, selectedInventario,
        setSelectedOption, selectedOption
    } = useContext(ComisionesGeneralContext)
    const { setLoading } = useGlobalContext()

    const [currentData, setCurrentData] = useState<Comission<'general'>[]>([])
    const [allComissions, setAllComissions] = useState<Comission<'general'>[]>([])
    const [savedFilters, setSavedFilters] = useState<IComissionGetParams['filters']>({})

    const [distribuidores, setDistribuidores] = useState<User[]>([])

    useEffect(() => {
        UsersApiConector.get({ filters: { desactivated: false }, pagination: { page: 1, pageSize: 30000 } }).then(res => setDistribuidores(res?.data || []))
        ComissionsApiConector.get({ type: 'general' }).then(res => setAllComissions(res || []))
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

        const res = await ComissionsApiConector.get({ type: 'general', filters })
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
                    titulo="Comisiones / Porcentaje general"
                    icon="/Finanzas-icon.svg"
                />
                <InventariosLayout filtro
                    onFilter={() => setShowFiltro(true)}
                    hasFilter={!!savedFilters && Object.keys(savedFilters).length > 0}
                    add onAdd={() => setShowMiniModal(true)} >
                    <TableGeneral data={currentData.sort((a, b) => Number(b.code.split("-")[2]) - Number(a.code.split("-")[2]))}
                        distribuidores={distribuidores} className='w-full no-inner-border border !border-font-color/20 !rounded-[10px]' />
                </InventariosLayout>
            </div>

            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <FilterGeneral distribuidores={distribuidores} initialFilters={savedFilters} onChange={handleFilterChange}
                    percentages={Array.from(new Set(allComissions.map(d => d.percentage).sort((a, b) => a - b)))} />
            </Modal>

            <Modal isOpen={showMiniModal} onClose={() => setShowMiniModal(false)} className='!w-3/4 md:!w-1/2 xl:!w-1/3'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Generar porcentaje general
                </h2>
                <FormGeneral onCancel={() => setShowMiniModal(false)} selectedInventario={generalMock} />
            </Modal>

            <Modal isOpen={showModal && selectedInventario._id !== ""} onClose={() => { setShowModal(false); setSelectedInvetario(generalMock); }} className='!w-3/4 md:!w-1/2 xl:!w-1/3'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Editar porcentaje general
                </h2>
                <FormGeneral onCancel={() => { setShowModal(false); setSelectedInvetario(generalMock); }} selectedInventario={selectedInventario} />
            </Modal>

            <Modal isOpen={selectedOption && selectedInventario._id !== ""} onClose={() => { setSelectedOption(false); setSelectedInvetario(generalMock); }} className='!w-3/4 sm:!w-1/2'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Porcentaje general
                </h2>
                <ShowComisionesGenerales onCancel={() => { setSelectedOption(false); setSelectedInvetario(generalMock); }} selectedInventario={selectedInventario} allComissions={currentData} distribuidores={distribuidores} />
            </Modal>
        </>
    )
}

export default ComisionesGeneral