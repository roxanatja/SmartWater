import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import RegisterDevoluForm from "../../../EntryComponents/RegisterDevolu";
import { VentasContext } from "../VentasContext";
import { client } from "../../Clientes/ClientesContext";

const RegistrarDevolucion = () => {
  const { setSelectedClient, selectedClient } = useContext(VentasContext);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/Ventas");
    setSelectedClient(client);
  };

  return (
    <>
      <div className="px-10">
        <PageTitle titulo="Ventas / Registrar devolución" icon="/Ventas-icon.svg" />
        <div
          className="RegistrarVenta-titulo flex items-start cursor-pointer"
          onClick={handleClick}
        >
          <button className="RegistrarVenta-btn text-blue_custom">
            <span className="material-symbols-outlined translate-y-0.5">
              arrow_back
            </span>
          </button>
          <span className="text-blue_custom">Regresar</span>
        </div>
        <RegisterDevoluForm selectedClient={selectedClient} />
      </div>
    </>
  );
};

export { RegistrarDevolucion };
