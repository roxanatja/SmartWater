import "../RegistrarPedido/RegistrarPedido.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { ClientesContext, client } from "../ClientesContext";
import RegisterPrestaForm from "../../../EntryComponents/RegisterPrestamo";

const RegistrarPrestamo = () => {
  const { setSelectedClient } = useContext(ClientesContext);
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/Clientes");
    setSelectedClient(client);
  };
  const { selectedClient } = useContext(ClientesContext);

  useEffect(() => {
    if (selectedClient._id === "") {
      navigate("/Clientes")
    }
  }, [selectedClient, navigate])

  return (
    <>
      <div className="px-10 h-screen overflow-y-auto">
        <PageTitle titulo="Clientes/ Registrar préstamo" icon="../clientes-icon.svg" />
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
