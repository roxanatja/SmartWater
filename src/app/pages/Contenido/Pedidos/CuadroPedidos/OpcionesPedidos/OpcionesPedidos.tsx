import { Link } from "react-router-dom";
import "./OpcionesPedidos.css";

const OpcionesPedidos = ({ onClose }: { onClose?: () => void }) => {
    return (
        <>
            <Link
                to={"/Pedidos/RegistrarPedido"}
                className="OpcionesPedidos-Item hover:bg-zinc-200 cursor-pointer"
            >
                <div style={{ display: "flex", alignItems: "center" }}>
                    <svg className="mr-[15px]" xmlns="http://www.w3.org/2000/svg" width="25" height="22" viewBox="0 0 25 22" fill="none">
                        <g clipPath="url(#clip0_1121_2214)">
                            <path d="M9.83333 1.50977V3.8431H7.5C6.94583 3.8431 6.5 4.28893 6.5 4.8431V6.8431C6.5 7.39727 6.94583 7.8431 7.5 7.8431H9.83333V10.1764C9.83333 10.7306 10.2792 11.1764 10.8333 11.1764H12.8333C13.3875 11.1764 13.8333 10.7306 13.8333 10.1764V7.8431H16.1667C16.7208 7.8431 17.1667 7.39727 17.1667 6.8431V4.8431C17.1667 4.28893 16.7208 3.8431 16.1667 3.8431H13.8333V1.50977C13.8333 0.955599 13.3875 0.509766 12.8333 0.509766H10.8333C10.2792 0.509766 9.83333 0.955599 9.83333 1.50977ZM23.8208 16.8514C24.5625 16.3056 24.7208 15.2639 24.175 14.5223C23.6292 13.7806 22.5875 13.6223 21.8458 14.1681L16.8583 17.8431H11.8333C11.4667 17.8431 11.1667 17.5431 11.1667 17.1764C11.1667 16.8098 11.4667 16.5098 11.8333 16.5098H12.5H15.1667C15.9042 16.5098 16.5 15.9139 16.5 15.1764C16.5 14.4389 15.9042 13.8431 15.1667 13.8431H12.5H11.8333H8.57083C7.35833 13.8431 6.18333 14.2556 5.2375 15.0098L3.36667 16.5098H1.83333C1.09583 16.5098 0.5 17.1056 0.5 17.8431V20.5098C0.5 21.2473 1.09583 21.8431 1.83333 21.8431H8.5H15.1875C16.3958 21.8431 17.575 21.4556 18.55 20.7389L23.825 16.8514H23.8208ZM8.52917 16.5098H8.56667C8.55417 16.5098 8.54167 16.5098 8.52917 16.5098Z" fill="#1A3D7D" />
                        </g>
                        <defs>
                            <clipPath id="clip0_1121_2214">
                                <rect width="24" height="21.3333" fill="white" transform="translate(0.5 0.509766)" />
                            </clipPath>
                        </defs>
                    </svg>
                    <span className="text-blue_custom">Registrar Pedidos</span>
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