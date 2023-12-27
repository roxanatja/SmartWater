import { FC, useContext } from "react";
import "./CuadroCuentasPorCobrar.css";
import { CuentasPorCobrarContext } from "../CuentasPorCobrarContext";

const CuadroCuentasPorCobrar: FC = () => {
    
    const { setShowMiniModal } = useContext(CuentasPorCobrarContext)

    return(
        <>
        <div className="CuadroCuentasPorCobrar-container">
            <div style={{display: "flex", flexDirection: "column", gap: "5px"}}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                    <div className="CuadroVentaCliente-header">
                        <img src="../Cliente2.svg" alt="" />
                        <span>Rubén González</span>
                    </div>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <button type="button" className="btn" onClick={() => setShowMiniModal(true)}>
                            <img src="../Opciones-icon.svg" alt=""/>
                        </button>
                    </div>
                    <div className="CuadroCuentasPorCobrar-header">
                        <span>Prestamos activos</span>
                    </div>
                </div>
                <div style={{display: "flex", alignItems: "flex-start", justifyContent: "space-between"}}>
                    <div className="CuadroVentaCliente-text">
                        <span>No. Cliente: <span style={{color: "#1A3D7D"}}>NREV5896</span></span>
                    </div>
                    <div className="moneda-cliente">
                        <img src="../Moneda-icon.svg" alt=""/>
                        <div>
                            <span>100 Bs.</span>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{display: "flex", gap: "15px", justifyContent: "space-between"}}>
                <div className="CuadroCuentasPorCobrar-text">
                    <span>Total a Cobrar</span>
                </div>
                <div className="CuadroCuentasPorCobrar-pago">
                    <span>100</span>
                    <span style={{color: "#000", borderLeft: "1px solid #000", paddingLeft: "12px", padding: "6px 0px 6px 12px"}}>Bs.</span>
                </div>
            </div>
            <div style={{width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <button className="btn CuadroCuentasPorCobrar-btn">
                    <span>Registrar Cobro</span>
                </button>
            </div>
        </div>    
        </>
    )
}

export{CuadroCuentasPorCobrar}