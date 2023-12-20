import { FC } from "react";
import "./RegistrosEyG.css";
import { CuadroRegistrarEyG } from "./CuadroRegistrarEyG";

const RegistrosEyG: FC = () => {
    return(
        <>
        <div style={{width: "100%", display: "flex", flexDirection: "column", gap: "45px"}}>
            <div className="RegistrosEyG-Cuadro1">
                <div className="RegistrosEyG-Cuadro1-text">
                    <span>Sueldo</span>
                    <span>500Bs.</span>
                </div>
                <div className="RegistrosEyG-Cuadro1-text">
                    <span>Combustibles</span>
                    <span>500Bs.</span>
                </div>
                <div className="RegistrosEyG-Cuadro1-text">
                    <span>Otros gastos </span>
                    <span>500Bs.</span>
                </div>
            </div>
            <div style={{display: "flex", gap: "24px", flexWrap: "wrap"}}>
                <CuadroRegistrarEyG/>
                <CuadroRegistrarEyG/>
            </div>
        </div>
        </>
    )
}

export{RegistrosEyG}