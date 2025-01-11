import { Link } from "react-router-dom";
import "./OpcionesPedidos.css";

interface Props {
    isNoRegisteredClient?: boolean;
    onClose?: () => void
}

const OpcionesPedidos = ({ onClose, isNoRegisteredClient }: Props) => {
    return (
        <>
            {
                isNoRegisteredClient &&
                <button type="button" className="OpcionesPedidos-Item hover:bg-zinc-200 cursor-pointer w-full" onClick={() => {
                    alert("registrar cliente");
                    if (onClose) onClose()
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
            }

            <Link
                to={"/Pedidos/RegistrarVenta"}
                className={`OpcionesPedidos-Item hover:bg-zinc-200 cursor-pointer ${isNoRegisteredClient && "opacity-50 pointer-events-none"}`}
            >
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                        src="/ventas-optionIcon.svg"
                        alt=""
                        style={{ marginRight: "15px" }}
                    />
                    <span className="text-blue_custom">Registrar Ventas</span>
                </div>
                <i className="fa-solid fa-chevron-right text-blue_custom p-2.5"></i>
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
    )
}

export { OpcionesPedidos }