import { useEffect, useState } from "react";
import { BarChart } from "../../components/Barchart/Barchart";
import { CuadroClientes } from "../../components/CuadroClientes/CuadroClientes";
import {
  CuadroInformativo,
  CuadroInformativo2,
} from "../../components/CuadroInformativo/CuadroInformativo";
import { CuadroRealizarPedido } from "../../components/CuadroRealizarPedido/CuadroRealizarPedido";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { FC } from "react";
import "./Inicio.css";
import { Client } from "../../../../type/Cliente/Client";
import { Sale } from "../../../../type/Sale/Sale";
import { loadClients } from "../../../../services/ClientsService";
import { GetLoans } from "../../../../services/LoansService";
import { GetSales } from "../../../../services/SaleService";

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
        // Cargar clientes y calcular clientes del último mes (julio en este momento)
        const clientsData = await loadClients();
        if (clientsData && clientsData.data) {
          const currentDate = new Date();
          const firstDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          );

          const filteredClients = clientsData.data.filter((client: Client) => {
            const clientCreatedDate = new Date(client.created);
            return (
              clientCreatedDate >= firstDayOfMonth &&
              clientCreatedDate <= currentDate
            );
          });

          setClientsCount(clientsData.data.length);
          setClientsLastMonthCount(filteredClients.length);
        }

        // Cargar préstamos activos y calcular préstamos del último mes (julio en este momento)
        const loansData = await GetLoans();
        if (loansData && loansData.data) {
          const currentDate = new Date();
          const firstDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          );

          const filteredLoans = loansData.data.filter((loan: any) => {
            const loanCreatedDate = new Date(loan.created);
            return (
              loanCreatedDate >= firstDayOfMonth &&
              loanCreatedDate <= currentDate
            );
          });

          setActiveLoansCount(loansData.data.length); // Total de préstamos activos
          setLoansLastMonthCount(filteredLoans.length); // Préstamos del último mes
        }

        // Cargar ventas activas y calcular ventas del último mes (julio en este momento)
        const salesData = await GetSales();
        if (salesData && salesData.data) {
          const currentDate = new Date();
          const firstDayOfMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
          );

          const filteredSales = salesData.data.filter((sale: Sale) => {
            const saleCreatedDate = new Date(sale.created);
            return (
              saleCreatedDate >= firstDayOfMonth &&
              saleCreatedDate <= currentDate
            );
          });

          setActiveSalesCount(salesData.data.length); // Total de ventas activas
          setSalesLastMonthCount(filteredSales.length); // Ventas del último mes

          const totalIncome = salesData.data.reduce(
            (sum: number, sale: Sale) => sum + sale.total,
            0
          );
          setTotalIncome(totalIncome);
        }
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
      <div>
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

          <CuadroInformativo2
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
          <div>
            <CuadroRealizarPedido />
          </div>
        </div>
        <BarChart />
      </div>
    </>
  );
};

export { Inicio };
