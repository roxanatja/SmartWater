import { CuadroPrestamo } from "./CuadroPrestamo/CuadroPrestamo";
import { OpcionesPrestamo } from "./CuadroPrestamo/OpcionesPrestamo";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./Prestamos.css";
import { FC, useContext } from "react";
import { PrestamosContext } from "./PrestamosContext";
import { FiltroPrestamos } from "./FiltroPrestamos/FiltroPrestamos";

const Prestamos: FC = () => {

    const { showMiniModal, showFiltro, setShowFiltro } = useContext(PrestamosContext)

    const Onfilter = () => {
        setShowFiltro(true)
    }

    return (
        <>
            <div>
                <PageTitle titulo="Préstamos" icon="./Prestamos-icon.svg"/>
                <FiltroPaginado filtro resultadosPrestamo onFilter={Onfilter}>
                    <div style={{display: "flex", flexWrap: "wrap", gap: "30px"}}>
                        <CuadroPrestamo estadoContrato="Sin Contrato"/>
                        <CuadroPrestamo estadoContrato="Con Contrato"/>
                        <CuadroPrestamo estadoContrato="Contrato Vencido"/>
                    </div>
                </FiltroPaginado>
            </div>
            {showFiltro && <FiltroPrestamos/>}
            {showMiniModal && <OpcionesPrestamo/>}
        </>
    )
}

export { Prestamos }