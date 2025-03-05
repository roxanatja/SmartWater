import React, { useMemo } from 'react'
import { Comission } from '../../../../../type/Comission'
import { formatDateTime } from '../../../../../utils/helpers';
import moment from 'moment-timezone';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useGlobalContext } from '../../../../SmartwaterContext';
import { User } from '../../../../../type/User';
import { showGeneratePDF } from '../../../../../utils/pdfHelper';
import { byUserTemplate } from '../pdfTemplates';

interface Props {
    allComissions: Comission<'byuser'>[];
    selectedInventario: Comission<'byuser'>;
    distribuidores: User[];
    onCancel: () => void
}

const ShowComisionesDistribuidor = ({ allComissions, selectedInventario, distribuidores, onCancel }: Props) => {
    const { setLoading } = useGlobalContext()

    const report = async () => {
        const array = allComissions.filter(c => c.code === selectedInventario.code)

        if (array.length > 0) {
            const inputs = [
                {
                    dates: JSON.stringify({
                        date_init: formatDateTime(
                            moment.utc(selectedInventario.initialDate).tz("America/La_Paz", true).format(),
                            'numeric', '2-digit', '2-digit', false, true),
                        date_end: formatDateTime(
                            moment.utc(selectedInventario.initialDate).tz("America/La_Paz", true).format(),
                            'numeric', '2-digit', '2-digit', false, true)
                    }),
                    table: array.map(row => {
                        return [
                            `${distribuidores.find(d => d._id === row.user._id)?.fullName || "Distribuidor desconocido"} ${row.user.role === 'admin' ? "(Administrador)" : ""}`,
                            `${row.code || "Sin código"}`,
                            `${row.totalBefore.toFixed(2)}`,
                            `${row.percentage}`,
                            `${row.totalAfter.toFixed(2)}`
                        ]
                    })
                }
            ]

            showGeneratePDF(setLoading, byUserTemplate, inputs)
        }
    }

    const columns: TableColumn<Comission<'byuser'>>[] = useMemo<TableColumn<Comission<'byuser'>>[]>(() => [
        {
            name: "Usuario",
            selector: row => `${distribuidores.find(d => d._id === row.user._id)?.fullName || "Distribuidor desconocido"} ${row.user.role === 'admin' ? "(Administrador)" : ""}`,
        },
        {
            name: "Código",
            selector: row => row.code || "Sin código",
        },
        {
            name: "Ventas",
            width: "17%",
            selector: row => row.totalBefore.toFixed(2),
        },
        {
            name: "%",
            width: "17%",
            selector: row => row.percentage,
        },
        {
            name: "Comisión",
            width: "17%",
            selector: row => row.totalAfter.toFixed(2),
        },
    ], [distribuidores])

    return (
        <div className="flex flex-col gap-6 justify-center items-center w-full p-6">
            <div className="flex flex-col gap-10 w-full">
                <div className="relative w-full text-center text-blue_custom font-semibold">
                    Reporte de comisiones
                    <br />
                    del {
                        formatDateTime(
                            moment.utc(selectedInventario.initialDate).tz("America/La_Paz", true).format(),
                            'numeric', '2-digit', '2-digit', false, true)
                    }{' '}
                    al {
                        formatDateTime(
                            moment.utc(selectedInventario.endDate).tz("America/La_Paz", true).format(),
                            'numeric', '2-digit', '2-digit', false, true)
                    }

                    <div className="flex gap-4 items-center justify-end absolute -top-4 right-0 print:hidden">
                        <button type="button" className="bg-blue_bright w-20 h-12 flex items-center justify-center rounded-[30px]" onClick={() => report()}>
                            <img src="/document.svg" alt="" />
                        </button>
                    </div>
                </div>

                <DataTable columns={columns} className="w-full no-inner-border border !border-font-color/20 !rounded-[10px]"
                    data={allComissions.filter(c => c.code === selectedInventario.code)} noDataComponent={<div className="min-h-[150px] flex items-center justify-center">Sin productos</div>} />
            </div>
        </div>
    )
}

export default ShowComisionesDistribuidor