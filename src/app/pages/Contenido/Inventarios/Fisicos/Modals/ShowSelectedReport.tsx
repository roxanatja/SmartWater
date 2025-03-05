import React, { useContext, useMemo } from 'react'
import { InventariosFisicosContext } from '../InventariosFisicosProvider';
import { useGlobalContext } from '../../../../../SmartwaterContext';
import DataTable, { TableColumn } from 'react-data-table-component';
import { PhysiscalGeneratedReport } from '../../../../../../type/PhysicalInventory';
import { MatchedElementRoot } from '../../../../../../type/Kardex';
import { formatDateTime } from '../../../../../../utils/helpers';
import { User } from '../../../../../../type/User';
import { showGeneratePDF } from '../../../../../../utils/pdfHelper';
import { reportsPhysicalTemplate } from './pdfTemplates';

interface Props {
    onCancel: VoidFunction;
    elements: MatchedElementRoot[];
    distribuidores: User[];
}

const ShowSelectedReport = ({ onCancel, elements, distribuidores }: Props) => {
    const { selectedReport } = useContext(InventariosFisicosContext)
    const { setLoading } = useGlobalContext()

    const columns: TableColumn<PhysiscalGeneratedReport['elements'][0]>[] = useMemo<TableColumn<PhysiscalGeneratedReport['elements'][0]>[]>(() => [
        {
            name: "Producto",
            width: "25%",
            selector: row => elements.find(e => e._id === (row.product || row.item || ""))?.name || "Producto desconocido",
        },
        {
            name: "Saldos iniciales",
            width: "12.5%",
            selector: row => row.initialBalance || 0,
        },
        {
            name: "Stock vendidos",
            selector: row => row.stockSale,
        },
        {
            name: "Stock prestado",
            selector: row => row.stockLoan,
        },
        {
            name: "Devuelto",
            selector: row => (row.returnClient || 0),
        },
        {
            name: "Saldo sistema",
            selector: row => row.ssg || 0,
        },
        {
            name: "Saldo distribuidor",
            cell: row => row.ssd || 0,
        },
        {
            name: "Diferencia",
            selector: row => row.diff || 0,
        },
    ], [elements])

    const report = () => {
        if (selectedReport._id !== "") {
            const inputs = [
                {
                    date: JSON.stringify({ date: (selectedReport.registerDate ? formatDateTime(selectedReport.registerDate, 'numeric', '2-digit', '2-digit', true, true) : "N/A") }),
                    distribuidor: JSON.stringify({ distribuidor: `${distribuidores.find(u => u._id === selectedReport.user)?.fullName || "Distribuidor desconocido"} ${distribuidores.find(u => u._id === selectedReport.user)?.role === 'admin' ? "(Adiministrador)" : ""}` }),
                    table: selectedReport.elements.map(row => ([
                        `${elements.find(e => e._id === (row.product || row.item || ""))?.name || "Producto desconocido"}`,
                        `${row.initialBalance || 0}`,
                        `${row.stockSale}`,
                        `${row.stockLoan}`,
                        `${(row.returnClient || 0)}`,
                        `${row.ssg || 0}`,
                        `${row.ssd || 0}`,
                        `${row.diff || 0}`,
                    ]))
                }
            ]

            showGeneratePDF(setLoading, reportsPhysicalTemplate, inputs)
        }
    }

    return (
        <div className="flex flex-col gap-6 w-full p-6 relative text-sm">
            <div className="flex gap-4 items-center justify-end absolute top-4 right-4 print:hidden">
                <button type="button" className="bg-blue_bright w-20 h-12 flex items-center justify-center rounded-[30px]" onClick={() => report()}>
                    <img src="/document.svg" alt="" />
                </button>
            </div>


            <div className="mt-14 flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                    <p>Fecha: {(selectedReport.registerDate ? formatDateTime(selectedReport.registerDate, 'numeric', '2-digit', '2-digit', true, true) : "N/A")}</p>
                    <p>Distribuidor: {(() => {
                        const dist = distribuidores.find(u => u._id === selectedReport.user)
                        return `${dist?.fullName || "Distribuidor desconocido"} ${dist?.role === 'admin' ? "(Admistrador)" : ""}`
                    })()}</p>
                </div>

                <div className="text-font-color w-full border !border-font-color/20 !rounded-[10px]">
                    <DataTable columns={columns} data={selectedReport.elements} className='no-inner-border'
                        noDataComponent={<div className="min-h-[150px] flex items-center justify-center">Sin registros</div>} />
                </div>

                <div className="w-full sticky bottom-0 bg-main-background h-full z-50 text-base">
                    <div className="py-4 flex flex-row gap-4 items-center justify-center px-6 max-w-[250px] mx-auto">
                        <button
                            onClick={onCancel}
                            className="w-full bg-blue_bright py-2 rounded-full text-white font-bold shadow-xl"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ShowSelectedReport