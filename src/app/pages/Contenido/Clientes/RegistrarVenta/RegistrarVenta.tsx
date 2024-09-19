import { FC, useContext } from "react";
import "./RegistrarVenta.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";

import RegisterSalesForm from "../../../EntryComponents/RegisterSalesForm";
import { ClientesContext, client } from "../ClientesContext";

const RegistrarVenta: FC = () => {
  const { setSelectedClient } = useContext(ClientesContext);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Clientes");
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
        <RegisterSalesForm />
      </div>
    </>
  );
};

export { RegistrarVenta };
