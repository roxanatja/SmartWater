import { useMemo } from 'react'
import { OutputsReport } from '../../../../../../type/Kardex'
import { createColumnHelper, getCoreRowModel, getGroupedRowModel, useReactTable } from '@tanstack/react-table';
import DataTable from '../../../../components/DataTable/DataTable';

interface Props {
    total: string;
    data: OutputsReport['data'];
    className?: string;
}

const TableOutputsReport = ({ data, className, total }: Props) => {
    const columnsHelper = createColumnHelper<OutputsReport['data'][0]>()

    const columns = useMemo(() => [
        columnsHelper.accessor('elementName', {
            header: "DETALLE",
            footer: "TOTALES"
        }),
        columnsHelper.accessor('unitMeasure', {
            header: "UNIDAD"
        }),
        columnsHelper.group({
            header: "ENTREGADO A PRODUCCION",
            columns: [
                columnsHelper.accessor('outputProduction.quantity', {
                    header: "CANTIDAD",
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.outputProduction.quantity, 0)
                    },
                }),
                columnsHelper.accessor('outputProduction.import', {
                    header: "IMPORTE",
                    cell(props) { return `${(props.getValue() as number).toFixed(2)}` },
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.outputProduction.import, 0).toFixed(2)
                    },
                }),
            ]
        }),
        columnsHelper.group({
            header: "VENDIDO",
            columns: [
                columnsHelper.accessor('outputSales.quantity', {
                    header: "CANTIDAD",
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.outputSales.quantity, 0)
                    },
                }),
                columnsHelper.accessor('outputSales.import', {
                    header: "IMPORTE",
                    cell(props) { return `${(props.getValue() as number).toFixed(2)}` },
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.outputSales.import, 0).toFixed(2)
                    },
                }),
            ]
        }),
        columnsHelper.group({
            header: "PRESTADO",
            columns: [
                columnsHelper.accessor('outputLoans.quantity', {
                    header: "CANTIDAD",
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.outputLoans.quantity, 0)
                    },
                }),
                columnsHelper.accessor('outputLoans.import', {
                    header: "IMPORTE",
                    cell(props) { return `${(props.getValue() as number).toFixed(2)}` },
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.outputLoans.import, 0).toFixed(2)
                    },
                }),
            ]
        }),
        columnsHelper.group({
            header: "AJUSTE SALIDAS",
            columns: [
                columnsHelper.accessor('outputAdjustment.quantity', {
                    header: "CANTIDAD",
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.outputAdjustment.quantity, 0)
                    },
                }),
                columnsHelper.accessor('outputAdjustment.import', {
                    header: "IMPORTE",
                    cell(props) { return `${(props.getValue() as number).toFixed(2)}` },
                    footer(props) {
                        return props.table.getFilteredRowModel().rows.reduce((sum, r) => sum += r.original.outputAdjustment.import, 0).toFixed(2)
                    },
                }),
            ]
        }),
        columnsHelper.group({
            header: "TOTAL",
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

    const table = useReactTable<OutputsReport['data'][0]>({
        columns,
        data,
        getCoreRowModel: getCoreRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
    })

    return (
        <>
            <div className="text-font-color w-full border !border-font-color/20 !rounded-[10px]">
                <DataTable table={table} className={className} colsNumber={12} />
            </div>
        </>
    )
}

export default TableOutputsReport