import { useEffect, useState } from "react";
import { BarChart } from "../../components/Barchart/Barchart";
import { CuadroClientes } from "../../components/CuadroClientes/CuadroClientes";
import { CuadroInformativo } from "../../components/CuadroInformativo/CuadroInformativo";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { FC } from "react";
import { Sale } from "../../../../type/Sale/Sale";
import PedidosResumido from "../Pedidos/CuadroPedidos/PedidosResumido";
import { ClientsApiConector, LoansApiConector, SalesApiConector } from "../../../../api/classes";
import "./Inicio.css";

const Inicio: FC = () => {
  const [clientsCount, setClientsCount] = useState<number | undefined>(
    undefined
  );
  const [clientsLastMonthCount, setClientsLastMonthCount] = useState<
    number | undefined
  >(undefined);
  const [activeLoansCount, setActiveLoansCount] = useState<number | undefined>(
    undefined
  );
  const [loansLastMonthCount, setLoansLastMonthCount] = useState<
    number | undefined
  >(undefined);
  const [activeSalesCount, setActiveSalesCount] = useState<number | undefined>(
    undefined
  );
  const [salesLastMonthCount, setSalesLastMonthCount] = useState<
    number | undefined
  >(undefined);
  const [totalIncome, setTotalIncome] = useState<number>(0);

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
          SalesApiConector.get({}),
          SalesApiConector.get({ filters: { month, year }, pagination: { page: 1, pageSize: 1 } })
        ]

        const [clientsData, clientsLastMonth, loansData, loansLastMonth, salesData, salesLastMonth] = await Promise.all(promises)

        // Cargar clientes y calcular clientes del último mes (julio en este momento)
        setClientsCount(clientsData?.metadata.totalCount || 0);
        setClientsLastMonthCount(clientsLastMonth?.metadata.totalCount || 0);

        // Cargar préstamos activos y calcular préstamos del último mes (julio en este momento)
        setActiveLoansCount(loansData?.metadata.totalCount || 0); // Total de préstamos activos
        setLoansLastMonthCount(loansLastMonth?.metadata.totalCount || 0); // Préstamos del último mes

        // Cargar ventas activas y calcular ventas del último mes (julio en este momento)
        setActiveSalesCount(salesData?.metadata.totalCount); // Total de ventas activas
        setSalesLastMonthCount(salesLastMonth?.metadata.totalCount); // Ventas del último mes

        const totalIncome = (salesData?.data as Sale[]).reduce((sum: number, sale: Sale) => sum + sale.total, 0);
        setTotalIncome(totalIncome);
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
      <div className="px-10">
        <PageTitle titulo="Inicio" icon="./home-icon.svg" />
        <div className="Cuadros-informativos">
          <CuadroInformativo
            titulo="Clientes nuevos"
            numero={
              clientsLastMonthCount !== undefined
                ? clientsLastMonthCount.toString()
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
              loansLastMonthCount !== undefined
                ? loansLastMonthCount.toString()
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
            titulo="Ventas Totales"
            numero={
              salesLastMonthCount !== undefined
                ? salesLastMonthCount.toString()
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
            porcentaje={100}
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
