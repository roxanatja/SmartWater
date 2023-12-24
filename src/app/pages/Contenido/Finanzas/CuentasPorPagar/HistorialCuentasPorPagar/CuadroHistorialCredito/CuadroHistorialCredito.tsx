import { FC } from "react";
import "./CuadroHistorialCredito.css";

const CuadroHistorialCredito: FC = () => {
    return(
        <>
        <div className="CuadroHistorialCredito-container">
            <div style={{display: "flex", flexDirection: "column", gap: "7px"}}>
                <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <div className="CuadroVentaCliente-header">
                        <img src="../../Cliente2.svg" alt="" />
                        <span>Rubén González</span>
                    </div>
                    <div className="infoClientes-ultimaventa">
                        <span>20/01/2023</span>
                    </div>
                </div>
                <div className="CuadroVentaCliente-text">
                    <span>Cod. Proveedor/Benef: <span style={{color: "#1A3D7D"}}>NREV5896</span></span>
                </div>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
                <div className="CuadroHistorialCredito-body-1">
                    <span>Sueldos</span>
                    <span style={{fontWeight: "600", fontSize: "14px", color: "#1A3D7D"}}>1000 <span style={{ color: "#000", fontWeight: "400"}}>Bs.</span></span>
                </div>
                <div className="CuadroHistorialCredito-body-1">
                    <span>Al Contado</span>
                    <span style={{fontWeight: "600", fontSize: "14px", color: "#1A3D7D"}}>Rec-100</span>
                </div>
            </div>
            <div className="CuadroHistorialCredito-body-1" 
                style={{flexDirection: "column", justifyContent: "left", alignItems: "flex-start"}}>
                <span style={{fontWeight: "500"}}>Comentario</span>
                <span>
                    Lorem ipsum dolor sit amet consectetur. Eu 
                    purus sed nibh laoreet neque mi risus massa volutpat.
                </span>
            </div>
        </div>
        </>
    )
}

export{CuadroHistorialCredito}