import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import RegisterPrestaForm from "../../../EntryComponents/RegisterPrestamo";
import { VentasContext } from "../VentasContext";
import { client } from "../../Clientes/ClientesContext";

const RegistrarPrestamo = () => {
  const { setSelectedClient, selectedClient } = useContext(VentasContext);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/Ventas");
    setSelectedClient(client);
  };

  return (
    <>
      <div>
        <PageTitle titulo="Clientes/Prestamos" icon="../clientes-icon.svg" />
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
        <RegisterPrestaForm selectedClient={selectedClient} />
      </div>
    </>
  );
};

export { RegistrarPrestamo };
