import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import "./PieChart.css";

ChartJS.register(ArcElement, Tooltip, Legend);

var options = {
    responsive: true,
    maintainAspectRatio: false,
};

var beneficios = [70];
var vendidos = [30];


var data = {
    labels: [],
    datasets: [
        {
            data: [vendidos, beneficios],
            backgroundColor: ['#1A3D7D', '#367DFD'],
            //barThickness: 73,
            borderColor: "#FFF",
            borderWidth: 2,
        },
    ]
}

const PieChart = () => { 

    return(
        <>
            <div className='PieChart-container'>
                <Pie data={data} options={options} />
            </div>
        </>
    )
}

export{PieChart}