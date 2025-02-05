import React, { useCallback, useContext, useMemo } from 'react'
import toast from 'react-hot-toast'
import DataTable, { TableColumn } from 'react-data-table-component'
import { formatDateTime } from '../../../../../../utils/helpers'
import { InventariosOtrosContext } from '../InventariosOtrosProvider'
import { OtherOutput } from '../../../../../../type/Kardex'
import { useGlobalContext } from '../../../../../SmartwaterContext'

interface Props {
    data: OtherOutput[];
    totalRows: number;
    pageSize: number;
    handleChangePage: React.Dispatch<React.SetStateAction<number>>
    className?: string;
    tableClassName?: string;
}

const TableOtrasSalidas = ({ data, className, tableClassName, pageSize, totalRows, handleChangePage }: Props) => {
    const { setSelectedOutput, setSelectedOption, setShowModal } = useContext(InventariosOtrosContext)
    const { loading } = useGlobalContext()

    const deleteRegistry = useCallback((id: string) => {
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
                                toast.success("Registro eliminado con exito", {
                                    position: "top-center",
                                    duration: 2000
                                });

                                //     const response = await CashRegisterApiConector.delete({ registryId: id }) as any;
                                //     if (!!response) {
                                //         if (response.mensaje) {
                                //             toast.success(response.mensaje, {
                                //                 position: "top-center",
                                //                 duration: 2000
                                //             });
                                //             window.location.reload();
                                //         } else if (response.error) {
                                //             toast.error(response.error, {
                                //                 position: "top-center",
                                //                 duration: 2000
                                //             });
                                //         }
                                //     } else {
                                //         toast.error("Error al eliminar cliente", {
                                //             position: "top-center",
                                //             duration: 2000
                                //         });
                                //     }
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


    const columns: TableColumn<OtherOutput>[] = useMemo<TableColumn<OtherOutput>[]>(() => [
        {
            name: "Fecha y hora",
            selector: row => (row.registerDate ? formatDateTime(row.registerDate, 'numeric', '2-digit', '2-digit', true, true) : "N/A"),
        },
        {
            name: "Tipo de salida",
            selector: row => row.type === 'production_delivered' ? "De producción" : "Por ajuste",
        },
        {
            name: "Comentario",
            selector: row => row.detail || "Sin comentario",
        },
        {
            name: "Cantidad",
            selector: row => row.quantity.toLocaleString(),
        },
        {
            name: "",
            width: "10%",
            cell: (row) =>
                <div className="flex items-center justify-end w-full gap-6 pr-3">
                    <button onClick={() => { setSelectedOutput(row); setSelectedOption(true) }}>
                        <i className="fa fa-eye text-blue_bright" aria-hidden="true"></i>
                    </button>
                    <button onClick={() => { setSelectedOutput(row); setShowModal(true) }}>
                        <i className="fa-solid fa-pen-to-square text-blue_bright" aria-hidden="true"></i>
                    </button>
                    <button onClick={() => deleteRegistry(row._id)}>
                        <i className="fa fa-trash text-red-500" aria-hidden="true"></i>
                    </button>
                </div>
        }
    ], [deleteRegistry, setSelectedOutput, setSelectedOption, setShowModal])

    return (
        <>
            <div className={`text-font-color ${className}`}>
                <DataTable columns={columns} className={tableClassName}
                    data={data}
                    progressPending={loading}
                    pagination={totalRows > pageSize}
                    paginationServer={totalRows > pageSize}
                    paginationPerPage={pageSize}
                    paginationTotalRows={totalRows}
                    onChangePage={(page, total) => { handleChangePage(page) }}
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

export default TableOtrasSalidas