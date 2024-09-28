import { FC, useContext } from "react";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import RegisterPedidoForm from "../../../EntryComponents/RegisterPedido";
import { ClientesContext } from "../../Clientes/ClientesContext";

const RegistrarPedido: FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/MapaClientes");
  };
  const { selectedClient } = useContext(ClientesContext);

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
        <RegisterPedidoForm selectedClient={selectedClient} isNoClient={true} />
      </div>
    </>
  );
};

export { RegistrarPedido };
