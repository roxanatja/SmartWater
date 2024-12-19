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
} from "chart.js";
import { GetSales } from "../../../../services/SaleService";
import { GetExpenses } from "../../../../services/Expenses";

// Registra los componentes necesarios de Chart.js para usar en el gráfico
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
  // Estados para almacenar los datos de beneficios, gastos y semanas
  const [beneficios, setBeneficios] = useState<number[]>([]);
  const [gastos, setGastos] = useState<number[]>([]);
  const [semanas] = useState<string[]>([
    "Semana 1",
    "Semana 2",
    "Semana 3",
    "Semana 4",
  ]);

  // Efecto para cargar los datos de ventas y gastos al montar el componente
  useEffect(() => {
    // Función asincrónica para obtener los datos de ventas
    const fetchSalesData = async () => {
      try {
        const salesResponse = await GetSales(); // Llama al servicio para obtener datos de ventas
        if (salesResponse && salesResponse.data) {
          // Calcula las ventas de las últimas 4 semanas
          const today = new Date();
          const lastFourWeeks = [...Array(4)].map((_, index) => {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - index * 7);
            startOfWeek.setHours(0, 0, 0, 0); // Establece el primer día de la semana

            const endOfWeek = new Date(today);
            endOfWeek.setDate(today.getDate() - index * 7 + 6);
            endOfWeek.setHours(23, 59, 59, 999); // Establece el último día de la semana

            // Filtra las ventas para obtener las de la semana actual
            const weeklySales = salesResponse.data.filter((sale: any) => {
              const saleDate = new Date(sale.created);
              return saleDate >= startOfWeek && saleDate <= endOfWeek;
            });

            // Calcula el total de las ventas de la semana
            return weeklySales.reduce(
              (accumulator: number, sale: any) => accumulator + sale.total,
              0
            );
          });
          // Actualiza el estado de beneficios con los datos calculados
          setBeneficios(lastFourWeeks);
        } else {
          console.log("No se encontraron datos de ventas.");
        }
      } catch (error) {
        console.error("Error al obtener datos de ventas:", error);
      }
    };

    // Función asincrónica para obtener los datos de gastos
    const fetchExpensesData = async () => {
      try {
        const expensesResponse = await GetExpenses(); // Llama al servicio para obtener datos de gastos
        if (expensesResponse && expensesResponse.data) {
          // Calcula los gastos de las últimas 4 semanas
          const today = new Date();
          const lastFourWeeks = [...Array(4)].map((_, index) => {
            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - index * 7);
            startOfWeek.setHours(0, 0, 0, 0); // Establece el primer día de la semana

            const endOfWeek = new Date(today);
            endOfWeek.setDate(today.getDate() - index * 7 + 6);
            endOfWeek.setHours(23, 59, 59, 999); // Establece el último día de la semana

            // Filtra los gastos para obtener los de la semana actual
            const weeklyExpenses = expensesResponse.data.filter(
              (expense: any) => {
                const expenseDate = new Date(expense.created);
                return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
              }
            );
            // Calcula el total de los gastos de la semana
            const totalWeeklyExpenses = weeklyExpenses.reduce(
              (accumulator: number, expense: any) =>
                accumulator + expense.amount,
              0
            );
            return totalWeeklyExpenses;
          });
          // Actualiza el estado de gastos con los datos calculados
          setGastos(lastFourWeeks);
        } else {
          console.log("No se encontraron datos de gastos.");
        }
      } catch (error) {
        console.error("Error al obtener datos de gastos:", error);
      }
    };

    // Llama a las funciones para obtener los datos al cargar el componente
    fetchSalesData();
    fetchExpensesData();
  }, []);

  // Opciones de configuración para el gráfico
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: 500, // Establece el espaciado entre las etiquetas
          callback: function (value: string | number) {
            // Muestra solo ciertos valores
            if (value === 500 || value === 1000 || value === 1500) {
              return value.toString();
            }
            return "";
          },
        },
      },
      x: {
        ticks: {
          color: "#000",
        },
      },
    },
    maintainAspectRatio: false, // Esto evita que el gráfico mantenga el aspect ratio
  };

  // Datos del gráfico
  const data = {
    labels: semanas,
    datasets: [
      {
        label: "Beneficios",
        data: beneficios,
        backgroundColor: "#1A3D7D",
      },
      {
        label: "Gastos",
        data: gastos, // Ahora los gastos se muestran como valores positivos
        backgroundColor: "#367DFD",
      },
    ],
  };

  // Componente que muestra el gráfico de barras
  return (
    <div className="BarContainer">
      <div
        style={{
          width: "76vw",
          height: "256px",
          paddingLeft: "69px",
          paddingTop: "7px",
          paddingRight: "8px",
        }}
      >
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export { BarChart };
