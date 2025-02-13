import { FC, useCallback, useEffect, useMemo, useState } from "react";
import "./PrestamosVsVentas.css";
import { PageTitle } from "../../../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    ChartData,
    ArcElement,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useForm } from "react-hook-form";
import moment from "moment";
import { Sale } from "../../../../../../../type/Sale/Sale";
import { SalesApiConector } from "../../../../../../../api/classes";

ChartJS.register(ChartDataLabels, ArcElement, Tooltip, Legend);

const PrestamosVsVentas: FC = () => {
    const navigate = useNavigate();
    const [salesLoans, setSalesLoans] = useState<Sale[]>([])
    const [salesNoLoan, setSalesNoLoan] = useState<Sale[]>([])
    const [filters, setFilters] = useState<{ initialDate?: string; finalDate?: string }>({})

    const { register, handleSubmit, watch } = useForm<{ initialDate?: string; finalDate?: string }>({ mode: 'all' })

    const data = useMemo<ChartData<'pie', number[], string>>(() => {
        return {
            labels: ["Ventas sin préstamos", "Ventas con préstamos"],
            datasets: [
                {
                    data: [
                        salesNoLoan.reduce((acc, sale) => acc + (sale.total || 0), 0),
                        salesLoans.reduce((acc, sale) => acc + (sale.total || 0), 0),
                    ],
                    backgroundColor: ['#1A3D7D', '#367DFD'],
                    //barThickness: 73,
                    borderColor: "#FFF",
                    borderWidth: 2
                },
            ]
        }
    }, [salesLoans, salesNoLoan])

    const loadData = useCallback(async () => {
        const promises = [
            SalesApiConector.get({ filters: { initialDate: filters.initialDate || "2020-01-01", finalDate: filters.finalDate || moment().format("YYYY-MM-DD"), hasClientLoan: true }, pagination: { page: 1, pageSize: 30000 } }),
            SalesApiConector.get({ filters: { initialDate: filters.initialDate || "2020-01-01", finalDate: filters.finalDate || moment().format("YYYY-MM-DD"), hasClientLoan: false }, pagination: { page: 1, pageSize: 30000 } })
        ]

        const res = await Promise.all(promises)

        setSalesLoans(res[0]?.data || [])
        setSalesNoLoan(res[1]?.data || [])
    }, [filters])

    const onSubmit = (data: { initialDate?: string; finalDate?: string }) => {
        setFilters(data)
    };

    useEffect(() => { loadData() }, [loadData])

    return (
        <>
            <div className="px-10 h-screen overflow-auto">
                <PageTitle titulo="Préstamos vs Ventas" icon="../../../Reportes-icon.svg" hasBack onBack={() => { navigate('/Reportes/Ingresos/Graficos') }} />

                <div style={{ marginTop: "32px" }}>
                    <form onSubmit={handleSubmit(onSubmit)} >
                        <div className="flex gap-3 w-full items-center flex-wrap justify-between">
                            <div className="flex gap-3 w-full items-center flex-wrap lg:w-1/2">
                                <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1 relative">
                                    <span className="text-left text-sm">De</span>
                                    <img src="/desde.svg" alt="" className="w-[20px] h-[20px] absolute bottom-3 left-4 invert-0 dark:invert" />
                                    <input
                                        max={watch('finalDate')?.toString() || moment().format("YYYY-MM-DD")}
                                        type="date"
                                        {...register("initialDate")}
                                        className="border-0 rounded outline-none font-semibold w-full bg-transparent text-sm full-selector pl-10"
                                    />
                                </div>
                                <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1 relative">
                                    <span className="text-left text-sm">A</span>
                                    <img src="/hasta.svg" alt="" className="w-[20px] h-[20px] absolute bottom-3 left-4 invert-0 dark:invert" />
                                    <input
                                        min={watch('initialDate')?.toString()}
                                        max={moment().format("YYYY-MM-DD")}
                                        type="date"
                                        {...register("finalDate")}
                                        className="border-0  rounded outline-none font-semibold w-full bg-transparent text-sm full-selector pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-end">
                                <button type="submit" className="PrestamosVsVentas-btn">
                                    <span>Generar reporte</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "100px" }}>
                    <>
                        <div className='w-full'>
                            <Pie data={data} options={{
                                responsive: true,
                                maintainAspectRatio: true,
                                font: { family: "Poppins" },
                                plugins: {
                                    legend: {
                                        display: false
                                    },
                                    datalabels: {
                                        font: { family: "Poppins" },
                                        anchor: 'center',
                                        align: 'top',
                                        color: "#fefefe",
                                        formatter(value, context) {
                                            return `${(value / (salesNoLoan.reduce((acc, sale) => acc + (sale.total || 0), 0) + salesLoans.reduce((acc, sale) => acc + (sale.total || 0), 0)) * 100).toFixed(2)}%`
                                        },
                                    },
                                    tooltip: {
                                        titleFont: { family: "Poppins" },
                                        bodyFont: { family: "Poppins" },
                                        callbacks: {
                                            label(tooltipItem) {
                                                return `${tooltipItem.raw as number} Bs. (${(tooltipItem.raw as number / (salesNoLoan.reduce((acc, sale) => acc + (sale.total || 0), 0) + salesLoans.reduce((acc, sale) => acc + (sale.total || 0), 0)) * 100).toFixed(2)}%)`
                                            },
                                        }
                                    }
                                }
                            }} />
                        </div>
                    </>

                </div>
                <div style={{ display: "flex", flexDirection: "column", marginTop: "40px", gap: "18px", alignItems: "start" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                        <span style={{ width: "135px", height: "23px", borderRadius: "5px", background: "#367DFD" }}></span>
                        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "16px", fontWeight: "400", fontStyle: "normal" }}>Ventas sin préstamos</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px" }}>
                        <span style={{ width: "135px", height: "23px", borderRadius: "5px", background: "#1A3D7D" }}></span>
                        <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: "16px", fontWeight: "400", fontStyle: "normal" }}>Ventas con préstamos</span>
                    </div>
                </div>
            </div >
        </>
    )
}

export { PrestamosVsVentas }