import { useMemo } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { OutputsReport } from '../../../../../../type/Kardex'

interface Props {
    total: string;
    data: OutputsReport['data'];
    className?: string;
}

const TableOutputsReport = ({ data, className, total }: Props) => {
    const columns: TableColumn<OutputsReport['data'][0]>[] = useMemo<TableColumn<OutputsReport['data'][0]>[]>(() => [
        // {
        //     name: "NRO",
        //     width: "7.5%",
        //     selector: row => row.nro,
        // },
        // {
        //     name: "Productos",
        //     width: "25%",
        //     selector: row => row.name || "Producto desconocido",
        // },
        // {
        //     name: "Unidad",
        //     width: "12.5%",
        //     selector: row => row.unit,
        // },
        // {
        //     name: "Cantidad",
        //     selector: row => row.quantity,
        // },
        // {
        //     name: "C.P.P",
        //     selector: row => row.weightedAverageCost,
        // },
        // {
        //     name: "Monto",
        //     selector: row => row.totalAmount,
        // },
        // {
        //     name: "",
        //     width: "4%",
        //     cell: (row) =>
        //         <div className="flex items-center justify-end w-full gap-6 pr-3">
        //             <button onClick={() => setDetailed(row)}>
        //                 <i className="fa-regular fa-file-lines text-xl" aria-hidden="true"></i>
        //             </button>
        //         </div>
        // }
    ], [])

    return (
        <>
            <div className="text-font-color w-full border !border-font-color/20 !rounded-[10px]">
                <DataTable columns={columns} className={className}
                    pagination
                    paginationPerPage={3000}
                    paginationComponent={({ currentPage, onChangePage, rowCount, rowsPerPage }) => (<>
                        <div className="flex gap-2 w-full justify-center py-4 border-t border-t-font-color/30">
                            <div className="flex items-center justify-between w-full sm:w-1/2 md:w-1/3 px-4">
                                <span className='font-semibold'>TOTAL</span>
                                <span>{total}</span>
                            </div>
                        </div>
                    </>)}
                    data={data} noDataComponent={<div className="min-h-[150px] flex items-center justify-center">Sin registros</div>} />
            </div>
        </>
    )
}

export default TableOutputsReport