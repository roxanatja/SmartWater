import React, { useContext, useMemo } from 'react'
import { KardexInitialBalances, MatchedElement } from '../../../../../../type/Kardex';
import DataTable, { TableColumn } from 'react-data-table-component';
import { InventariosValoradosContext } from '../InventariosValoradosProvider';
import { formatDateTime } from '../../../../../../utils/helpers';
import moment from 'moment';
import { showGeneratePDF } from '../../../../../../utils/pdfHelper';
import { initialBalances } from './pdfTemplates';
import { useGlobalContext } from '../../../../../SmartwaterContext';

interface Props {
    onCancel?: () => void;
    elemnts: MatchedElement[];
}

const ShowInitialBalancesModal = ({ elemnts, onCancel }: Props) => {
    const { selectedInventario } = useContext(InventariosValoradosContext)
    const { setLoading } = useGlobalContext()

    const report = async () => {
        if (selectedInventario.detailsToElements.length > 0) {
            const inputs = [
                {
                    subtitle: JSON.stringify({
                        date: formatDateTime(
                            moment.utc(selectedInventario.initialBalance.registerDate).tz("America/La_Paz", true).format(),
                            'numeric', '2-digit', '2-digit', false, true)
                    }),
                    table: selectedInventario.detailsToElements.map(row => {
                        return [
                            `${row.element}`,
                            `${elemnts.find(e => (e.isProduct && row.elementId === e._id) || (e.isItem && row.elementId === ((e.matchingItems && e.matchingItems?.length > 0) ? e.matchingItems[0]._id : e._id)))?.unitMeasure?.name || "Unidad desconocida"}`,
                            `${row.quantity.toLocaleString()}`,
                            `${row.quantity.toLocaleString()}`,
                        ]
                    })
                }
            ]

            showGeneratePDF(setLoading, initialBalances, inputs)
        }
    }

    const columns: TableColumn<KardexInitialBalances['detailsToElements'][0]>[] = useMemo<TableColumn<KardexInitialBalances['detailsToElements'][0]>[]>(() => [
        {
            name: "Producto",
            selector: row => row.element,
        },
        {
            name: "Unidad",
            selector: row => elemnts.find(e => (e.isProduct && row.elementId === e._id) || (e.isItem && row.elementId === ((e.matchingItems && e.matchingItems?.length > 0) ? e.matchingItems[0]._id : e._id)))?.unitMeasure?.name || "Unidad desconocida"
        },
        {
            name: "Cantidad",
            cell: (row) => row.quantity.toLocaleString()
        },
        {
            name: "Costo unitario",
            cell: (row) => row.quantity.toLocaleString()
        },
    ], [elemnts])

    return (
        <div className="flex flex-col gap-6 justify-center items-center w-full p-6">
            <div className="flex flex-col gap-10 w-full">
                <div className="relative w-full text-center text-blue_custom font-semibold">
                    Saldos iniciales al {
                        formatDateTime(
                            moment.utc(selectedInventario.initialBalance.registerDate).tz("America/La_Paz", true).format(),
                            'numeric', '2-digit', '2-digit', false, true)
                    }

                    <div className="flex gap-4 items-center justify-end absolute -top-4 right-0 print:hidden">
                        <button type="button" className="bg-blue_bright w-20 h-12 flex items-center justify-center rounded-[30px]" onClick={() => report()}>
                            <img src="/document.svg" alt="" />
                        </button>
                    </div>
                </div>

                <DataTable columns={columns} className="w-full no-inner-border border !border-font-color/20 !rounded-[10px]"
                    data={selectedInventario.detailsToElements} noDataComponent={<div className="min-h-[150px] flex items-center justify-center">Sin productos</div>} />
            </div>
        </div>
    )
}

export default ShowInitialBalancesModal