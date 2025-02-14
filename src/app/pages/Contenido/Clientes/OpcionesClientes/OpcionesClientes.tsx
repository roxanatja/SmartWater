import { useContext } from "react";
import "./OpcionesClientes.css";
import { Link } from "react-router-dom";
import { ClientesContext } from "../ClientesContext";

const OpcionesClientes = ({ onClose }: { onClose: () => void }) => {
  const { setSelectedOption } = useContext(ClientesContext);

  return (
    <>
      <Link
        to={"/Clientes/Registrarventa"}
        className="opcionesClientes-Item hover:bg-zinc-200 cursor-pointer"
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="./ventas-optionIcon.svg"
            alt=""
            style={{ marginRight: "15px" }}
          />
          <span className="text-blue_custom">Registrar Ventas</span>
        </div>
        <i className="fa-solid fa-chevron-right text-blue_custom p-2.5"></i>
      </Link>
      <Link
        to={"/Clientes/RegistrarPedido"}
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
      <Link
        to={"/Clientes/RegistrarPrestamo"}
        className="opcionesClientes-Item hover:bg-zinc-200 cursor-pointer"
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src="./HojaMas-icon.svg"
            alt=""
            style={{ marginRight: "15px" }}
          />
          <span className="text-blue_custom">Registrar préstamo</span>
        </div>
        <i className="fa-solid fa-chevron-right text-blue_custom p-2.5"></i>
      </Link>
      <Link
        to={"/Clientes/RegistrarDevolucion/parcial"}
        className="opcionesClientes-Item hover:bg-zinc-200 cursor-pointer"
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg style={{ marginRight: "11px" }} width="24" height="23" viewBox="0 0 24 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.88892 2.61084L2 5.9442L5.88892 9.83313" stroke="#1A3D7D" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M2 5.94434H14.7746C18.5985 5.94434 21.8457 9.06659 21.9946 12.8888C22.1524 16.9278 18.8152 20.3889 14.7746 20.3889H5.33225" stroke="#1A3D7D" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <span className="text-blue_custom">Registrar devolución parcial</span>
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
      <Link
        to={"/Clientes/RegistrarDevolucion/total"}
        className="opcionesClientes-Item hover:bg-zinc-200 cursor-pointer"
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg
            style={{ marginRight: "16px" }}
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="20"
            viewBox="0 0 18 20"
            fill="none"
          >
            <path
              d="M16.9321 10.9825C16.7433 12.4447 16.166 13.827 15.2622 14.9813C14.3585 16.1356 13.1623 17.0184 11.802 17.5348C10.4418 18.0513 8.96866 18.1821 7.54074 17.9131C6.11282 17.6441 4.78395 16.9856 3.69664 16.008C2.60933 15.0304 1.8046 13.7708 1.36876 12.3641C0.932916 10.9575 0.882404 9.45688 1.22264 8.02329C1.56287 6.58971 2.28102 5.2772 3.30006 4.22654C4.3191 3.17588 5.60059 2.4267 7.00709 2.05935C10.9061 1.04396 14.9421 3.08184 16.4321 6.87938"
              stroke="#1A3D7D"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M17 1.80225V6.87917H12"
              stroke="#1A3D7D"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span className="text-blue_custom">Registrar devolución total</span>
        </div>

        <button
          type="button"
          className="btn"
          style={{ marginTop: "5px" }}
          onClick={() => setSelectedOption(true)}
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
