import { useContext } from "react";
import "./OpcionesClientes.css";
import { Link } from "react-router-dom";
import { MonitoreoDistribuidoresContext } from "../MonitoreoDistribuidoresContext";

const OpcionesClientes = ({ onClose }: { onClose: () => void }) => {
  const { setSelectedOption, setShowMiniModal } = useContext(MonitoreoDistribuidoresContext);

  return (
    <>
      <Link
        to={"/MonitoreoDistribuidores/RegistrarPedidoCliente"}
        onClick={() => setShowMiniModal(false)}
        className="opcionesClientes-Item hover:bg-zinc-200 cursor-pointer"
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/Carrito-icon.svg"
            alt=""
            style={{ marginRight: "14px" }}
          />
          <span className="text-blue_custom">Registrar pedido</span>
        </div>

        <i className="fa-solid fa-chevron-right text-blue_custom p-2.5"></i>
      </Link>
      <Link
        to={"/MonitoreoDistribuidores/RegistrarPrestamo"}
        onClick={() => setShowMiniModal(false)}
        className="opcionesClientes-Item hover:bg-zinc-200 cursor-pointer"
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="/HojaMas-icon.svg"
            alt=""
            style={{ marginRight: "15px" }}
          />
          <span className="text-blue_custom">Registrar préstamo</span>
        </div>
        <i className="fa-solid fa-chevron-right text-blue_custom p-2.5"></i>
      </Link>
      <Link
        to={"/MonitoreoDistribuidores/RegistrarDevolucion"}
        onClick={() => setShowMiniModal(false)}
        className="opcionesClientes-Item hover:bg-zinc-200 cursor-pointer"
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg style={{ marginRight: "11px" }} width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.88892 2.61084L2 5.9442L5.88892 9.83313" stroke="#1A3D7D" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M2 5.94434H14.7746C18.5985 5.94434 21.8457 9.06659 21.9946 12.8888C22.1524 16.9278 18.8152 20.3889 14.7746 20.3889H5.33225" stroke="#1A3D7D" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>

          <span className="text-blue_custom">Registrar devolución</span>
        </div>
        <button
          type="button"
          className="btn"
          style={{ marginTop: "5px" }}
          onClick={() => setSelectedOption(false)}
        >
          <i className="fa-solid fa-chevron-right text-blue_custom p-2.5"></i>
        </button>
      </Link>
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

export { OpcionesClientes };
