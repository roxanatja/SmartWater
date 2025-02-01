import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import datalabels from 'chartjs-plugin-datalabels';
import './LinesChart.css';
import 'chartjs-adapter-date-fns';

ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    LineElement,
    datalabels,
    Title,
    Tooltip,
    Legend
);

const LinesChart = () => {
    const beneficios = [
        {
            x: '2021-11-07T09:00:28',
            y: 20
        },
        {
            x: '2021-11-08T23:39:30',
            y: 50
        },
        {
            x: '2021-11-09T01:00:28',
            y: 60
        },
        {
            x: '2021-11-10T01:00:28',
            y: 35
        },
    ];
    // const vendidos = [10, 25, 28, 40, 27];
    // const numeros = [0, 1, 2, 3, 4];

    const data = {
        datasets: [
            {
                label: 'Botellon 20 lts',
                data: beneficios,
                tension: 0,
                fill: false,
                borderColor: '#367DFD',
                pointRadius: 5,
                pointBorderColor: '#367DFD',
                pointBackgroundColor: '#FFF',
            },
            // {
            //     label: 'Botellon 10 lts',
            //     data: vendidos,
            //     tension: 0,
            //     fill: false,
            //     borderColor: '#FF5C00',
            //     pointRadius: 5,
            //     pointBorderColor: '#FF5C00',
            //     pointBackgroundColor: '#FFF',
            // },
        ],
    };

    return (
        <div className=''>
            <Line data={data} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    datalabels: {
                        formatter(value, context) {
                            return ""
                        },
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'day',
                            tooltipFormat: "yyyy-MM-dd",
                            displayFormats: {
                                month: "MMM yyyy",
                                day: "dd MMM yyyy"
                            }
                        },
                        title: {
                            display: true,
                            text: "Value"
                        }
                        // min: '2021-11-07 00:00:00',
                    },
                    y: {
                        min: 0
                    },
                },
            }} />
        </div>
    );
};

export { LinesChart };