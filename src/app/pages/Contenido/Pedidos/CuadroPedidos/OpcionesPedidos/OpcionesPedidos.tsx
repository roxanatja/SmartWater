import { Link } from "react-router-dom";
import "./OpcionesPedidos.css";
import { useContext } from "react";
import { PedidosContext } from "../../PedidosContext";

interface Props {
    isNoRegisteredClient?: boolean;
    onClose?: () => void
}

const OpcionesPedidos = ({ onClose, isNoRegisteredClient }: Props) => {
    const { setShowModal, setShowMiniModal } = useContext(PedidosContext)

    return (
        <>
            {
                isNoRegisteredClient &&
                <button type="button" className="OpcionesPedidos-Item hover:bg-zinc-200 cursor-pointer w-full" onClick={() => {
                    setShowModal(false)
                    setShowMiniModal(true)
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