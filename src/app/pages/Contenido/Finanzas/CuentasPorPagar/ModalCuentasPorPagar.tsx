import { FC, useContext } from "react"
import { Link } from "react-router-dom"
import { CuentasPorPagarContext } from "./CuentasPorPagarContext"

const ModalCuentasPorPagar: FC = () =>{

    const { setShowMiniModal } = useContext(CuentasPorPagarContext)

    return(
        <>
        <div className="modal-overlay-opcionesClientes">
            <div className="opcionesClientes-modalContent" style={{padding: "14px 29px"}}>
                <div className="opcionesClientes-Item">
                    <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="#1A3D7D"/>
                            <path d="M12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#1A3D7D"/>
                        </svg>
                        <span>Historial</span>
                    </div>
                    <Link to={"/Finanzas/CuentasPorPagar/Historial"}>
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

export{ModalCuentasPorPagar}