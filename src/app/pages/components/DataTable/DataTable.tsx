import { flexRender, Table } from '@tanstack/react-table'

const DataTable = ({ table, className }: { table: Table<any>; className?: string }) => {
    return (
        <table className={`${className}`}>
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} className='rdt_TableHeadRow'>
                        {headerGroup.headers.map(header => (
                            <th key={header.id} colSpan={header.colSpan} className='rdt_TableHeader rdt_TableCol'>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className='rdt_TableRow'>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id} role='cell'>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
            <tfoot>
                {table.getFooterGroups().map(footerGroup => (
                    <tr key={footerGroup.id} className='rdt_TableHeadRow'>
                        {footerGroup.headers.map(header => (
                            <th key={header.id} colSpan={header.colSpan} className='rdt_TableHeader'>
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(
                                        header.column.columnDef.footer,
                                        header.getContext()
                                    )}
                            </th>
                        ))}
                    </tr>
                ))}
            </tfoot>
        </table>
    )
}

export default DataTable