import { useEffect, useState } from "react";
import "./Barchat.css";
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
} from "chart.js";
import { SalesApiConector } from "../../../../api/classes";
import moment from "moment";
import ChartDataLabels from "chartjs-plugin-datalabels";

// Registra los componentes necesarios de Chart.js para usar en el gráfico
ChartJS.register(
  ChartDataLabels,
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
  // Estados para almacenar los datos de beneficios, gastos y semanas
  const [beneficios, setBeneficios] = useState<number[]>([]);
  const [productos, setProductos] = useState<string[]>();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const now = new Date()
        const monthAgo = moment(now).subtract(1, 'month').toDate()

        const salesResponse = await SalesApiConector.getSalesProducts({ filters: { initialDate: monthAgo.toISOString(), finalDate: now.toISOString() } });

        if (salesResponse) {
          const prods: string[] = []; const sales: number[] = []
          salesResponse.forEach(sp => {
            prods.push(sp.prod)
            sales.push(Math.ceil(sp.total))
          })

          setProductos(prods)
          setBeneficios(sales)
        } else {
          console.log("No se encontraron datos de ventas.");
        }
      } catch (error) {
        console.error("Error al obtener datos de ventas:", error);
      }
    };

    fetchSalesData();
  }, []);

  // Datos del gráfico
  const data: ChartData<"bar", number[], string> = {
    labels: productos,
    datasets: [
      {
        label: "Ventas",
        data: beneficios,
        backgroundColor: document.body.classList.contains('dark') ? "#367dfd" : "#1A3D7D",
      }
    ],
  };

  // Componente que muestra el gráfico de barras
  return (
    <div className="BarContainer bg-blocks dark:border-blocks !h-auto w-full p-10">
      <h4 className="mb-4 font-[600] text-lg">Ventas de productos</h4>
      <div className="w-full overflow-auto px-16">
        <Bar data={data} options={{
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            datalabels: {
              font: { family: "Poppins" },
              align: 'top',
              anchor: 'end',
              clip: true,
              rotation: 65,
              formatter: (value: number) => `${value} Bs.`,
              color: document.body.classList.contains('dark') ? "#fefefe" : "#1B1B1B",
            },
            tooltip: {
              titleFont: { family: "Poppins" },
              bodyFont: { family: "Poppins" }
            }
          },
          scales: {
            y: {
              ticks: {
                font: { family: "Poppins" },
                color: document.body.classList.contains('dark') ? "#fefefe" : "#1B1B1B",
                stepSize: 500, // Establece el espaciado entre las etiquetas
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
              grid: {
                color: document.body.classList.contains('dark') ? "#333" : "#e0e0e0"
              }
            },
          },
          maintainAspectRatio: false, // Esto evita que el gráfico mantenga el aspect ratio
        }} />
      </div>
    </div>
  );
};

export { BarChart };
