import { SmartwaterContext } from "../../../SmartwaterContext";
import { CuadroPrestamo } from "../../components/CuadroPrestamo/CuadroPrestamo";
import { OpcionesPrestamo } from "../../components/CuadroPrestamo/OpcionesPrestamo";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./Prestamos.css";
import { FC, useContext } from "react";

const Prestamos: FC = () => {

    const { showMiniModal } = useContext(SmartwaterContext)

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
            {showMiniModal && <OpcionesPrestamo/>}
        </>
    )
}

export { Prestamos }