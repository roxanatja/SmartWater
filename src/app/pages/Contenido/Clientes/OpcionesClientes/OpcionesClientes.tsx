import { FC, useContext } from "react"
import "./OpcionesClientes.css"
import { Link } from "react-router-dom"
import { ClientesContext } from "../ClientesContext";

const OpcionesClientes: FC = () => {
    
    const { setShowMiniModal } = useContext(ClientesContext);
    
    return(
        <>
        <div className="modal-overlay-opcionesClientes">
            <div className="opcionesClientes-modalContent">
                <div className="opcionesClientes-Item">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <img src="./ventas-optionIcon.svg" alt="" style={{ marginRight: "15px"}}/>
                        <span>Registrar Ventas</span>
                    </div>
                    <Link to={"/Clientes/RegistrarVenta"}>
                        <button type="button" className="btn" style={{marginTop: "5px"}}>
                        <span className="material-symbols-outlined" style={{color: "#1A3D7D"}}>
                            chevron_right
                        </span>
                        </button>
                    </Link>
                </div>
                <div className="opcionesClientes-Item">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <img src="./Carrito-icon.svg" alt="" style={{ marginRight: "14px"}}/>
                        <span>Registrar pedido</span>
                    </div>
                    <Link to={"#"}>
                        <button type="button" className="btn" style={{marginTop: "5px"}}>
                        <span className="material-symbols-outlined" style={{color: "#1A3D7D"}}>
                            chevron_right
                        </span>
                        </button>
                    </Link>
                </div>
                <div className="opcionesClientes-Item">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <img src="./HojaMas-icon.svg" alt="" style={{ marginRight: "15px"}}/>
                        <span>Registrar préstamo</span>
                    </div>
                    <Link to={"#"}>
                        <button type="button" className="btn" style={{marginTop: "5px"}}>
                        <span className="material-symbols-outlined" style={{color: "#1A3D7D"}}>
                            chevron_right
                        </span>
                        </button>
                    </Link>
                </div>
                <div className="opcionesClientes-Item">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <img src="./Devolucion-icon.svg" alt="" style={{ marginRight: "11px"}}/>
                        <span>Registrar devolución paracial</span>
                    </div>
                    <Link to={"#"}>
                        <button type="button" className="btn" style={{marginTop: "5px"}}>
                        <span className="material-symbols-outlined" style={{color: "#1A3D7D"}}>
                            chevron_right
                        </span>
                        </button>
                    </Link>
                </div>
                <div className="opcionesClientes-Item">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <img src="./Retorno-icon.svg" alt="" style={{ marginRight: "16px"}}/>
                        <span>Registrar devolución total</span>
                    </div>
                    <Link to={"#"}>
                        <button type="button" className="btn" style={{marginTop: "5px"}}>
                        <span className="material-symbols-outlined" style={{color: "#1A3D7D"}}>
                            chevron_right
                        </span>
                        </button>
                    </Link>
                </div>
                <div style={{width: "100%", marginTop: "15px", display: "flex", justifyContent: "center"}}>
                    <button type="button" className="opcionesClientes-Btn" onClick={() => setShowMiniModal(false)}>
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
        </>
    )
}

export { OpcionesClientes }