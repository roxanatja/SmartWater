import { FC, useContext, useEffect } from "react";
import "./RegistrarVenta.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";

import RegisterSalesForm from "../../../EntryComponents/RegisterSalesForm";
import { ClientesContext, client } from "../ClientesContext";

const RegistrarVenta: FC = () => {
  const { setSelectedClient, selectedClient } = useContext(ClientesContext);
  const navigate = useNavigate();

  const handleClick = () => {
    setSelectedClient(client);
  };

  useEffect(() => {
    if (selectedClient._id === "") {
      navigate(-1)
    }
  }, [selectedClient, navigate])

  return (
    <>
      <div className="px-10 h-screen overflow-y-auto">
        <PageTitle titulo="Clientes / Registrar venta" icon="../clientes-icon.svg" />
        <div
          className="RegistrarVenta-titulo flex items-start cursor-pointer"
          onClick={handleClick}
        >
          <button className="RegistrarVenta-btn">
            <span className="material-symbols-outlined translate-y-0.5 text-blue_custom">
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
