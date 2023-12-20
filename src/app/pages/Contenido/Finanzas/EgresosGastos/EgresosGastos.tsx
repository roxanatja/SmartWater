import { FC, useContext } from "react";
import "./EgresosGastos.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { SmartwaterContext } from "../../../../SmartwaterContext";
import { CuentasContales } from "./CuentasContales/CuentasContales";

const EgresosGastos: FC = () => {

    const {selectedOption, showMiniModal} = useContext(SmartwaterContext);

    return(
        <>
        <div>
            <PageTitle titulo="Cuentas Egresos y gastos" icon="../../Finanzas-icon.svg"/>
            <FiltroPaginado swith finanzas opcionesSwitch1="Cuentas contables" opcionesSwitch2="Registros Egresos y Gastos">
                {
                    selectedOption === false ?
                    <div style={{display:"flex", flexWrap: "wrap", gap: "36px"}}>
                        <CuentasContales/>
                    </div>
                    :
                    <div style={{display:"flex", flexWrap: "wrap", gap: "23px"}}>
                        <EgresosGastos/>
                    </div>
                }
            </FiltroPaginado>
        </div>
        </>
    )
}

export{EgresosGastos}