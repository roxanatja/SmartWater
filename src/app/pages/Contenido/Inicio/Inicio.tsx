import { useEffect, useState } from "react";
import { BarChart } from "../../components/Barchart/Barchart";
import { CuadroClientes } from "../../components/CuadroClientes/CuadroClientes";
import { CuadroInformativo } from "../../components/CuadroInformativo/CuadroInformativo";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { FC } from "react";
import PedidosResumido from "../Pedidos/CuadroPedidos/PedidosResumido";
import { ClientsApiConector, LoansApiConector, OrdersApiConector, SalesApiConector } from "../../../../api/classes";
import "./Inicio.css";
import moment from "moment";

const Inicio: FC = () => {
  const [clientsCount, setClientsCount] = useState<number | undefined>(undefined);
  const [clientsLastMonthCount, setClientsLastMonthCount] = useState<number | undefined>(undefined);
  const [activeLoansCount, setActiveLoansCount] = useState<number | undefined>(undefined);
  const [loansLastMonthCount, setLoansLastMonthCount] = useState<number | undefined>(undefined);
  const [activeSalesCount, setActiveSalesCount] = useState<number | undefined>(undefined);
  const [salesLastMonthCount, setSalesLastMonthCount] = useState<number | undefined>(undefined);
  const [activeOrdersCount, setActiveordersCount] = useState<number | undefined>(undefined);
  const [ordersLastMonthCount, setOrdersLastMonthCount] = useState<number | undefined>(undefined);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalIncomeMonth, setTotalIncomeMonth] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;

        const promises = [
          ClientsApiConector.getClients({ pagination: { page: 1, pageSize: 1 } }),
          ClientsApiConector.getClients({ filters: { month, year }, pagination: { page: 1, pageSize: 1 } }),
          LoansApiConector.get({ pagination: { page: 1, pageSize: 1 } }),
          LoansApiConector.get({ filters: { month, year }, pagination: { page: 1, pageSize: 1 } }),
          SalesApiConector.get({ pagination: { page: 1, pageSize: 1 } }),
          SalesApiConector.get({ filters: { month, year }, pagination: { page: 1, pageSize: 1 } }),
          OrdersApiConector.get({ filters: { attended: false }, pagination: { page: 1, pageSize: 1 } }),
          OrdersApiConector.get({ filters: { attended: false, month, year }, pagination: { page: 1, pageSize: 1 } })
        ]

        const salesPromises = [
          SalesApiConector.getSalesConsolidated({}),
          SalesApiConector.getSalesConsolidated({ filters: { initialDate: moment().startOf('month').toDate().toISOString(), finalDate: moment().endOf('month').toDate().toISOString() } })
        ]

        const [clientsData, clientsLastMonth, loansData, loansLastMonth, salesData, salesLastMonth, activeOrdersCountRes, ordersLastMonthCountRes] = await Promise.all(promises)
        const [salesConsolidated, salesConsolidatedEnd] = await Promise.all(salesPromises)

        // Cargar clientes y calcular clientes del último mes (julio en este momento)
        setClientsCount(clientsData?.metadata.totalCount || 0);
        setClientsLastMonthCount(clientsLastMonth?.metadata.totalCount || 0);

        // Cargar préstamos activos y calcular préstamos del último mes (julio en este momento)
        setActiveLoansCount(loansData?.metadata.totalCount || 0); // Total de préstamos activos
        setLoansLastMonthCount(loansLastMonth?.metadata.totalCount || 0); // Préstamos del último mes

        // Cargar ventas activas y calcular ventas del último mes (julio en este momento)
        setActiveSalesCount(salesData?.metadata.totalCount || 0); // Total de ventas activas
        setSalesLastMonthCount(salesLastMonth?.metadata.totalCount || 0); // Ventas del último mes

        setActiveordersCount(activeOrdersCountRes?.metadata.totalCount || 0); // Total de ventas activas
        setOrdersLastMonthCount(ordersLastMonthCountRes?.metadata.totalCount || 0); // Ventas del último mes


        const totalIncome = (salesConsolidated || []).reduce((sum, res) => sum += res.total * res.quantity, 0);
        setTotalIncome(parseFloat(totalIncome.toFixed(2)));
        const totalIncomeMonth = (salesConsolidatedEnd || []).reduce((sum, res) => sum += res.total * res.quantity, 0);
        setTotalIncomeMonth(parseFloat(totalIncomeMonth.toFixed(2)));
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  const calculatePercentage = (current: number, total: number): number => {
    if (typeof current !== "number" || typeof total !== "number" || total === 0)
      return 0;
    return (current / total) * 100;
  };

  return (
    <>
      <div className="px-10 pb-10">
        <PageTitle titulo="Inicio" icon="./home-icon.svg" />
        <div className="Cuadros-informativos">
          <CuadroInformativo
            titulo="Clientes nuevos"
            numero={
              clientsCount !== undefined
                ? clientsCount.toString()
                : ""
            }
            porcentaje={
              clientsCount !== undefined && clientsLastMonthCount !== undefined
                ? calculatePercentage(clientsLastMonthCount, clientsCount)
                : undefined
            }
          />

          <CuadroInformativo
            titulo="Préstamos activos"
            numero={
              activeLoansCount !== undefined
                ? activeLoansCount.toString()
                : ""
            }
            porcentaje={
              activeLoansCount !== undefined &&
                loansLastMonthCount !== undefined
                ? calculatePercentage(loansLastMonthCount, activeLoansCount)
                : undefined
            }
          />

          <CuadroInformativo
            titulo="Pedidos en curso"
            numero={
              activeOrdersCount !== undefined
                ? activeOrdersCount.toString()
                : ""
            }
            porcentaje={
              activeOrdersCount !== undefined &&
                ordersLastMonthCount !== undefined
                ? calculatePercentage(ordersLastMonthCount, activeOrdersCount)
                : undefined
            }
          />

          <CuadroInformativo
            titulo="Ventas Totales"
            numero={
              activeSalesCount !== undefined
                ? activeSalesCount.toString()
                : ""
            }
            porcentaje={
              activeSalesCount !== undefined &&
                salesLastMonthCount !== undefined
                ? calculatePercentage(salesLastMonthCount, activeSalesCount)
                : undefined
            }
          />

          <CuadroInformativo
            mostrar_ultimo_mes_text={false}
            titulo="Ingresos Totales"
            numero={totalIncome.toString()}
            letra="Bs"
            porcentaje={calculatePercentage(totalIncomeMonth, totalIncome)}
          />
        </div>
        <div className="sub-title">
          <span>Acciones rápidas</span>
        </div>
        <div className="Cuadros">
          <div>
            <CuadroClientes />
          </div>
          {/* <div>
            <CuadroRealizarPedido />
          </div> */}
          <div>
            <PedidosResumido />
          </div>
        </div>
        <BarChart />
      </div>
    </>
  );
};

export { Inicio };
