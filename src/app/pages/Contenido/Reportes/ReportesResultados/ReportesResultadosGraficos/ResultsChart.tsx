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

const ResultsChart = ({ reports, headers, mode }: {
    reports: IFormattedResults,
    headers: string[];
    mode: "month" | "range"
}) => {
    const colors = useMemo(() => ["#00aa00", "#ff0000"], [])
    const data = useMemo<ChartData<'bar', number[], string>>(() => {
        return {
            labels: headers,
            datasets: [{
                label: "Resultados",
                data: reports.values.map(r => r.value),
                backgroundColor(ctx, options) {
                    return colors[ctx.raw as number > 0 ? 0 : 1]
                },
            }]
        }
    }, [reports, colors, headers])

    return (
        <Bar data={data} options={{
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                },
                datalabels: {
                    clip: true,
                    rotation: 60,
                    font: { family: "Poppins" },
                    anchor: 'end',
                    align: 'top',
                    formatter: (value: number) => `${value} Bs.`,
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
                                return `${(tooltipItem.raw as number).toLocaleString()} Bs.`
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

export default ResultsChart