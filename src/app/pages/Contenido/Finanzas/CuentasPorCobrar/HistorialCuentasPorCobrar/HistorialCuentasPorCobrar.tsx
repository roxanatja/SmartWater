import { FC, useCallback, useContext, useEffect, useState } from "react";
import "./HistorialCuentasPorCobrar.css";
import { PageTitle } from "../../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../../components/FiltroPaginado/FiltroPaginado";
import { SmartwaterContext } from "../../../../../SmartwaterContext";
import { CuadroHistorialCliente } from "./CuadroHistorialCliente/CuadroHistorialCliente";
import { useNavigate } from "react-router-dom";
import { CuentasPorCobrarContext } from "../CuentasPorCobrarContext";
import { FiltroHistorialCuentasPorCobrar } from "./FiltroHistorialCuentasPorCobrar/FiltroHistorialCuentasPorCobrar";
import { Sale } from "../../../../../../type/Sale/Sale";
import ApiMethodSales from "../../../../../../Class/api.sales";
import Product from "../../../../../../type/Products/Products";
import { Bills } from "../../../../../../type/Bills";
import ApiMethodBills from "../../../../../../Class/api.bills";
import { CobrosClientes } from "../CuadroCuentasPorCobrar/CobrosClientes";
import { User } from "../../../../../../type/User";

const HistorialCuentasPorCobrar: FC = () => {
  const { selectedOption } = useContext(SmartwaterContext);
  const { setShowMiniModal, showFiltro, setShowFiltro, clientselect } =
    useContext(CuentasPorCobrarContext);
  const [data, setData] = useState<{
    sales?: Sale[];
    products?: Product[];
    bills?: Bills[];
    user?: User[];
  }>();

  const getData = useCallback(async () => {
    const api = new ApiMethodSales();
    const salesData = await api.GetSales({ client: clientselect?._id || "" });
    const apiBills = new ApiMethodBills();
    return setData({
      sales: salesData.filter((x) => x.creditSale === true),
      products: await api.GetProducts(),
      bills: await apiBills.GetBills({
        client: clientselect?._id || "",
      }),
      user: await api.getUser(),
    });
  }, [clientselect]);

  useEffect(() => {
    getData();
  }, [getData]);

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Finanzas/CuentasPorCobrarCobros");
    setShowMiniModal(false);
  };

  const Onfilter = () => {
    setShowFiltro(true);
  };

  return (
    <>
      <div>
        <div>
          <button className="btn" onClick={handleClick}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </div>
        <PageTitle titulo="Historial" icon="../../Finanzas-icon.svg" />
        <FiltroPaginado
          filtro
          swith
          infoPedidos
          opcionesSwitch1="Ventas al crédito"
          opcionesSwitch2="Cobros"
          finanzas
          onFilter={Onfilter}
        >
          <div
            className={`grid grid-cols-2 max-sm:grid-cols-1 gap-4 py-2 transition-all ${
              !selectedOption ? "" : "scale-0 -z-10 fixed"
            }`}
          >
            {data?.sales &&
              data.sales.map((row, index) => (
                <CuadroHistorialCliente
                  sale={row}
                  products={data.products || []}
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
            {data?.bills &&
              data?.bills.map((row, index) => (
                <CobrosClientes
                  bill={row}
                  key={index}
                  user={data?.user || []}
                  onSendBill={() => getData()}
                />
              ))}
          </div>
        </FiltroPaginado>
      </div>
      {showFiltro && <FiltroHistorialCuentasPorCobrar />}
    </>
  );
};

export { HistorialCuentasPorCobrar };
