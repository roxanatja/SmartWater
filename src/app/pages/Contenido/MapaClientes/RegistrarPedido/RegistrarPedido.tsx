import { FC } from "react";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import RegisterPedidoForm from "../../../EntryComponents/RegisterPedido";
import { clientWithStatus } from "../MapaClientesContext";

const RegistrarPedido: FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1)
  };

  return (
    <>
      <div className="px-10 h-screen overflow-y-auto">
        <PageTitle titulo="Mapa de clientes / Registrar pedido" icon="../clientes-icon.svg" />
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
        <RegisterPedidoForm selectedClient={clientWithStatus} isNoClient={true} fromMap />
      </div>
    </>
  );
};

export { RegistrarPedido };
