import "../RegistrarPedido/RegistrarPedido.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ClientesContext, client } from "../ClientesContext";

import RegisterDevoluForm from "../../../EntryComponents/RegisterDevolu";

const RegistrarDevolucion = () => {
  const { setSelectedClient, selectedClient } = useContext(ClientesContext);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/Clientes");
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
