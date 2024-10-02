import { useContext } from "react";
import { Link } from "react-router-dom";
import "./OpcionesCuentasCobrar.css";
import { CuentasPorCobrarContext } from "../CuentasPorCobrarContext";

const OpcionesCuentasCobrar = () => {
  const { setShowMiniModal } = useContext(CuentasPorCobrarContext);

  return (
    <>
      <div className="z-10 p-6">
        <Link
          to={"/Finanzas/CuentasPorCobrarCobros/Historial"}
          className="flex justify-between items-center translate-y-5 hover:bg-zinc-300 mb-8"
        >
          <div className="flex gap-2 items-center">
            <i className="fa-regular fa-clock text-xl text-blue_custom"></i>
            <span className="text-base text-blue_custom">Historial</span>
          </div>
          <button type="button" className="btn" style={{ marginTop: "5px" }}>
            <span
              className="material-symbols-outlined"
              style={{ color: "#1A3D7D" }}
            >
              chevron_right
            </span>
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
            onClick={() => setShowMiniModal(false)}
          >
            Cerrar
          </button>
        </div>
      </div>
    </>
  );
};

export { OpcionesCuentasCobrar };
