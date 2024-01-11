import { FC, useContext, useEffect } from "react";
import "./CuentasPorCobrar.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { SmartwaterContext } from "../../../../SmartwaterContext";
import { CuadroCuentasPorCobrar } from "./CuadroCuentasPorCobrar/CuadroCuentasPorCobrar";
import { CobrosClientes } from "./CuadroCuentasPorCobrar/CobrosClientes";
import { OpcionesCuentasCobrar } from "./OpcionesCuentasCobrar/OpcionesCuentasCobrar";
import { CuentasPorCobrarContext } from "./CuentasPorCobrarContext";
import { FiltroCuentasPorCobrar } from "./FiltroCuentasPorCobrar/FiltroCuentasPorCobrar";

const CuentasPorCobrar: FC = () => {

    const {selectedOption, setSelectedOption} = useContext(SmartwaterContext);
    const {showMiniModal, showFiltro, setShowFiltro} = useContext(CuentasPorCobrarContext);

    const Onfilter = () => {
        setShowFiltro(true)
    }

    useEffect(() => {
        setSelectedOption(false)
    }, [setSelectedOption])

    return(
        <>
        <div>
            <PageTitle titulo="Cuentas por cobrar / cobros" icon="../Finanzas-icon.svg"/>
            <FiltroPaginado filtro onFilter={Onfilter} swith opcionesSwitch1="Cuentas por cobrar" opcionesSwitch2="Cobros a clientes" finanzas>
                {
                    selectedOption === false ?
                    <div style={{display:"flex", flexWrap: "wrap", gap: "36px"}}>
                        <CuadroCuentasPorCobrar/>
                        <CuadroCuentasPorCobrar/>
                        <CuadroCuentasPorCobrar/>
                        <CuadroCuentasPorCobrar/>
                    </div>
                    :
                    <div style={{display:"flex", flexWrap: "wrap", gap: "23px"}}>
                        <CobrosClientes/>
                    </div>
                }
            </FiltroPaginado>
        </div>
        {showFiltro && <FiltroCuentasPorCobrar/>}
        {showMiniModal && <OpcionesCuentasCobrar/>}
        </>
    )
}

export{ CuentasPorCobrar }