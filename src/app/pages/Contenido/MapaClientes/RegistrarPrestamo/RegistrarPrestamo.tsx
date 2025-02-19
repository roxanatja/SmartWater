import "../RegistrarPedido/RegistrarPedido.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import RegisterPrestaForm from "../../../EntryComponents/RegisterPrestamo";
import { MapaClientesContext } from "../MapaClientesContext";

const RegistrarPrestamo = () => {
  const { selectedClient } = useContext(MapaClientesContext);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1)
  };

  useEffect(() => {
    if (selectedClient._id === "") {
      navigate("/MapaClientes")
    }
  }, [selectedClient, navigate])

  return (
    <>
      <div className="px-10 h-screen overflow-y-auto">
        <PageTitle titulo="Mapa de Clientes / Registrar préstamo" icon="../clientes-icon.svg" />
        <div
          className="RegistrarVenta-titulo flex items-start cursor-pointer"
          onClick={handleClick}
        >
          <button className="RegistrarVenta-btn">
            <span className="material-symbols-outlined translate-y-0.5 text-blue_custom">
              arrow_back
            </span>
          </button>
          <span className=" text-blue_custom">Regresar</span>
        </div>
        <RegisterPrestaForm selectedClient={selectedClient} />
      </div>
    </>
  );
};

export { RegistrarPrestamo };
