import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './LinesChart.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LinesChart = () => {
    const beneficios = [30, 5, 30, 20, 30];
    const vendidos = [10, 25, 28, 40, 27];
    const numeros = [0, 1, 2, 3, 4];

    const data = {
        labels: numeros,
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
            {
                label: 'Botellon 10 lts',
                data: vendidos,
                tension: 0,
                fill: false,
                borderColor: '#FF5C00',
                pointRadius: 5,
                pointBorderColor: '#FF5C00',
                pointBackgroundColor: '#FFF',
            },
        ],
    };

    const options = {
        scales: {
        x: {
            beginAtZero: true,
        },
        y: {
            min : 0,
                max : 40,
                ticks: {
                    stepSize: 10, // Establece el espaciado entre las etiquetas
                    callback: function (value: string | number) {
                        // Muestra solo ciertos valores
                        if (value === 0 || value === 10 || value === 20 || value === 30 || value === 40) {
                            return value.toString();
                        }
                        return '';
                    },
                }
        },
        },
    };

    return (
        <div className='LineContainer'>
            <Line data={data} options={options} />
        </div>
    );
};

export { LinesChart };