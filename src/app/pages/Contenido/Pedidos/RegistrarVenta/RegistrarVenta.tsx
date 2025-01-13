import { FC, useContext, useEffect } from "react";
import "./RegistrarVenta.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import { PedidosContext } from "../PedidosContext";
import { client } from "../../Clientes/ClientesContext";
import RegisterPedidoForm from "../../../EntryComponents/RegisterPedido";
import { Client } from "../../../../../type/Cliente/Client";

const RegistrarVenta: FC = () => {
  const { setSelectedClient, selectedClient } = useContext(PedidosContext);
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
        <PageTitle titulo="Pedidos / Registrar pedido" icon="/Pedidos-icon.svg" />
        <div
          className="RegistrarVenta-titulo flex items-start cursor-pointer"
          onClick={handleClick}
        >
          <button className="RegistrarVenta-btn">
            <span className="material-symbols-outlined text-blue_custom translate-y-0.5">
              arrow_back
            </span>
          </button>
          <span className="text-blue_custom">Regresar</span>
        </div>

        <RegisterPedidoForm selectedClient={selectedClient as unknown as Client} isNoClient={!selectedClient.isClient} />
      </div>
    </>
  );
};

export { RegistrarVenta };
