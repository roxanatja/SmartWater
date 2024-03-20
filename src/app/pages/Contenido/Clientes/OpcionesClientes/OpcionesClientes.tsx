import { FC, useContext } from "react"
import "./OpcionesClientes.css"
import { Link } from "react-router-dom"
import { ClientesContext } from "../ClientesContext";

const OpcionesClientes: FC = () => {
    
    const { setShowMiniModal, setSelectedOption } = useContext(ClientesContext);
    
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
                    <Link to={"/Clientes/RegistrarPedido"}>
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
                    <Link to={"/Clientes/RegistrarPrestamo"}>
                        <button type="button" className="btn" style={{marginTop: "5px"}}>
                        <span className="material-symbols-outlined" style={{color: "#1A3D7D"}}>
                            chevron_right
                        </span>
                        </button>
                    </Link>
                </div>
                <div className="opcionesClientes-Item">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <svg style={{ marginRight: "11px"}} xmlns="http://www.w3.org/2000/svg" width="24" height="19" viewBox="0 0 24 19" fill="none">
                            <path d="M2 2.22021H14.7746C18.5985 2.22021 21.8457 5.3905 21.9946 9.27156C22.1524 13.3726 18.8152 16.887 14.7746 16.887H5.33225" stroke="#1A3D7D" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Registrar devolución parcial</span>
                    </div>
                    <Link to={"/Clientes/RegistrarDevolucion"}>
                        <button type="button" className="btn" style={{marginTop: "5px"}} onClick={() => setSelectedOption(false)}>
                        <span className="material-symbols-outlined" style={{color: "#1A3D7D"}}>
                            chevron_right
                        </span>
                        </button>
                    </Link>
                </div>
                <div className="opcionesClientes-Item">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <svg style={{ marginRight: "16px"}} xmlns="http://www.w3.org/2000/svg" width="18" height="20" viewBox="0 0 18 20" fill="none">
                            <path d="M16.9321 10.9825C16.7433 12.4447 16.166 13.827 15.2622 14.9813C14.3585 16.1356 13.1623 17.0184 11.802 17.5348C10.4418 18.0513 8.96866 18.1821 7.54074 17.9131C6.11282 17.6441 4.78395 16.9856 3.69664 16.008C2.60933 15.0304 1.8046 13.7708 1.36876 12.3641C0.932916 10.9575 0.882404 9.45688 1.22264 8.02329C1.56287 6.58971 2.28102 5.2772 3.30006 4.22654C4.3191 3.17588 5.60059 2.4267 7.00709 2.05935C10.9061 1.04396 14.9421 3.08184 16.4321 6.87938" stroke="#1A3D7D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M17 1.80225V6.87917H12" stroke="#1A3D7D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span>Registrar devolución total</span>
                    </div>
                    <Link to={"/Clientes/RegistrarDevolucion"}>
                        <button type="button" className="btn" style={{marginTop: "5px"}} onClick={() => setSelectedOption(true)}>
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