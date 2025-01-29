import { useMemo } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { KardexMovement } from '../../../../../../type/Kardex'
import { formatDateTime } from '../../../../../../utils/helpers';
import './TableKardexDetails.css'


interface Props {
    data: KardexMovement[];
    className?: string;
}

const TableKardexDetails = ({ data, className }: Props) => {
    const columns: TableColumn<KardexMovement>[] = useMemo<TableColumn<KardexMovement>[]>(() => [
        {
            name: "DETALLE",
            selector: row => row.detail,
        },
        {
            name: "FECHA",
            cell: row => <span className='whitespace-nowrap'>{formatDateTime(row.registerDate, 'numeric', '2-digit', '2-digit', false, true)}</span>,
        },
        {
            name: "DOC",
            selector: row => row.documentNumber,
        },
        {
            name: "CANTIDAD ENTRADA",
            selector: row => row.inputQuantity,
        },
        {
            name: "P.U",
            selector: row => row.unitPriceInput,
        },
        {
            name: "IMPORTE ENTRADA",
            selector: row => row.inputImport,
        },
        {
            name: "CANTIDAD SALIDA",
            selector: row => row.outputQuantity,
        },
        {
            name: "P.U",
            selector: row => row.unitPriceOutput,
        },
        {
            name: "IMPORTE SALIDA",
            selector: row => row.outputImport,
        },
        {
            name: "SALDO CANTIDAD",
            selector: row => row.balanceAmount,
        },
        {
            name: "C.P.P",
            selector: row => row.weightedAverageCost,
        },
        {
            name: "SALDO IMPORTE",
            selector: row => row.balanceImport,
        }
    ], [])

    return (
        <>
            <div className="text-font-color w-full border !border-font-color/20 !rounded-[10px]">
                <DataTable columns={columns} className={className}
                    data={data} noDataComponent={<div className="min-h-[150px] flex items-center justify-center">Sin registros</div>} />
            </div>
        </>
    )
}

export default TableKardexDetails