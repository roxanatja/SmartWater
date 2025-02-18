import React, { useCallback, useContext, useEffect, useMemo } from 'react'
import { InventariosFisicosContext } from '../InventariosFisicosProvider'
import toast from 'react-hot-toast'
import DataTable, { TableColumn } from 'react-data-table-component'
import { formatDateTime } from '../../../../../../utils/helpers'
import { PhysicalBalanceToShow } from '../../../../../../type/PhysicalInventory'
import { PhysicalInventoryApiConector } from '../../../../../../api/classes/physical-inventory'

interface Props {
    data: PhysicalBalanceToShow[];
    className?: string;
}

const TableFisicosSaldosIniciales = ({ data, className }: Props) => {
    const { setSelectedInvetario, setSelectedOption, setShowModal } = useContext(InventariosFisicosContext)

    const deleteRegistry = useCallback((row: PhysicalBalanceToShow) => {
        toast.error(
            (t) => (
                <div>
                    <p className="mb-4 text-center text-[#888]">
                        Se <b>eliminará</b> este registro, <br /> pulsa <b>Proceder</b> para continuar
                    </p>
                    <div className="flex justify-center">
                        <button
                            className="bg-red-500 px-3 py-1 rounded-lg ml-2 text-white"
                            onClick={() => { toast.dismiss(t.id); }}
                        >
                            Cancelar
                        </button>
                        <button
                            className="bg-blue_custom px-3 py-1 rounded-lg ml-2 text-white"
                            onClick={async () => {
                                toast.dismiss(t.id);
                                const response = await PhysicalInventoryApiConector.delete({
                                    data: {
                                        code: row.code,
                                        registerDate: row.showDate.format("YYYY-MM-DDTHH:mm"),
                                        user: row.user._id,
                                        elements: row.saldo.map(s => {
                                            if (s.item) { return { item: s.item._id } }
                                            if (s.product) { return { product: s.product._id } }
                                            return { product: s.elementId }
                                        })
                                    }
                                }) as any;
                                if (!!response) {
                                    if (response.mensaje) {
                                        toast.success(response.mensaje, {
                                            position: "top-center",
                                            duration: 2000
                                        });
                                        // window.location.reload();
                                    } else if (response.error) {
                                        toast.error(response.error, {
                                            position: "top-center",
                                            duration: 2000
                                        });
                                    }
                                } else {
                                    toast.error("Error al eliminar cliente", {
                                        position: "top-center",
                                        duration: 2000
                                    });
                                }
                            }}
                        >
                            Proceder
                        </button>
                    </div>
                </div >
            ),
            {
                className: "shadow-md dark:shadow-slate-400 border border-slate-100 bg-main-background",
                icon: null,
                position: "top-center"
            }
        );
    }, [])

    useEffect(() => {

    }, [data])


    const columns: TableColumn<PhysicalBalanceToShow>[] = useMemo<TableColumn<PhysicalBalanceToShow>[]>(() => [
        {
            name: "Hora y fecha de registro",
            selector: row => (row.showDate ? formatDateTime(row.showDate.format("YYYY-MM-DDTHH:mm"), 'numeric', '2-digit', '2-digit', true, true) : "N/A"),
        },
        {
            name: "Usuario",
            selector: row => `${row.user.name || "Distribuidor desconocido"} ${row.user.isAdmin ? "(Administrador)" : ""}`,
        },
        {
            name: "Código",
            selector: row => row.code,
        },
        {
            name: "",
            width: "20%",
            cell: (row) =>
                <div className="flex items-center justify-end w-full gap-6 pr-3">
                    <button onClick={() => { setSelectedInvetario(row); setSelectedOption(true) }}>
                        <i className="fa fa-eye text-blue_bright" aria-hidden="true"></i>
                    </button>
                    <button onClick={() => { setSelectedInvetario(row); setShowModal(true) }}>
                        <i className="fa-solid fa-pen-to-square text-blue_bright" aria-hidden="true"></i>
                    </button>
                    <button onClick={() => deleteRegistry(row)}>
                        <i className="fa fa-trash text-red-500" aria-hidden="true"></i>
                    </button>
                </div>
        }
    ], [deleteRegistry, setSelectedInvetario, setSelectedOption, setShowModal])

    return (
        <>
            <div className="text-font-color">
                <DataTable responsive={true} columns={columns} className={className}
                    data={data}
                    pagination={data.length > 10}
                    paginationPerPage={10}
                    noDataComponent={<div className="min-h-[150px] flex items-center justify-center">Sin registros</div>}
                    paginationComponent={({ currentPage, onChangePage, rowCount, rowsPerPage }) => (<>
                        <div className="flex gap-2 w-full justify-end mt-2">
                            <>
                                {/* Probably manage the pagination in the route */}
                                <div>
                                    <button
                                        type="button"
                                        className="bg-blue-600 shadow-xl disabled:bg-gray-500 disabled:cursor-not-allowed px-2 py-0.5 rounded-sm"
                                        onClick={() => onChangePage(currentPage - 1, rowCount)}
                                        disabled={currentPage === 1}
                                    >
                                        <i className="fa-solid fa-angle-left text-white"></i>
                                    </button>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-paginado">{`${currentPage} de ${Math.ceil(rowCount / rowsPerPage)} `}</span>
                                </div>
                                <div>
                                    <button
                                        type="button"
                                        className="bg-blue-600 shadow-xl disabled:bg-gray-500 disabled:cursor-not-allowed px-2 py-0.5 rounded-sm"
                                        onClick={() => onChangePage(currentPage + 1, rowCount)}
                                        disabled={currentPage === Math.ceil(rowCount / rowsPerPage)}
                                    >
                                        <i className="fa-solid fa-angle-right text-white"></i>
                                    </button>
                                </div>
                            </>
                        </div>
                    </>)} />
            </div>
        </>
    )
}

export default TableFisicosSaldosIniciales