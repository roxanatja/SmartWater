import { FC } from "react";
import "./CuadroCuentasPorCobrar.css";

const CobrosClientes: FC = () => {
    return(
        <>
        <div className="CuadroCuentasPorCobrar-container">
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <div className="CuadroVentaCliente-header">
                    <img src="../../Cliente2.svg" alt="" />
                    <span>Rubén González</span>
                </div>
            </div>
            <div style={{display: "flex", gap: "120px"}}>
                <div className="CuadroVentaCliente-text">
                    <span>Fecha: <span style={{color: "#1A3D7D"}}>18/ 04/ 2023</span></span>
                </div>
                <div className="CobrosClientes-pago">
                    <span>150 <span style={{color: "#000", fontWeight: "400"}}>Bs.</span></span>
                </div>
            </div>
        </div>
        </>
    )
}

export{CobrosClientes}