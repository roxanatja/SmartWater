import { useMemo } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import { IFormattedResults } from "../ReportesResultadosGraficos";

const TablaReporteResultados = ({ mode, data, headers, className }: {
    mode: 'range' | 'month';
    data: IFormattedResults[];
    headers: string[];
    className?: string;
}) => {
    console.log(data)

    const columns: TableColumn<IFormattedResults>[] = useMemo<TableColumn<IFormattedResults>[]>(() => {
        return headers.map<TableColumn<IFormattedResults>>(h => ({
            name: h,
            selector: row => {
                if (h === "") { return row.title }
                else { return row.values.find(v => v.date === h)?.value || 0 }
            }
        }))
    }, [headers])

    return (
        <>
            <div className="text-font-color">
                <DataTable columns={columns} className={className}
                    striped
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
    );
};

export { TablaReporteResultados }