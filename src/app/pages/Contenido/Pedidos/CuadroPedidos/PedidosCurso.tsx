import { FC, useContext, useState } from "react";
import "./PedidosCurso.css";
import { PedidosContext } from "../PedidosContext";
import { Option } from "../../../components/Option/Option";

const PedidosCurso: FC = () => {

    const { setShowMiniModal } = useContext(PedidosContext);
    const [showOptions, setShowOptions] = useState<boolean>(false);

    const Opciones = () => {
        setShowOptions(!showOptions);
    }
    
    const Edit = () => {
        setShowOptions(false);
    }

    const Delete = () => {
        setShowOptions(false);
    }

    return(
        <>
        <div className="PedidosCurso-container" style={{gap: "14px"}}>
            <div className="PedidosCurso-datoscontainer">
                <div className="PedidosCurso-datos" style={{fontWeight: "500"}}>
                    <img src="./Cliente2.svg" alt="" />
                    <span>Rubén González</span>
                </div>
                <div className="PedidosCurso-datos">
                    <img src="./whap-icon.svg" alt="" />
                    <span>78 25 48 96 87</span>
                </div>
                <div className="PedidosCurso-datos">
                    <img src="./Location-icon.svg" alt="" />
                    <span>zona norte</span>
                </div>
                <div className="PedidosCurso-datos">
                    <img src="./CasaUbi-icon.svg" alt="" />
                    <span>N° 125451215</span>
                </div>
                <div className="PedidosCurso-datos">
                    <button type="button" className="btn" onClick={()=> setShowMiniModal(true)}>
                        <img src="./Opciones-icon.svg" alt=""/>
                    </button>
                </div>
            </div>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <div>
                    <div style={{display: "flex", alignItems: "center", gap: "16px"}}>
                        <img src="./BotellaGrande.svg" alt="" className="Pedidos-img"/>
                        <div className="CuadroVentaCliente-TextContainer" style={{ display: "flex", justifyContent: "center"}}>
                            <span className="CuadroVentaCliente-text" style={{fontWeight: "600"}}>1</span>
                        </div>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "16px"}}>
                        <img src="./BotellaPequeña.svg" alt="" className="Pedidos-img"/>
                        <div className="CuadroVentaCliente-TextContainer" style={{ display: "flex", justifyContent: "center"}}>
                            <span className="CuadroVentaCliente-text" style={{fontWeight: "600"}}>1</span>
                        </div>
                    </div>
                </div>
                <div className="PedidosCurso-infoEntregaContainer">
                    <div className="PedidosCurso-infoEntrega">
                        <span>Entrega programada</span>
                        <span style={{color: "#1A3D7D"}}>20/01/2023</span>
                    </div>
                    <div className="PedidosCurso-infoUbi">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M9.99935 9.58366C9.44682 9.58366 8.91691 9.36417 8.52621 8.97346C8.13551 8.58276 7.91602 8.05286 7.91602 7.50033C7.91602 6.94779 8.13551 6.41789 8.52621 6.02719C8.91691 5.63649 9.44682 5.41699 9.99935 5.41699C10.5519 5.41699 11.0818 5.63649 11.4725 6.02719C11.8632 6.41789 12.0827 6.94779 12.0827 7.50033C12.0827 7.77391 12.0288 8.04482 11.9241 8.29758C11.8194 8.55034 11.6659 8.78001 11.4725 8.97346C11.279 9.16692 11.0494 9.32038 10.7966 9.42507C10.5438 9.52977 10.2729 9.58366 9.99935 9.58366ZM9.99935 1.66699C8.45225 1.66699 6.96852 2.28157 5.87456 3.37554C4.7806 4.4695 4.16602 5.95323 4.16602 7.50033C4.16602 11.8753 9.99935 18.3337 9.99935 18.3337C9.99935 18.3337 15.8327 11.8753 15.8327 7.50033C15.8327 5.95323 15.2181 4.4695 14.1241 3.37554C13.0302 2.28157 11.5464 1.66699 9.99935 1.66699Z" fill="#367DFD"/>
                        </svg>
                        <a href="https://www.google.com/maps" target="_blank" rel="noreferrer" className="PedidosCurso-infoUbicacion">Ver ubicación en el mapa</a>
                    </div>
                </div>
                <div className="PedidosCurso-datos">
                    <img src="./whap-icon.svg" alt="" />
                    <span>78 25 48 96 87</span>
                </div>
                <div>
                    <button type="button" className="btn" onClick={() => Opciones()}>
                        <img src="./opcion-icon.svg" alt="" />
                    </button>
                    <Option editAction={Edit} visible={showOptions} editar={true} eliminar={true} deleteAction={Delete}/>
                </div>
            </div>
            <div className="PedidosCurso-Nota">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <g clipPath="url(#clip0_14_2925)">
                        <path d="M2.5 0C1.12109 0 0 1.12109 0 2.5V13.75C0 15.1289 1.12109 16.25 2.5 16.25H6.25V19.375C6.25 19.6133 6.38281 19.8281 6.59375 19.9336C6.80469 20.0391 7.05859 20.0156 7.25 19.875L12.082 16.25H17.5C18.8789 16.25 20 15.1289 20 13.75V2.5C20 1.12109 18.8789 0 17.5 0H2.5Z" fill="#1A3D7D"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_14_2925">
                        <rect width="20" height="20" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
                <span>Entrega hoy entre las 12: 00 a 13:00</span>
            </div>
        </div>
        </>
    )
}
export {PedidosCurso}