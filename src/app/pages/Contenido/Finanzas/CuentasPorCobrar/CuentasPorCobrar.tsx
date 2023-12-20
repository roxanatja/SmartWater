import { FC, useContext } from "react";
import "./CuentasPorCobrar.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { SmartwaterContext } from "../../../../SmartwaterContext";
import { CuadroCuentasPorCobrar } from "../../../components/CuadroCuentasPorCobrar/CuadroCuentasPorCobrar";
import { CobrosClientes } from "../../../components/CuadroCuentasPorCobrar/CobrosClientes";
import { OpcionesCuentasCobrar } from "./OpcionesCuentasCobrar";

const CuentasPorCobrar: FC = () => {

    const {selectedOption, showMiniModal} = useContext(SmartwaterContext);

    return(
        <>
        <div>
            <PageTitle titulo="Cuentas por cobrar / cobros" icon="../Finanzas-icon.svg"/>
            <FiltroPaginado swith opcionesSwitch1="Cuentas por cobrar" opcionesSwitch2="Cobros a clientes" finanzas>
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
        {showMiniModal && <OpcionesCuentasCobrar/>}
        </>
    )
}

export{ CuentasPorCobrar }