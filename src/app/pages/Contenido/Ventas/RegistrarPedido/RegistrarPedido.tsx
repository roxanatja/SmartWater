import { FC, useContext, useEffect } from "react";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";
import RegisterPedidoForm from "../../../EntryComponents/RegisterPedido";
import { VentasContext } from "../VentasContext";
import { client } from "../../Clientes/ClientesContext";

const RegistrarPedido: FC = () => {
  const navigate = useNavigate();
  const { selectedClient, setSelectedClient } = useContext(VentasContext);

  const handleClick = () => {
    setSelectedClient(client)
  };

  useEffect(() => {
    if (selectedClient._id === "") {
      navigate(-1)
    }
  }, [selectedClient, navigate])

  return (
    <>
      <div className="px-10 h-screen overflow-y-auto">
        <PageTitle titulo="Ventas / Registrar pedido" icon="../clientes-icon.svg" />
        <div
          className="RegistrarVenta-titulo flex items-start cursor-pointer"
          onClick={handleClick}
        >
          <button className="RegistrarVenta-btn text-blue_custom">
            <span className="material-symbols-outlined translate-y-0.5">
              arrow_back
            </span>
          </button>
          <span className=" text-blue_custom">Regresar</span>
        </div>
        <RegisterPedidoForm selectedClient={selectedClient} />
      </div>
    </>
  );
};

export { RegistrarPedido };
