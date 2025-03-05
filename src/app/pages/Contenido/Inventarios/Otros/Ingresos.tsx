import { useCallback, useContext, useEffect, useState } from 'react';
import InventariosLayout from '../InventariosLayout/InventariosLayout'
import { InventariosOtrosContext, otroEntry } from './InventariosOtrosProvider';
import Modal from '../../../EntryComponents/Modal';
import FiltrosEntradas from './Filtros/FiltrosEntradas';
import TableOtrosIngresos from './Tables/TableOtrosIngresos';
import OtrosIngresosForm from './Modals/OtrosIngresosForm';
import { MatchedElement, OtherEntry } from '../../../../../type/Kardex';
import { KardexApiConector } from '../../../../../api/classes/kardex';
import OtrosIgresosDetails from './Modals/OtrosIgresosDetails';
import { useGlobalContext } from '../../../../SmartwaterContext';
import { IKardexOthersGetParams } from '../../../../../api/types/kardex';
import moment from 'moment-timezone';
import { ValuedPhysicalApiConector } from '../../../../../api/classes/valued-physical';

const Ingresos = () => {
    const {
        setShowFiltro, showFiltro,
        setShowModal, showModal,
        showMiniModal, setShowMiniModal,
        selectedEntry, setSelectedEntry,
        selectedOption, setSelectedOption
    } = useContext(InventariosOtrosContext)
    const { setLoading } = useGlobalContext()

    const pageSize = 10;
    const [currentData, setCurrentData] = useState<OtherEntry[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);

    const [elements, setElements] = useState<MatchedElement[]>([]);
    const [savedFilters, setSavedFilters] = useState<IKardexOthersGetParams['filters']>({})

    const handleFilterChange = (filters: any) => {
        setCurrentPage(1);
        setSavedFilters(filters);
    };

    useEffect(() => {
        KardexApiConector.getKardexElements().then(res => setElements(res?.elements || []));
    }, [])

    const getData = useCallback(async () => {
        setLoading(true)

        const filters = savedFilters ? { ...savedFilters } : {}
        if (!!filters.initialDate && !filters.finalDate) {
            filters.finalDate = moment().format("YYYY-MM-DD")
        }

        if (!filters.initialDate && !!filters.finalDate) {
            filters.initialDate = "2020-01-01"
        }

        const res = await ValuedPhysicalApiConector.getOthers({ type: 'income', filters, pagination: { page: currentPage, pageSize } })

        setCurrentData(res?.data || [])
        setTotal(res?.metadata?.total || 0)

        setLoading(false)
    }, [currentPage, savedFilters, setLoading])

    useEffect(() => {
        getData()
    }, [getData])

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
                <TableOtrosIngresos data={currentData.sort((a, b) => Number(b.code.split("-")[2]) - Number(a.code.split("-")[2]))}
                    tableClassName='no-inner-border border !border-font-color/20 !rounded-[10px]' className='w-full xl:!w-3/4' handleChangePage={setCurrentPage} totalRows={total} pageSize={pageSize} />
            </InventariosLayout>

            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <FiltrosEntradas initialFilters={savedFilters} onChange={handleFilterChange} />
            </Modal>

            <Modal isOpen={showMiniModal} onClose={() => setShowMiniModal(false)} className='!w-3/4 md:!w-1/2 xl:!w-1/3'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Registro otros ingresos
                </h2>
                <OtrosIngresosForm onCancel={() => setShowMiniModal(false)} elements={elements} />
            </Modal>

            <Modal
                isOpen={selectedEntry._id !== "" && showModal}
                onClose={() => { setSelectedEntry(otroEntry); setShowModal(false) }} className='!w-3/4 md:!w-1/2'
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Editar otros ingresos
                </h2>
                <OtrosIngresosForm onCancel={() => { setSelectedEntry(otroEntry); setShowModal(false) }} elements={elements} />
            </Modal>

            <Modal
                isOpen={selectedEntry._id !== "" && selectedOption}
                onClose={() => { setSelectedEntry(otroEntry); setSelectedOption(false) }}
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Otros ingresos
                </h2>
                <OtrosIgresosDetails onCancel={() => { setSelectedEntry(otroEntry); setSelectedOption(false) }} elements={elements} />
            </Modal>
        </>
    )
}

export default Ingresos