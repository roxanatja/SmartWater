import { useMemo } from 'react'
import { EntrysReport } from '../../../../../../type/Kardex'
import { ColumnDef, createColumnHelper, getCoreRowModel, getGroupedRowModel, useReactTable } from '@tanstack/react-table';
import DataTable from '../../../../components/DataTable/DataTable';

interface Props {
    total: string;
    data: EntrysReport['data'];
    className?: string;
}

const TableEntriesReport = ({ data, className, total }: Props) => {
    const columnsHelper = createColumnHelper<EntrysReport['data'][0]>()

    const columns: ColumnDef<EntrysReport['data'][0]>[] = useMemo<ColumnDef<EntrysReport['data'][0]>[]>(() => [
        // columnsHelper.accessor('elementName', {
            
        // })
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
                <DataTable table={table} className={className} />
                {/* <DataTable columns={columns} className={className}
                    responsive
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
                    data={data} noDataComponent={<div className="min-h-[150px] flex items-center justify-center">Sin registros</div>} /> */}
            </div>
        </>
    )
}

export default TableEntriesReport