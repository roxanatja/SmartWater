import { useMemo } from 'react'
import { EntrysReport } from '../../../../../../type/Kardex'
import { createColumnHelper, getCoreRowModel, getGroupedRowModel, useReactTable } from '@tanstack/react-table';
import DataTable from '../../../../components/DataTable/DataTable';

interface Props {
    total: string;
    data: EntrysReport['data'];
    className?: string;
}

const TableEntriesReport = ({ data, className, total }: Props) => {
    const columnsHelper = createColumnHelper<EntrysReport['data'][0]>()

    const columns = useMemo(() => [
        columnsHelper.accessor('elementName', {
            header: "DETALLE",
            footer: "TOTALES"
        }),
        columnsHelper.accessor('unitMeasure', {
            header: "UNIDAD"
        }),
        columnsHelper.group({
            header: "SALDOS INICIALES",
            columns: [
                columnsHelper.accessor('initialBalance.quantity', {
                    header: "CANTIDAD",
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.initialBalance.quantity, 0)
                    },
                }),
                columnsHelper.accessor('initialBalance.import', {
                    header: "IMPORTE",
                    cell(props) { return `${(props.getValue() as number).toFixed(2)}` },
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.initialBalance.import, 0).toFixed(2)
                    },
                }),
            ]
        }),
        columnsHelper.group({
            header: "RECIBIDO DE PRODUCCION",
            columns: [
                columnsHelper.accessor('inputReceivedProduction.quantity', {
                    header: "CANTIDAD",
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.inputReceivedProduction.quantity, 0)
                    },
                }),
                columnsHelper.accessor('inputReceivedProduction.import', {
                    header: "IMPORTE",
                    cell(props) { return `${(props.getValue() as number).toFixed(2)}` },
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.inputReceivedProduction.import, 0).toFixed(2)
                    },
                }),
            ]
        }),
        columnsHelper.group({
            header: "COMPRA DE PROVEEDORES",
            columns: [
                columnsHelper.accessor('inputReceivedProduction.quantity', {
                    header: "CANTIDAD",
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.inputReceivedProduction.quantity, 0)
                    },
                }),
                columnsHelper.accessor('inputReceivedProduction.import', {
                    header: "IMPORTE",
                    cell(props) { return `${(props.getValue() as number).toFixed(2)}` },
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.inputReceivedProduction.import, 0).toFixed(2)
                    },
                }),
            ]
        }),
        columnsHelper.group({
            header: "DEVUELTO DE CLIENTES",
            columns: [
                columnsHelper.accessor('inputReturnClients.quantity', {
                    header: "CANTIDAD",
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.inputReturnClients.quantity, 0)
                    },
                }),
                columnsHelper.accessor('inputReturnClients.import', {
                    header: "IMPORTE",
                    cell(props) { return `${(props.getValue() as number).toFixed(2)}` },
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.inputReturnClients.import, 0).toFixed(2)
                    },
                }),
            ]
        }),
        columnsHelper.group({
            header: "AJUSTE INGRESOS",
            columns: [
                columnsHelper.accessor('inputAdjustment.quantity', {
                    header: "CANTIDAD",
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.inputAdjustment.quantity, 0)
                    },
                }),
                columnsHelper.accessor('inputAdjustment.import', {
                    header: "IMPORTE",
                    cell(props) { return `${(props.getValue() as number).toFixed(2)}` },
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.inputAdjustment.import, 0).toFixed(2)
                    },
                }),
            ]
        }),
        columnsHelper.group({
            header: "TOTAL INGRESOS",
            columns: [
                columnsHelper.accessor('totalQuantitys', {
                    header: "CANTIDAD",
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.totalQuantitys, 0)
                    },
                }),
                columnsHelper.accessor('totalImports', {
                    header: "IMPORTE",
                    cell(props) { return `${(props.getValue() as number).toFixed(2)}` },
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.totalImports, 0).toFixed(2)
                    },
                }),
            ]
        }),
    ], [columnsHelper])

    const table = useReactTable<EntrysReport['data'][0]>({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
    })

    return (
        <>
            <div className="text-font-color w-full border !border-font-color/20 !rounded-[10px]">
                <DataTable table={table} className={className} colsNumber={14} />
            </div>
        </>
    )
}

export default TableEntriesReport