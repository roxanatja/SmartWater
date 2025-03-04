import { useCallback, useContext, useEffect, useState } from 'react';
import InventariosLayout from '../InventariosLayout/InventariosLayout'
import { InventariosOtrosContext, otroOutput } from './InventariosOtrosProvider';
import Modal from '../../../EntryComponents/Modal';
import FiltrosSalidas from './Filtros/FiltrosSalidas';
import TableOtrasSalidas from './Tables/TableOtrasSalidas';
import OtrasSalidasForm from './Modals/OtrasSalidasForm';
import { KardexApiConector } from '../../../../../api/classes/kardex';
import { MatchedElement, OtherOutput } from '../../../../../type/Kardex';
import { IKardexOthersGetParams } from '../../../../../api/types/kardex';
import { useGlobalContext } from '../../../../SmartwaterContext';
import OtrasSalidasDetails from './Modals/OtrasSalidasDetails';
import { ValuedPhysicalApiConector } from '../../../../../api/classes/valued-physical';

const Salidas = () => {
    const {
        setShowFiltro, showFiltro,
        setShowModal, showModal,
        showMiniModal, setShowMiniModal,
        selectedOutput, setSelectedOutput,
        selectedOption, setSelectedOption
    } = useContext(InventariosOtrosContext)
    const { setLoading } = useGlobalContext()

    const pageSize = 10;
    const [currentData, setCurrentData] = useState<OtherOutput[]>([])
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

        const res = await ValuedPhysicalApiConector.getOthers({ type: 'exits', filters: savedFilters, pagination: { page: currentPage, pageSize } })

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
                        isSelected: false,
                        text: "Otros ingresos de almacén",
                        url: "/Finanzas/Inventarios/Otros/Ingresos"
                    },
                    {
                        isSelected: true,
                        text: "Otras salidas de almacén",
                        url: "/Finanzas/Inventarios/Otros/Salidas"
                    },
                ]} add onAdd={() => setShowMiniModal(true)}>
                <TableOtrasSalidas data={currentData.sort((a, b) => Number(b.code.split("-")[2]) - Number(a.code.split("-")[2]))}
                    tableClassName='no-inner-border border !border-font-color/20 !rounded-[10px]' className='w-full xl:!w-3/4' handleChangePage={setCurrentPage} totalRows={total} pageSize={pageSize} />
            </InventariosLayout>

            <Modal isOpen={showFiltro} onClose={() => setShowFiltro(false)}>
                <FiltrosSalidas initialFilters={savedFilters} onChange={handleFilterChange} />
            </Modal>

            <Modal isOpen={showMiniModal} onClose={() => setShowMiniModal(false)} className='!w-3/4 md:!w-1/2 xl:!w-1/3'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Registro otras salidas
                </h2>
                <OtrasSalidasForm onCancel={() => setShowMiniModal(false)} elements={elements} />
            </Modal>

            <Modal className='!w-3/4 md:!w-1/2 xl:!w-1/3'
                isOpen={selectedOutput._id !== "" && showModal}
                onClose={() => { setSelectedOutput(otroOutput); setShowModal(false) }}
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Editar otras salidas
                </h2>
                <OtrasSalidasForm onCancel={() => { setSelectedOutput(otroOutput); setShowModal(false) }} elements={elements} />
            </Modal>

            <Modal
                isOpen={selectedOutput._id !== "" && selectedOption}
                onClose={() => { setSelectedOutput(otroOutput); setSelectedOption(false) }}
            >
                <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
                    Otras salidas
                </h2>
                <OtrasSalidasDetails onCancel={() => { setSelectedOutput(otroOutput); setSelectedOption(false) }} elements={elements} />
            </Modal>
        </>
    )
}

export default Salidas