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
      <div>
        <PageTitle titulo="Clientes/Devolucion" icon="../clientes-icon.svg" />
        <div
          className="RegistrarVenta-titulo flex items-start cursor-pointer"
          onClick={handleClick}
        >
          <button className="RegistrarVenta-btn">
            <span className="material-symbols-outlined translate-y-0.5">
              arrow_back
            </span>
          </button>
          <span>Regresar</span>
        </div>
        <RegisterDevoluForm selectedClient={selectedClient} />
      </div>
    </>
  );
};

export { RegistrarDevolucion };
