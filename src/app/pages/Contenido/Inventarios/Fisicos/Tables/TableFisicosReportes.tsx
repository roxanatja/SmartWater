import React, { useCallback, useContext, useMemo } from 'react'
import { IMockInventories } from '../../mock-data'
import { InventariosFisicosContext } from '../InventariosFisicosProvider'
import toast from 'react-hot-toast'
import DataTable, { TableColumn } from 'react-data-table-component'
import { formatDateTime } from '../../../../../../utils/helpers'
import { PhysiscalGeneratedReport } from '../../../../../../type/PhysicalInventory'
import { User } from '../../../../../../type/User'

interface Props {
    data: PhysiscalGeneratedReport[];
    distribuidores: User[];
    className?: string;
}

const TableFisicosReportes = ({ data, className, distribuidores }: Props) => {
    const { setSelectedInvetario, setSelectedOption } = useContext(InventariosFisicosContext)

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


    const columns: TableColumn<PhysiscalGeneratedReport>[] = useMemo<TableColumn<PhysiscalGeneratedReport>[]>(() => [
        {
            name: "Fecha",
            width: "17.5%",
            selector: row => (row.registerDate ? formatDateTime(row.registerDate, 'numeric', '2-digit', '2-digit', true, true) : "N/A"),
        },
        // {
        //     name: "Al",
        //     width: "17.5%",
        //     selector: row => (row.finalDate ? formatDateTime(row.finalDate, 'numeric', '2-digit', '2-digit', true, true) : "N/A"),
        // },
        {
            name: "Usuario",
            width: "25%",
            selector: row => {
                const dist = distribuidores.find(u => u._id === row.user)
                return `${dist?.fullName || "Distribuidor desconocido"} ${dist?.role === 'admin' ? "(Admistrador)" : ""}`
            },
        },
        // {
        //     name: "Sistema",
        //     selector: row => row.system.toLocaleString(),
        // },
        // {
        //     name: "Diferencia",
        //     selector: row => row.difference.toLocaleString(),
        // },
        // {
        //     name: "Estado",
        //     selector: row => row.status ? "Generado" : "Generado",
        // },
        {
            name: "",
            width: "7%",
            cell: (row) =>
                <div className="flex items-center justify-end w-full gap-6">
                    <button onClick={() => { setSelectedInvetario(row); setSelectedOption(true) }}>
                        <i className="fa fa-eye text-blue_bright" aria-hidden="true"></i>
                    </button>
                    <button onClick={() => deleteRegistry(row._id)}>
                        <i className="fa fa-trash text-red-500" aria-hidden="true"></i>
                    </button>
                </div>
        }
    ], [deleteRegistry, setSelectedInvetario, setSelectedOption])

    return (
        <>
            <div className="text-font-color">
                <DataTable columns={columns} className={className}
                    data={data}
                    pagination={data.length > 10}
                    paginationPerPage={5}
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

export default TableFisicosReportes