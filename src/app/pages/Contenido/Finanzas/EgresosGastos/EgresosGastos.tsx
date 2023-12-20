import { FC, useContext } from "react";
import "./EgresosGastos.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { SmartwaterContext } from "../../../../SmartwaterContext";
import { CuentasContales } from "./CuentasContales/CuentasContales";
import { RegistrosEyG } from "./RegistrosEyG/RegistrosEyG";
import { CrearCuenta } from "./CrearCuenta/CrearCuenta";

const EgresosGastos: FC = () => {

    const {selectedOption, showModal} = useContext(SmartwaterContext);

    return(
        <>
        <div>
            <PageTitle titulo="Cuentas Egresos y gastos" icon="../../Finanzas-icon.svg"/>
            <FiltroPaginado swith finanzas opcionesSwitch1="Cuentas contables" opcionesSwitch2="Registros Egresos y Gastos">
                {
                    selectedOption === false ?
                    <div style={{display:"flex", flexWrap: "wrap", gap: "36px", paddingLeft: "5px"}}>
                        <CuentasContales/>
                    </div>
                    :
                    <div style={{display:"flex", flexWrap: "wrap", gap: "23px", paddingLeft: "5px"}}>
                        <RegistrosEyG/>
                    </div>
                }
            </FiltroPaginado>
        </div>
        {showModal && <CrearCuenta/>}
        </>
    )
}

export{EgresosGastos}