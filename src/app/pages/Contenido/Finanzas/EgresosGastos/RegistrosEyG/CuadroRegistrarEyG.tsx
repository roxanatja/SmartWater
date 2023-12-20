import { FC } from "react";
import "./RegistrosEyG.css";

const CuadroRegistrarEyG: FC = () => {
    return(
        <>
        <div className="CuadroRegistrarEyG-container">
            <div className="CuadroVentaCliente-header">
                <img src="../../Cliente2.svg" alt="" />
                <span>Daniela Ayala</span>
            </div>
            <div className="CuadroRegistrarEyG-container2">
                <div className="RegistrosEyG-Cuadro1-text">
                    <span>Tipo de gasto</span>
                    <span>150 Bs.</span>
                </div>
                <div className="RegistrosEyG-Cuadro1-text">
                    <span>Formas de pago</span>
                    <span>Contado</span>
                </div>
                <div className="RegistrosEyG-Cuadro1-text">
                    <span>Documento</span>
                    <span>Rec.220</span>
                </div>
                <div className="RegistrosEyG-Cuadro1-text" style={{display: "flex", flexDirection: "column", gap: "24px"}}>
                    <span>Comenatrios</span>
                    <div className="CuadroRegistrarEyG-comentario">
                        <span></span>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export{CuadroRegistrarEyG}