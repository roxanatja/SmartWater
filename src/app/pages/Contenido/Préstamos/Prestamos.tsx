import { CuadroPrestamo } from "./CuadroPrestamo/CuadroPrestamo";
import { OpcionesPrestamo } from "./CuadroPrestamo/OpcionesPrestamo";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./Prestamos.css";
import { FC, useContext } from "react";
import { PrestamosContext } from "./PrestamosContext";

const Prestamos: FC = () => {

    const { showMiniModal } = useContext(PrestamosContext)

    return (
        <>
            <div>
                <PageTitle titulo="Préstamos" icon="./Prestamos-icon.svg"/>
                <FiltroPaginado filtro resultadosPrestamo>
                    <div style={{display: "flex", flexWrap: "wrap", gap: "30px"}}>
                        <CuadroPrestamo estadoContrato="Sin Contrato"/>
                        <CuadroPrestamo estadoContrato="Con Contrato"/>
                        <CuadroPrestamo estadoContrato="Contrato Vencido"/>
                    </div>
                </FiltroPaginado>
            </div>
            {showMiniModal && <OpcionesPrestamo/>}
        </>
    )
}

export { Prestamos }