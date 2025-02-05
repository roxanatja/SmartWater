import { flexRender, Table } from '@tanstack/react-table'
import './DataTable.css'
import { CSSProperties } from 'react';

const DataTable = ({ table, className, colsNumber }: {
    table: Table<any>;
    className?: string;
    colsNumber: number
}) => {
    return (
        <div className={`${className} table-container`} >
            <div className={`table-wrapper`} >
                <div role='table'>
                    <div role='rowgroup'>
                        {table.getHeaderGroups().map(headerGroup => (
                            <div key={headerGroup.id} className={`rdt_TableHeadRow`} style={{ "--columns": `${colsNumber}` } as CSSProperties}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <div key={header.id} className={`rdt_TableHeader rdt_TableCol ${header.colSpan > 1 ? `col-span-${header.colSpan}` : ""}`}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </div>
                                    )
                                })}
                            </div>
                        ))}
                    </div>
                    <div role='rowgroup'>
                        {table.getRowModel().rows.map(row => (
                            <div key={row.id} className='rdt_TableRow' role='row'>
                                {row.getVisibleCells().map(cell => (
                                    <div key={cell.id} role='cell'>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                    <div role='rowgroup'>
                        {table.getFooterGroups()[0] &&
                            <div className='rdt_TableFooterRow' role='row'>
                                {table.getFooterGroups()[0].headers.map(footer => (
                                    <div key={footer.id} role='cell' className='rdt_TableCol font-semibold'>
                                        {footer.isPlaceholder
                                            ? null
                                            : flexRender(
                                                footer.column.columnDef.footer,
                                                footer.getContext()
                                            )}
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DataTable