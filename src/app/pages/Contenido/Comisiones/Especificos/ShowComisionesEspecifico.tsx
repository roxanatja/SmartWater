import React, { useMemo, useState } from 'react'
import { Comission } from '../../../../../type/Comission'
import { formatDateTime } from '../../../../../utils/helpers';
import moment from 'moment-timezone';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useGlobalContext } from '../../../../SmartwaterContext';
import { User } from '../../../../../type/User';
import { showGeneratePDF } from '../../../../../utils/pdfHelper';
import { specificTemplate } from '../pdfTemplates';
import { motion } from 'framer-motion'
import Product from '../../../../../type/Products/Products';

interface Props {
    allComissions: Comission<'specific'>[];
    selectedInventario: Comission<'specific'>;
    distribuidores: User[];
    products: Product[];
    onCancel: () => void
}

const ShowComisionesEspecifico = ({ allComissions, selectedInventario, distribuidores, products, onCancel }: Props) => {
    const { setLoading } = useGlobalContext()
    const [selectedData, setSelectedData] = useState<Comission<'specific'> | null>(null)

    const report = async () => {
        if (selectedData) {
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
                    distribuidor: `${distribuidores.find(d => d._id === selectedData.user._id)?.fullName || "Distribuidor desconocido"} ${selectedData.user.role === 'admin' ? "(Administrador)" : ""}`,
                    table: selectedData.details.map(row => {
                        return [
                            `${products.find(d => d._id === row.product)?.name || "Producto desconocido"}`,
                            `${row.totalBeforeElem.toFixed(2)}`,
                            `${row.percentageElem}`,
                            `${row.totalAfterElem.toFixed(2)}`,
                        ]
                    })
                }
            ]

            showGeneratePDF(setLoading, specificTemplate, inputs)
        }
    }

    const columns: TableColumn<Comission<'specific'>['details'][0]>[] = useMemo<TableColumn<Comission<'specific'>['details'][0]>[]>(() => [
        {
            name: "Producto",
            selector: row => `${products.find(d => d._id === row.product)?.name || "Producto desconocido"}`,
        },
        {
            name: "Ventas",
            width: "18%",
            selector: row => row.totalBeforeElem.toFixed(2),
        },
        {
            name: "%",
            width: "18%",
            selector: row => row.percentageElem,
        },
        {
            name: "Comisión",
            width: "18%",
            selector: row => row.totalAfterElem.toFixed(2),
        },
    ], [products])

    const selectedDistribuidoresComissions = useMemo<{
        distribuidor: User | undefined;
        comission: Comission<'specific'>
    }[]>(() => {
        const filteredComissions = allComissions.filter(c => c.code === selectedInventario.code)

        setSelectedData(filteredComissions[0])

        return filteredComissions.map(c => ({
            comission: c,
            distribuidor: distribuidores.find(d => d._id === c.user._id)
        }))
    }, [distribuidores, allComissions, selectedInventario])

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

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-fit flex flex-col gap-2"
                >
                    <select id='user'
                        value={selectedData?.user._id}
                        onChange={e => {
                            const id = e.target.value
                            if (id !== '') {
                                setSelectedData(selectedDistribuidoresComissions.find(c => c.distribuidor?._id === id)?.comission || null)
                            } else {
                                setSelectedData(null)
                            }
                        }} className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black disabled:opacity-40">
                        {
                            selectedDistribuidoresComissions
                                .map(d => d.distribuidor)
                                .filter(d => !!d)
                                .map(d =>
                                    <option key={d!._id} value={d!._id}>{d!.fullName || "Sin nombre"} {d!.role === 'admin' ? "(Administrador)" : ""}</option>
                                )
                        }
                    </select>
                </motion.div>

                <DataTable columns={columns} className="w-full no-inner-border border !border-font-color/20 !rounded-[10px]"
                    data={selectedData?.details || []} noDataComponent={<div className="min-h-[150px] flex items-center justify-center">Sin selección</div>} />
            </div>
        </div>
    )
}

export default ShowComisionesEspecifico