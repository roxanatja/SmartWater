import "./Barchat.css"
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, 
        PointElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const BarChart = () => {

    var beneficios = [1970, 1550 , 100 , 960, 1400];
    var vendidos = [920, 950, 380 , 1600, 2000];
    var numeros = ["1", "2", "3", "4", "5"];

    var misoptions = {
        responsive : true,
        plugins : {
            legend : {
                display : false
            }
        },
        scales : {
            y : {
                min : 0,
                max : 2000,
                ticks: {
                    stepSize: 500, // Establece el espaciado entre las etiquetas
                    callback: function (value: string | number) {
                        // Muestra solo ciertos valores
                        if (value === 500 || value === 1000 || value === 1500) {
                            return value.toString();
                        }
                        return '';
                    },
                }
            },
            x: {
                ticks: { 
                    color: '#000',
                },
            }
        },
        maintainAspectRatio: false, // Esto evita que el gráfico mantenga el aspect ratio
    };

    var midata = {
        labels: numeros,
        datasets: [
            {
                label: 'Beneficios',
                data: beneficios,
                backgroundColor: '#1A3D7D',
                //barThickness: 73,
            },
            {
                label: 'vendidos',
                data: vendidos,
                backgroundColor: '#367DFD',
                //barThickness: 73,
                
            }
        ]
    };

    return(
        <>
        <div className="BarContainer">
            <div style={{width: "76vw", height:"256px",paddingLeft: "69px", paddingTop: "7px", paddingRight: "8px"}}>
                <Bar data={midata} options={misoptions} />
            </div>
        </div>
        </>
    )
}

export {BarChart}