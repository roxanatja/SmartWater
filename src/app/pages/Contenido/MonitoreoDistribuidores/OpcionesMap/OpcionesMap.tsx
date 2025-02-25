import { useContext } from "react";
import "./OpcionesMap.css";
import { Link } from "react-router-dom";
import { MonitoreoDistribuidoresContext } from "../MonitoreoDistribuidoresContext";

const OpcionesMap = ({ onClose }: { onClose: () => void }) => {
  const { setSelectedOption, setShowModal } = useContext(MonitoreoDistribuidoresContext);

  return (
    <>
      <Link
        to={"/MonitoreoDistribuidores/RegistrarPedido"}
        onClick={() => setSelectedOption(false)}
        className="opcionesClientes-Item hover:bg-zinc-200 cursor-pointer"
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="./Carrito-icon.svg"
            alt=""
            style={{ marginRight: "14px" }}
          />
          <span className="text-blue_custom">Registrar pedido</span>
        </div>

        <i className="fa-solid fa-chevron-right text-blue_custom p-2.5"></i>
      </Link>
      <button type="button" className="OpcionesPedidos-Item hover:bg-zinc-200 cursor-pointer w-full" onClick={() => {
        setShowModal(true)
        setSelectedOption(false)
      }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/add-client.svg"
            alt=""
            style={{ marginRight: "15px" }}
          />
          <span className="text-blue_custom">Registrar Cliente</span>
        </div>
        <i className="fa-solid fa-chevron-right text-blue_custom p-2.5"></i>
      </button>
      <div
        style={{
          width: "100%",
          marginTop: "15px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <button
          type="button"
          className="opcionesClientes-Btn"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </>
  );
};

export { OpcionesMap };
