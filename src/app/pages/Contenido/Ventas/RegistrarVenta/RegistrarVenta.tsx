import { FC, useContext } from "react";
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

  return (
    <>
      <div>
        <PageTitle titulo="Clientes" icon="../clientes-icon.svg" />
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
        <RegisterSalesForm selectedClient={selectedClient} />
      </div>
    </>
  );
};

export { RegistrarVenta };
