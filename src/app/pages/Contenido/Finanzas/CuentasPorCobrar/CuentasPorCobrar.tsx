import { useCallback, useContext, useEffect, useState } from "react";
import "./CuentasPorCobrar.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { SmartwaterContext } from "../../../../SmartwaterContext";
import { CuadroCuentasPorCobrar } from "./CuadroCuentasPorCobrar/CuadroCuentasPorCobrar";
import { CobrosClientes } from "./CuadroCuentasPorCobrar/CobrosClientes";
import { OpcionesCuentasCobrar } from "./OpcionesCuentasCobrar/OpcionesCuentasCobrar";
import { CuentasPorCobrarContext } from "./CuentasPorCobrarContext";
import { FiltroCuentasPorCobrar } from "./FiltroCuentasPorCobrar/FiltroCuentasPorCobrar";
import { Sale } from "../../../../../type/Sale/Sale";
import ApiMethodSales from "../../../../../Class/api.sales";
import ApiMethodClient from "../../../../../Class/api.client";
import { Client } from "../../../../../Class/types.data";
import Modal from "../../../EntryComponents/Modal";

const CuentasPorCobrar = () => {
  const { selectedOption, setSelectedOption } = useContext(SmartwaterContext);
  const { showMiniModal, showFiltro, setShowFiltro, setShowMiniModal } =
    useContext(CuentasPorCobrarContext);
  const [data, setData] = useState<{
    sales?: Sale[];
    uniqueSales?: Client[];
  }>();

  const getData = useCallback(async () => {
    const api = new ApiMethodSales();
    const apiCl = new ApiMethodClient();
    const salesData = await api.GetSales();
    const clientData = await apiCl.loadClients();
    return setData({
      sales: salesData.filter((x) => x.creditSale === true && x.total > 0),
      uniqueSales: clientData.filter((x) => Number(x.credit) > 0),
    });
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  const Onfilter = () => {
    setShowFiltro(true);
  };

  useEffect(() => {
    setSelectedOption(false);
  }, [setSelectedOption]);

  return (
    <>
      <div>
        <PageTitle
          titulo="Cuentas por cobrar / cobros"
          icon="../Finanzas-icon.svg"
        />
        <FiltroPaginado
          filtro
          onFilter={Onfilter}
          swith
          opcionesSwitch1="Cuentas por cobrar"
          opcionesSwitch2="Cobros a clientes"
          finanzas
        >
          <div
            className={`grid grid-cols-4 gap-4 py-2 transition-all md:grid-cols-3 ${
              !selectedOption ? "" : "scale-0 -z-10 fixed"
            }`}
          >
            {data?.sales &&
              data.sales.map((row, index) => (
                <CuadroCuentasPorCobrar
                  sale={row}
                  key={index}
                  onSendBill={() => getData()}
                />
              ))}
          </div>
          <div
            className={`grid grid-cols-4 gap-4 py-2 transition-all md:grid-cols-3 ${
              selectedOption ? "" : "scale-0 -z-10 fixed"
            }`}
          >
            {data?.uniqueSales &&
              data?.uniqueSales.map((row, index) => (
                <CobrosClientes
                  sale={row}
                  key={index}
                  onSendBill={() => getData()}
                />
              ))}
          </div>
        </FiltroPaginado>
      </div>
      {showFiltro && <FiltroCuentasPorCobrar />}
      <Modal
        isOpen={showMiniModal}
        onClose={() => setShowMiniModal(false)}
        className="lg:w-2/12"
      >
        <OpcionesCuentasCobrar />
      </Modal>
    </>
  );
};

export { CuentasPorCobrar };
