import { FC, useContext, useEffect } from "react";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";

import RegisterSalesForm from "../../../EntryComponents/RegisterSalesForm";
import { VentasContext } from "../VentasContext";
import { client } from "../../Clientes/ClientesContext";

const RegistrarVenta: FC = () => {
  const { setSelectedClient, selectedClient } = useContext(VentasContext);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Ventas");
    setSelectedClient(client);
  };
  
  useEffect(() => {
    if (selectedClient._id === "") {
        navigate("/Ventas")
    }
}, [selectedClient, navigate])

  return (
    <>
      <div className="px-10">
        <PageTitle titulo="Ventas / Registrar venta" icon="../Ventas-icon.svg" />
        <div
          className="RegistrarVenta-titulo flex items-start cursor-pointer"
          onClick={handleClick}
        >
          <button className="RegistrarVenta-btn">
            <span className="material-symbols-outlined text-blue_custom translate-y-0.5">
              arrow_back
            </span>
          </button>
          <span className="text-blue_custom">Regresar</span>
        </div>
        <RegisterSalesForm selectedClient={selectedClient} />
      </div>
    </>
  );
};

export { RegistrarVenta };
