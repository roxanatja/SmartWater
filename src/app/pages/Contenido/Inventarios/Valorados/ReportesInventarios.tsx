import { useState } from 'react';
import InventariosLayout from '../InventariosLayout/InventariosLayout'
import FiltrosReportesInventarios, { IInitialBalancesFilters } from './Filtros/FiltrosReportesInventarios';
import Modal from '../../../EntryComponents/Modal';
import BalancesReportModal from './Modals/BalancesReportModal';
import moment from 'moment';
import EntriesReportModal from './Modals/EntriesReportModal';
import OutputsReportModal from './Modals/OutputsReportModal';

const ReportesInventarios = () => {
    const [showBalancesReport, setShowBalancesReport] = useState<boolean>(false)
    const [showEntriesReport, setShowEntriesReport] = useState<boolean>(false)
    const [showOutputsReport, setShowOutputsReport] = useState<boolean>(false)

    const [selectedDate, setSelectedDate] = useState<string>(moment().format("YYYY-MM-DD"))


    const handleFilterChange = (filters: IInitialBalancesFilters) => {
        setShowBalancesReport(false)
        setShowEntriesReport(false)
        setShowOutputsReport(false)

        setSelectedDate(filters.toDate || moment().format("YYYY-MM-DD"))

        switch (filters.type) {
            case 'entry':
                setShowEntriesReport(true)
                break;
            case 'output':
                setShowOutputsReport(true)
                break;
            case 'balance':
                setShowBalancesReport(true)
                break;
        }

    };

    return (
        <>
            <InventariosLayout swith switchDetails={[
                {
                    isSelected: false,
                    text: "Saldos iniciales",
                    url: "/Finanzas/Inventarios/Valorados/Saldos"
                },
                {
                    isSelected: true,
                    text: "Reportes de inventario",
                    url: "/Finanzas/Inventarios/Valorados/ReporteInventario"
                },
            ]}>
                <FiltrosReportesInventarios initialFilters={{}} onChange={handleFilterChange} />
            </InventariosLayout>

            <Modal isOpen={showBalancesReport} onClose={() => { setShowBalancesReport(false); setSelectedDate(moment().format("YYYY-MM-DD")) }} className='!w-[95%] sm:!w-3/4'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 z-30 bg-main-background">
                    Reporte saldos físicos valorados
                </h2>
                <BalancesReportModal toDate={selectedDate} />
            </Modal>
            <Modal isOpen={showEntriesReport} onClose={() => { setShowEntriesReport(false); setSelectedDate(moment().format("YYYY-MM-DD")) }} className='!w-[95%] sm:!w-3/4'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 z-30 bg-main-background">
                    Reporte entradas físicos valorados
                </h2>
                <EntriesReportModal toDate={selectedDate} />
            </Modal>
            <Modal isOpen={showOutputsReport} onClose={() => { setShowOutputsReport(false); setSelectedDate(moment().format("YYYY-MM-DD")) }} className='!w-[95%] sm:!w-3/4'>
                <h2 className="text-blue_custom font-semibold p-6 pb-0 z-30 bg-main-background">
                    Reporte salidas físicos valorados
                </h2>
                <OutputsReportModal toDate={selectedDate} />
            </Modal>
        </>
    )
}

export default ReportesInventarios