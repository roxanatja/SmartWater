import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./VentasPorDistribuidor.css";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../../../../components/PageTitle/PageTitle";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale, ChartData, TimeUnit } from 'chart.js';
import { Line, Bar } from "react-chartjs-2";
import datalabels from 'chartjs-plugin-datalabels';
import moment from "moment";
import 'chartjs-adapter-date-fns';
import "moment/locale/es";
import { User } from "../../../../../../../type/User";
import { useForm } from "react-hook-form";
import { ClientsApiConector, UsersApiConector } from "../../../../../../../api/classes";
import { Client } from "../../../../../../../type/Cliente/Client";
import { verticalLinePlugin } from "../../../../../../../utils/charts.utils";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    LineElement,
    datalabels,
    Title,
    Tooltip,
    Legend
);

interface IFormattedReport {
    distribuidor: string;
    sales: {
        date: string;
        amount: number;
    }[]
}

const ClientesPorDistribuidor: FC = () => {
    const navigate = useNavigate();

    const chartRef = useRef(null);

    const [type, setType] = useState<string>('line')

    const [distribuidores, setDistribuidores] = useState<User[]>([])
    const [distribuidoresSelected, setDistribuidoresSelected] = useState<User[]>([])

    const [reports, setReports] = useState<Client[]>([])
    const [filters, setFilters] = useState<{ initialDate?: string; finalDate?: string }>({})
    const { register, handleSubmit, watch } = useForm<{ initialDate?: string; finalDate?: string }>({ mode: 'all' })

    useEffect(() => {
        UsersApiConector.get({ pagination: { page: 1, pageSize: 30000 }, filters: { desactivated: false } }).then(res => {
            setDistribuidores(res?.data || [])
            setDistribuidoresSelected(res?.data || [])
        })
    }, [])

    const onSubmit = (data: { initialDate?: string; finalDate?: string }) => {
        setFilters(data)
    };

    const range = useMemo<false | TimeUnit>(() => {
        if (filters.initialDate && filters.finalDate) {
            const init = moment(filters.initialDate)
            const end = moment(filters.finalDate)
            return (init.month() !== end.month() || init.year() !== end.year()) ? 'month' : 'day'
        } else if (filters.initialDate) {
            const init = moment(filters.initialDate)
            const end = moment()
            return (init.month() !== end.month() || init.year() !== end.year()) ? 'month' : 'day'
        } else if (filters.finalDate) {
            const init = moment("2020-01-01")
            const end = moment(filters.finalDate)
            return (init.month() !== end.month() || init.year() !== end.year()) ? 'month' : 'day'
        }

        return 'month'
    }, [filters])

    const formatted = useMemo<IFormattedReport[]>(() => {
        const aux: IFormattedReport[] = []

        let minDateRegistered = moment()

        reports.forEach(r => {
            let idx = aux.findIndex(a => a.distribuidor === r.user)
            const date = range === 'day' ? moment(r.created) : moment(r.created).startOf('month')

            if (date.isBefore(minDateRegistered)) { minDateRegistered = date }

            if (idx !== -1) {
                const dateIdx = aux[idx].sales.findIndex(s => s.date === date.format("YYYY-MM-DD"))
                if (dateIdx !== -1) {
                    const cpy = { ...aux[idx].sales[dateIdx] }
                    aux[idx].sales[dateIdx] = { amount: cpy.amount + 1, date: cpy.date }
                } else {
                    aux[idx].sales.push({ amount: 1, date: date.format("YYYY-MM-DD") })
                }
            } else {
                aux.push({
                    distribuidor: r.user,
                    sales: [{
                        amount: 1,
                        date: date.format("YYYY-MM-DD")
                    }]
                })
            }
        })

        const maxDate = range === 'day' ? moment(filters.finalDate) : moment(filters.finalDate || undefined).startOf('month')
        distribuidores.forEach(p => {
            const idx = aux.findIndex(i => i.distribuidor === p._id)

            if (idx === -1) {
                aux.push({
                    distribuidor: p._id,
                    sales: [
                        {
                            amount: 0,
                            date: minDateRegistered.format("YYYY-MM-DD")
                        },
                        {
                            amount: 0,
                            date: maxDate.format("YYYY-MM-DD")
                        },
                    ]
                })
            } else {
                if (aux[idx].sales.findIndex(s => s.date === minDateRegistered.format("YYYY-MM-DD")) === -1) {
                    aux[idx].sales.push({
                        amount: 0,
                        date: minDateRegistered.format("YYYY-MM-DD")
                    })
                }
                if (aux[idx].sales.findIndex(s => s.date === maxDate.format("YYYY-MM-DD")) === -1) {
                    aux[idx].sales.push({
                        amount: 0,
                        date: maxDate.format("YYYY-MM-DD")
                    })
                }
            }
        })

        return aux
    }, [reports, range, distribuidores, filters])

    const colors = useMemo(() => ["#367DFD", "#FF5C00", '#F40101', "#4de119", "#d7c50c"], [])
    const data = useMemo<ChartData<'line', { x: string; y: number }[], string>>(() => {
        return {
            datasets: distribuidoresSelected.map<ChartData<'line', { x: string; y: number }[], string>['datasets'][0]>((f, index) => {
                const dat = formatted.find(r => r.distribuidor === f._id)

                return {
                    label: `${f.fullName || "Sin nombre"} ${f.role === 'admin' ? "(Administrador)" : ""}`,
                    tension: 0,
                    fill: false,
                    data: dat ? dat.sales
                        .sort((a, b) => moment(a.date).diff(moment(b.date)))
                        .map(s => ({ x: s.date, y: s.amount })) : [],
                    borderColor: colors[index % colors.length],
                    pointRadius: 5,
                    pointBorderColor: colors[index % colors.length],
                    pointBackgroundColor: colors[index % colors.length],
                }
            })
        }
    }, [formatted, colors, distribuidoresSelected])

    const dataPie = useMemo<ChartData<'bar', number[], string>>(() => {

        const toSet: { label: string; amount: number }[] = distribuidoresSelected.map(p => ({
            label: `${p.fullName || "Sin nombre"} ${p.role === 'admin' ? "(Administrador)" : ""}`,
            amount: (formatted.find(f => f.distribuidor === p._id)?.sales || []).reduce((acc, curr) => acc += curr.amount, 0)
        }))

        return {
            labels: toSet.sort((a, b) => b.amount - a.amount).map(p => p.label),
            datasets: [{
                data: toSet.sort((a, b) => b.amount - a.amount).map(p => p.amount),
                backgroundColor(ctx, options) {
                    return colors[ctx.dataIndex % colors.length]
                },
            }]
        }
    }, [formatted, colors, distribuidoresSelected])

    const total = useMemo<number>(() => {
        return formatted
            .filter(f => distribuidoresSelected.some(p => p._id === f.distribuidor))
            .reduce<number>((acc, f) => acc += f.sales.reduce<number>((accS, s) => accS += s.amount, 0), 0)
    }, [formatted, distribuidoresSelected])

    const loadData = useCallback(async () => {
        const res = await ClientsApiConector.getClients({ filters: { initialDate: filters.initialDate || "2020-01-01", finalDate: filters.finalDate || moment().format("YYYY-MM-DD") }, pagination: { page: 1, pageSize: 30000 } })
        setReports(res?.data || [])
    }, [filters])

    useEffect(() => { loadData() }, [loadData])

    return (
        <>
            <div className="px-10 h-full overflow-y-auto">
                <PageTitle titulo="Clientes por usuario" icon="/Reportes-icon.svg" hasBack onBack={() => { navigate('/Reportes/Ingresos/Graficos'); }} />

                <div style={{ marginTop: "32px" }}>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
                                <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1 relative">
                                    <span className="text-left text-sm">Tipo de gráfico</span>
                                    <select value={type} onChange={(e) => setType(e.target.value || "line")} className="border-0 rounded outline-none font-semibold w-full bg-main-background text-sm full-selector">
                                        <option value="line">Líneas</option>
                                        <option value="bar">Barras</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex-1 flex items-center justify-end">
                                <button type="submit" className="PrestamosVsVentas-btn">
                                    <span>Generar reporte</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 px-4 w-full lg:w-3/4 ">
                            {
                                distribuidores.map(p =>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" className="accent-blue_custom" checked={distribuidoresSelected.some(ps => ps._id === p._id)}
                                            onChange={() => {
                                                if (distribuidoresSelected.some(ps => ps._id === p._id)) {
                                                    setDistribuidoresSelected(prev => prev.filter(ps => ps._id !== p._id))
                                                } else {
                                                    setDistribuidoresSelected(prev => [...prev, p])
                                                }
                                            }} key={p._id} id={p._id} />
                                        <label htmlFor={p._id}>{p.fullName || "Sin nombre"} {p.role === 'admin' ? "(Administrador)" : ""}</label>
                                    </div>
                                )
                            }
                            <div className="flex items-center gap-2">
                                <input type="checkbox" className="accent-blue_custom" checked={distribuidoresSelected.length === distribuidores.length}
                                    onChange={() => {
                                        if (distribuidoresSelected.length === distribuidores.length) {
                                            setDistribuidoresSelected([])
                                        } else {
                                            setDistribuidoresSelected([...distribuidores])
                                        }
                                    }} id="all" />
                                <label htmlFor="all">Todos</label>
                            </div>
                        </div>
                    </form>

                </div>
                <div className="my-10">
                    {
                        type === 'bar' &&
                        <Bar data={dataPie} options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            font: { family: "Poppins" },
                            plugins: {
                                legend: {
                                    display: false,
                                },
                                datalabels: {
                                    font: { family: "Poppins" },
                                    anchor: 'end',
                                    align: 'end',
                                    clamp: true,
                                    color: document.body.classList.contains('dark') ? "#fefefe" : "#1B1B1B",
                                    offset: 10,
                                    formatter(value, context) {
                                        const percent = value / (total) * 100
                                        return percent > 0 ? percent < 0.01 ? "< 0.01%" : `${(percent).toFixed(2)}%` : "0%"
                                    },
                                },
                                tooltip: {
                                    titleFont: { family: "Poppins" },
                                    bodyFont: { family: "Poppins" },
                                    callbacks: {
                                        label(tooltipItem) {
                                            return `${Number((tooltipItem.raw as number)).toLocaleString()}`
                                        },
                                    }
                                }
                            },
                            indexAxis: 'y',
                            scales: {
                                x: {
                                    ticks: {
                                        font: { family: "Poppins" },
                                        color: document.body.classList.contains('dark') ? "#fefefe" : "#1B1B1B",
                                    },
                                    grid: {
                                        color: document.body.classList.contains('dark') ? "#333" : "#e0e0e0"
                                    }
                                },
                                y: {
                                    ticks: {
                                        font: { family: "Poppins" },
                                        color: document.body.classList.contains('dark') ? "#fefefe" : "#1B1B1B",
                                    },
                                    grid: {
                                        color: document.body.classList.contains('dark') ? "#333" : "#e0e0e0"
                                    }
                                }
                            }
                        }} />
                    }

                    {
                        type === 'line' && <Line ref={chartRef} data={data} options={{
                            responsive: true,
                            maintainAspectRatio: true,
                            plugins: {
                                legend: {
                                    display: false
                                },
                                datalabels: {
                                    formatter(value, context) {
                                        return ""
                                    },
                                },
                                tooltip: {
                                    callbacks: {
                                        title(tooltipItems) {
                                            return moment(tooltipItems[0].label).format(range === 'month' ? "MMMM YYYY" : "DD-MM-YYYY")
                                        },
                                        label(tooltipItem) {
                                            if ((tooltipItem.raw as any).y === 0) {
                                                return ""
                                            } else {
                                                return `${tooltipItem.dataset.label} - ${(tooltipItem.raw as any).y}`
                                            }
                                        },
                                    }
                                }
                            },
                            interaction: {
                                mode: "x",
                                intersect: false, // Permite que la línea interseque múltiples puntos
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        font: { family: "Poppins" },
                                        color: document.body.classList.contains('dark') ? "#fefefe" : "#1B1B1B",
                                    },
                                    type: 'time',
                                    time: {
                                        unit: range,
                                        tooltipFormat: "yyyy-MM-dd",
                                        displayFormats: {
                                            month: "MM/yyyy",
                                            day: "dd/MM/yyyy"
                                        }
                                    },
                                    grid: {
                                        color: document.body.classList.contains('dark') ? "#333" : "#e0e0e0"
                                    }
                                },
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        font: { family: "Poppins" },
                                        color: document.body.classList.contains('dark') ? "#fefefe" : "#1B1B1B",
                                    },
                                    grid: {
                                        color: document.body.classList.contains('dark') ? "#333" : "#e0e0e0"
                                    }
                                },
                            },
                        }} plugins={[verticalLinePlugin]} />
                    }
                </div>
            </div>
        </>
    )
}

export { ClientesPorDistribuidor }