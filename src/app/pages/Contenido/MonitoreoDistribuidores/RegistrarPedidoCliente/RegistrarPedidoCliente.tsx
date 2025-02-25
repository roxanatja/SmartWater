import { FC, useContext, useEffect } from "react";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import RegisterPedidoForm from "../../../EntryComponents/RegisterPedido";
import { MonitoreoDistribuidoresContext } from "../MonitoreoDistribuidoresContext";

const RegistrarPedidoCliente: FC = () => {
  const navigate = useNavigate();
  const { selectedClient } = useContext(MonitoreoDistribuidoresContext)

  const handleClick = () => {
    navigate(-1)
  };

  useEffect(() => {
    if (selectedClient._id === "") {
      navigate("/MonitoreoDistribuidores")
    }
  }, [selectedClient, navigate])

  return (
    <>
      <div className="px-10 h-screen overflow-y-auto">
        <PageTitle titulo="Monitoreo de distribuidores / Registrar pedido" icon="../clientes-icon.svg" />
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
        <RegisterPedidoForm selectedClient={selectedClient} />
      </div>
    </>
  );
};

export { RegistrarPedidoCliente };
