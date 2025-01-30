import { useMemo, useState } from 'react'
import DataTable, { TableColumn } from 'react-data-table-component'
import { KardexElement } from '../../../../../../type/Kardex'
import Modal from '../../../../EntryComponents/Modal';
import KardexElementModal from '../Modals/KardexElementModal';

interface Props {
    total: string;
    data: KardexElement[];
    className?: string;
}

const TableBalancesReport = ({ data, className, total }: Props) => {
    const [detailed, setDetailed] = useState<KardexElement | null>(null)

    const columns: TableColumn<KardexElement>[] = useMemo<TableColumn<KardexElement>[]>(() => [
        {
            name: "NRO",
            width: "7.5%",
            selector: row => row.nro,
        },
        {
            name: "Productos",
            width: "25%",
            selector: row => row.name || "Producto desconocido",
        },
        {
            name: "Unidad",
            width: "12.5%",
            selector: row => row.unit,
        },
        {
            name: "Cantidad",
            selector: row => row.quantity,
        },
        {
            name: "C.P.P",
            selector: row => row.weightedAverageCost,
        },
        {
            name: "Monto",
            selector: row => row.totalAmount,
        },
        {
            name: "",
            width: "4%",
            cell: (row) =>
                <div className="flex items-center justify-end w-full gap-6 pr-3">
                    <button onClick={() => setDetailed(row)}>
                        <i className="fa-regular fa-file-lines text-xl" aria-hidden="true"></i>
                    </button>
                </div>
        }
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

            <Modal isOpen={!!detailed} onClose={() => { setDetailed(null) }} className='!w-[95%] sm:!w-10/12'>
                {
                    detailed && <>
                        <h2 className="text-blue_custom font-semibold p-6 pb-0 z-30 bg-main-background">
                            Kardex físico valorado - {detailed.name}
                        </h2>
                        <KardexElementModal kardexElement={detailed} />
                    </>
                }
            </Modal>
        </>
    )
}

export default TableBalancesReport