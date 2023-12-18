import { CuadroPrestamo } from "../../components/CuadroPrestamo/CuadroPrestamo";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./Prestamos.css";
import { FC } from "react";

const Prestamos: FC = () => {

    return (
        <>
            <div>
                <PageTitle titulo="Préstamos" icon="./Prestamos-icon.svg"/>
                <FiltroPaginado resultadosPrestamo>
                    <div style={{display: "flex", flexWrap: "wrap", gap: "30px"}}>
                        <CuadroPrestamo estadoContrato="Sin Contrato"/>
                        <CuadroPrestamo estadoContrato="Con Contrato"/>
                        <CuadroPrestamo estadoContrato="Contrato Vencido"/>
                    </div>
                </FiltroPaginado>
            </div>
        </>
    )
}

export { Prestamos }