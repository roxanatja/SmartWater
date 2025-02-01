import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData } from 'chart.js';
import "./PieChart.css";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(ChartDataLabels, ArcElement, Tooltip, Legend);

const data: ChartData<'pie', number[], string> = {
    labels: ["Ventas", "Prestamos"],
    datasets: [
        {
            data: [30, 70],
            backgroundColor: ['#1A3D7D', '#367DFD'],
            //barThickness: 73,
            borderColor: "#FFF",
            borderWidth: 2
        },
    ]
}

const PieChart = () => {

    return (
        <>
            <div className='w-full'>
                <Pie data={data} options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    font: { family: "Poppins" },
                    plugins: {
                        legend: {
                            labels: {
                                color: document.body.classList.contains('dark') ? "#fefefe" : "#1B1B1B",
                                font: { family: "Poppins", size: 16 },

                            },
                            display: true,
                            align: 'start',
                            position: "bottom"
                        },
                        datalabels: {
                            font: { family: "Poppins" },
                            anchor: 'center',
                            align: 'top',
                            color: "#fefefe",
                        },
                        tooltip: {
                            titleFont: { family: "Poppins" },
                            bodyFont: { family: "Poppins" }
                        }
                    }
                }} />
            </div>
        </>
    )
}

export { PieChart }