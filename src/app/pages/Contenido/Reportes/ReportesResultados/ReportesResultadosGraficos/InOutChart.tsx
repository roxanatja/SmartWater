import React, { useMemo } from 'react'
import { IFormattedResults } from './ReportesResultadosGraficos'
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartData,
    TimeScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import 'chartjs-adapter-date-fns';
import "moment/locale/es";
import moment from 'moment';

// Registra los componentes necesarios de Chart.js para usar en el gráfico
ChartJS.register(
    ChartDataLabels,
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const InOutChart = ({ reports, headers, mode }: {
    reports: IFormattedResults[],
    headers: string[];
    mode: "month" | "range"
}) => {
    const colors = useMemo(() => ["#367DFD", "#1a3d7d"], [])
    const data = useMemo<ChartData<'bar', number[], string>>(() => {
        return {
            labels: headers,
            datasets: reports.map((r, index) => ({
                label: index === 0 ? "Ingresos" : "Egresos",
                data: r.values.map(re => re.value),
                backgroundColor: colors[index === 0 ? 0 : 1]
            }))
        }
    }, [reports, colors, headers])

    const total = useMemo<number[]>(() => {
        return reports.map(r => r.values.reduce<number>((acc, f) => acc += f.value, 0))
    }, [reports])

    return (
        <Bar data={data} options={{
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    align: "start",
                    labels: {
                        font: { family: "Poppins" },
                        color: document.body.classList.contains('dark') ? "#fefefe" : "#1B1B1B"
                    }
                },
                datalabels: {
                    font: { family: "Poppins" },
                    anchor: 'end',
                    clamp: true,
                    rotation: 65,
                    align: 'top',
                    formatter(value, context) {
                        const percent = value / total[context.datasetIndex] * 100
                        return percent > 0 ? percent < 0.01 ? "< 0.01%" : `${(percent).toFixed(2)}%` : "0%"
                    },
                    color: document.body.classList.contains('dark') ? "#fefefe" : "#1B1B1B",
                },
                tooltip: {
                    titleFont: { family: "Poppins" },
                    bodyFont: { family: "Poppins" },
                    callbacks: {
                        title(tooltipItems) {
                            return `${tooltipItems[0].dataset.label} ${moment(tooltipItems[0].label).format(mode === 'month' ? "MMMM YYYY" : "DD/MM/YYYY")}`
                        },
                        label(tooltipItem) {
                            if ((tooltipItem.raw as any).y === 0) {
                                return ""
                            } else {
                                const percent = tooltipItem.raw as number / total[tooltipItem.datasetIndex] * 100
                                return `${tooltipItem.raw} Bs. (${percent.toFixed(2)} %)`
                            }
                        },
                    }
                }
            },
            scales: {
                y: {
                    ticks: {
                        font: { family: "Poppins" },
                        color: document.body.classList.contains('dark') ? "#fefefe" : "#1B1B1B",
                    },
                    grid: {
                        color: document.body.classList.contains('dark') ? "#333" : "#e0e0e0"
                    }
                },
                x: {
                    ticks: {
                        font: { family: "Poppins" },
                        color: document.body.classList.contains('dark') ? "#fefefe" : "#1B1B1B",
                    },
                    type: 'time',
                    time: {
                        unit: mode === 'month' ? 'month' : 'day',
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
            },

            maintainAspectRatio: true, // Esto evita que el gráfico mantenga el aspect ratio
        }} />
    )
}

export default InOutChart