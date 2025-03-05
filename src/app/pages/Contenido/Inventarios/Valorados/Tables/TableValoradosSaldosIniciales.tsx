import React, { useCallback, useContext, useMemo } from 'react'
import toast from 'react-hot-toast'
import DataTable, { TableColumn } from 'react-data-table-component'
import { formatDateTime } from '../../../../../../utils/helpers'
import { InventariosValoradosContext } from '../InventariosValoradosProvider'
import { KardexInitialBalances } from '../../../../../../type/Kardex'
import moment from 'moment-timezone'
import { ValuedPhysicalApiConector } from '../../../../../../api/classes/valued-physical'

interface Props {
    data: KardexInitialBalances[];
    className?: string;
}

const TableValoradosSaldosIniciales = ({ data, className }: Props) => {
    const { setSelectedInvetario, setSelectedOption, setShowModal } = useContext(InventariosValoradosContext)

    const deleteRegistry = useCallback(() => {
        toast.error(
            (t) => (
                <div>
                    <p className="mb-4 text-center text-[#888]">
                        Se <b>eliminarán</b> los registros de saldos iniciales, <br /> pulsa <b>Proceder</b> para continuar
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
                                const response = await ValuedPhysicalApiConector.deleteInitialBalances();
                                if (!!response) {
                                    if (response.message) {
                                        toast.success(response.message, {
                                            position: "top-center",
                                            duration: 2000
                                        });
                                        window.location.reload();
                                    } else {
                                        toast.error("Error al eliminar los saldos iniciales", {
                                            position: "top-center",
                                            duration: 2000
                                        });
                                    }
                                } else {
                                    toast.error("Error al eliminar los saldos iniciales", {
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


    const columns: TableColumn<KardexInitialBalances>[] = useMemo<TableColumn<KardexInitialBalances>[]>(() => [
        {
            name: "Hora y fecha de registro",
            selector: row => (row.initialBalance.registerDate ? formatDateTime(
                moment.utc(row.initialBalance.registerDate).tz("America/La_Paz", true).format(),
                'numeric', '2-digit', '2-digit', true, true) : "N/A"),
        },
        {
            name: "Administrador",
            selector: row => row.initialBalance.user?.[0].fullName || "Distribuidor desconocido",
        },
        {
            name: "Código",
            selector: row => row.initialBalance.code,
        },
        {
            name: "Número de documento",
            selector: row => row.initialBalance.documentNumber,
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
                    <button onClick={() => deleteRegistry()}>
                        <i className="fa fa-trash text-red-500" aria-hidden="true"></i>
                    </button>
                </div>
        }
    ], [deleteRegistry, setSelectedInvetario, setSelectedOption, setShowModal])

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

export default TableValoradosSaldosIniciales