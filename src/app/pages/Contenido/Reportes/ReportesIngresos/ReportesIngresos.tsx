import { FC, useCallback, useContext, useEffect, useState } from "react";
import "./ReportesIngresos.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { Link } from "react-router-dom";
import { ReportesIngresosContext } from "./ReportesIngresosContext";
import { FiltroVenta } from "./FiltroVenta/FiltroVenta";
import { FiltroCuentasPorCobrar } from "./FiltroCuentasPorCobrar/FiltroCuentasPorCobrar";
import { FiltroPrestamos } from "./FiltroPrestamos/FiltroPrestamos";
import { FiltroEgresosGastos } from "./FiltroEgresosGastos/FiltroEgresosGastos";
import Modal from "../../../EntryComponents/Modal";
import { Client } from "../../../../../type/Cliente/Client";
import FiltroClientes from "./FiltroClientes/FiltroClientes";
import * as XLSX from "xlsx";
import { ClientsApiConector } from "../../../../../api/classes";

const ReportesIngresos: FC = () => {
  const {
    clientes,
    setClientes,
    egresosGastos,
    setEgresosGastos,
    prestamos,
    setPrestamos,
    cuentasPorCobrarCobros,
    setCuentasPorCobrarCobros,
    ventas,
    setVentas,
  } = useContext(ReportesIngresosContext);
  const [savedFilters, setSavedFilters] = useState({});
  const [data, setData] = useState<{ client?: Client[] }>();

  const getClients = useCallback(async () => {
    const datClien = (await ClientsApiConector.getClients({ pagination: { page: 1, pageSize: 3000 } }))?.data || [];
    setData({
      client: datClien as unknown as Client[],
    });
  }, []);

  useEffect(() => {
    getClients();
  }, [getClients]);

  const exportToExcel = (data: any, fileName: string) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "DatosFiltrados");
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  };

  return (
    <>
      <div>
        <PageTitle
          titulo="Reportes ingresos / C.por cobrar"
          icon="../../Reportes-icon.svg"
        />
        <div className="ReportesIngresos-container">
          <button
            className="ReportesIngresos-item"
            onClick={() => setClientes(true)}
          >
            <img src="/client.svg" alt="/client.svg" />
            <span>Clientes</span>
          </button>
          <button
            className="ReportesIngresos-item"
            onClick={() => setVentas(true)}
          >
            <img src="/venta.svg" alt="/venta.svg" />
            <span>Ventas</span>
          </button>
          <button
            className="ReportesIngresos-item"
            onClick={() => setCuentasPorCobrarCobros(true)}
          >
            <img src="/cxc.svg" alt="/cxc.svg" />
            <span>Cuentas por cobrar</span>
          </button>
          <button
            className="ReportesIngresos-item"
            onClick={() => setPrestamos(true)}
          >
            <img src="/prestamos.svg" alt="/prestamos.svg" />
            <span>Préstamos</span>
          </button>
          <button
            className="ReportesIngresos-item"
            onClick={() => setEgresosGastos(true)}
          >
            <img src="/egreso.svg" alt="/egreso.svg" />
            <span>Egresos y gastos</span>
          </button>
          <Link to={"/Reportes/Ingresos/Graficos"}>
            <div className="ReportesIngresos-item">
              <img src="/grafico.svg" alt="/grafico.svg" />
              <span>Gráficos</span>
            </div>
          </Link>
        </div>
      </div>
      <Modal isOpen={clientes} onClose={() => setClientes(false)}>
        <FiltroClientes
          clients={data?.client}
          initialFilters={savedFilters}
          onChange={(val, filter) => {
            setSavedFilters(filter);
            if (filter !== "quit") {
              exportToExcel(val, "ReportClient");
            }
          }}
        />
      </Modal>
      {ventas && <FiltroVenta />}
      {cuentasPorCobrarCobros && <FiltroCuentasPorCobrar />}
      {prestamos && <FiltroPrestamos />}
      {egresosGastos && <FiltroEgresosGastos />}
    </>
  );
};

export { ReportesIngresos };
