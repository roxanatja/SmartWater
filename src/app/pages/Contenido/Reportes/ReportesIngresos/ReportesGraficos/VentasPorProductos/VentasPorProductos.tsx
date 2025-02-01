import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./VentasPorProductos.css";
import { PageTitle } from "../../../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { SaleReport } from "../../../../../../../type/Sale/Sale";
import { useForm } from "react-hook-form";
import moment from "moment";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale, ChartData, TimeUnit } from 'chart.js';
import { ProductsApiConector, SalesApiConector } from "../../../../../../../api/classes";
import { Line } from "react-chartjs-2";
import datalabels from 'chartjs-plugin-datalabels';
import 'chartjs-adapter-date-fns';
import Product from "../../../../../../../type/Products/Products";
import "moment/locale/es";

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
    product: string;
    sales: {
        date: string;
        amount: number;
    }[]
}

const VentasPorProductos: FC = () => {

    const navigate = useNavigate();
    const chartRef = useRef(null);

    const [products, setProducts] = useState<Product[]>([])
    const [productsSelected, setProductsSelected] = useState<Product[]>([])

    const [reports, setReports] = useState<SaleReport[]>([])
    const [filters, setFilters] = useState<{ initialDate?: string; finalDate?: string }>({})
    const { register, handleSubmit, watch } = useForm<{ initialDate?: string; finalDate?: string }>({ mode: 'all' })

    useEffect(() => {
        ProductsApiConector.get({ pagination: { page: 1, pageSize: 3000 } }).then(res => setProducts(res?.data || []))
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

    const verticalLinePlugin = {
        id: "verticalLine",
        afterDraw: (chart: any) => {
            if (chart.tooltip._active && chart.tooltip._active.length) {
                const ctx = chart.ctx;
                const x = chart.tooltip._active[0].element.x;
                const topY = chart.scales.y.top;
                const bottomY = chart.scales.y.bottom;

                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, topY);
                ctx.lineTo(x, bottomY);
                ctx.lineWidth = 2;
                ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
                ctx.stroke();
                ctx.restore();
            }
        },
    };

    const formatted = useMemo<IFormattedReport[]>(() => {
        const aux: IFormattedReport[] = []

        let minDateRegistered = moment()

        reports.forEach(r => {
            r.detalles.forEach(d => {
                let idx = aux.findIndex(a => a.product === d.producto)
                const date = range === 'day' ? moment(r.fecharegistro, "DD/MM/YYYY") : moment(r.fecharegistro, "DD/MM/YYYY").startOf('month')

                if (date.isBefore(minDateRegistered)) { minDateRegistered = date }

                if (idx !== -1) {
                    const dateIdx = aux[idx].sales.findIndex(s => s.date === date.format("YYYY-MM-DD"))
                    if (dateIdx !== -1) {
                        const cpy = { ...aux[idx].sales[dateIdx] }
                        aux[idx].sales[dateIdx] = { amount: cpy.amount + d.subtotal, date: cpy.date }
                    } else {
                        aux[idx].sales.push({ amount: d.subtotal, date: date.format("YYYY-MM-DD") })
                    }
                } else {
                    aux.push({
                        product: d.producto,
                        sales: [{
                            amount: d.subtotal,
                            date: date.format("YYYY-MM-DD")
                        }]
                    })
                }
            })
        })

        const maxDate = range === 'day' ? moment(filters.finalDate) : moment(filters.finalDate || undefined).startOf('month')
        products.forEach(p => {
            const idx = aux.findIndex(i => i.product === p.name)

            if (idx === -1) {
                aux.push({
                    product: p.name,
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
    }, [reports, range, products, filters])

    const colors = useMemo(() => ["#367DFD", "#FF5C00", '#F40101', "#4de119", "#d7c50c"], [])

    const data = useMemo<ChartData<'line', { x: string; y: number }[], string>>(() => {
        return {
            datasets: productsSelected.map<ChartData<'line', { x: string; y: number }[], string>['datasets'][0]>((f, index) => {
                const dat = formatted.find(r => r.product === f.name)

                return {
                    label: f.name,
                    tension: 0,
                    fill: false,
                    data: dat ? dat.sales
                        .sort((a, b) => moment(a.date).diff(moment(b.date)))
                        .map(s => ({ x: s.date, y: s.amount })) : [],
                    borderColor: colors[index % 4],
                    pointRadius: 5,
                    pointBorderColor: colors[index % 4],
                    pointBackgroundColor: colors[index % 4],
                }
            })
        }
    }, [formatted, colors, productsSelected])

    const loadData = useCallback(async () => {
        const res = await SalesApiConector.getSalesReports({ filters: { initialDate: filters.initialDate || "2020-01-01", finalDate: filters.finalDate || moment().format("YYYY-MM-DD") } })
        setReports(res || [])
    }, [filters])

    useEffect(() => { loadData() }, [loadData])

    return (
        <>
            <div className="px-10 h-full overflow-y-auto">
                <PageTitle titulo="Ventas por producto" icon="../../../Reportes-icon.svg" hasBack onBack={() => { navigate('/Reportes/Ingresos/Graficos'); }} />

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
                            </div>
                            <div className="flex-1 flex items-center justify-end">
                                <button type="submit" className="PrestamosVsVentas-btn">
                                    <span>Generar reporte</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3 px-4 w-full lg:w-3/4 ">
                            {
                                products.map(p =>
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" className="accent-blue_custom" checked={productsSelected.some(ps => ps._id === p._id)}
                                            onChange={() => {
                                                if (productsSelected.some(ps => ps._id === p._id)) {
                                                    setProductsSelected(prev => prev.filter(ps => ps._id !== p._id))
                                                } else {
                                                    setProductsSelected(prev => [...prev, p])
                                                }
                                            }} key={p._id} id={p._id} />
                                        <label htmlFor={p._id}>{p.name}</label>
                                    </div>
                                )
                            }
                            <div className="flex items-center gap-2">
                                <input type="checkbox" className="accent-blue_custom" checked={productsSelected.length === products.length}
                                    onChange={() => {
                                        if (productsSelected.length === products.length) {
                                            setProductsSelected([])
                                        } else {
                                            setProductsSelected([...products])
                                        }
                                    }} id="all" />
                                <label htmlFor="all">Todos</label>
                            </div>
                        </div>
                    </form>

                </div>
                <div className="my-10">
                    <Line ref={chartRef} data={data} options={{
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
                                            return `${tooltipItem.dataset.label} - ${(tooltipItem.raw as any).y.toFixed(2)} Bs.`
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
                            },
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    font: { family: "Poppins" },
                                    color: document.body.classList.contains('dark') ? "#fefefe" : "#1B1B1B",
                                },
                            },
                        },
                    }} plugins={[verticalLinePlugin]} />
                    {/* <div
                        id="custom-tooltip"
                        style={{
                            position: "absolute",
                            backgroundColor: "white",
                            padding: "10px",
                            borderRadius: "5px",
                            boxShadow: "0px 0px 5px rgba(0,0,0,0.3)",
                            pointerEvents: "none",
                            opacity: 0,
                            transition: "opacity 0.2s",
                        }}
                    /> */}
                </div>
            </div >
        </>
    )
}

export { VentasPorProductos }