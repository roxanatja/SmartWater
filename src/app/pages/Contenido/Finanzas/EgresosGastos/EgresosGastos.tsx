import { FC, useContext, useEffect } from "react";
import "./EgresosGastos.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { SmartwaterContext } from "../../../../SmartwaterContext";
import { CuentasContales } from "./CuentasContales/CuentasContales";
import { RegistrosEyG } from "./RegistrosEyG/RegistrosEyG";
import { AddEgresosGastos } from "./AddEgresosGastos/AddEgresosGastos";
import { EgresosGastosContext } from "./EgresosGastosContext";
import { FiltroEgresosGastos } from "./FiltroEgresosGastos/FiltroEgresosGastos";

const EgresosGastos: FC = () => {

    const {selectedOption, setSelectedOption } = useContext(SmartwaterContext);

    const {showModal, setShowModal, showFiltro, setShowFiltro} = useContext(EgresosGastosContext);

    const handleModal = () => {
        setShowModal(true)
    }

    const Onfilter = () => {
        setShowFiltro(true)
    }

    useEffect(() => {
        setSelectedOption(false)
    }, [setSelectedOption])

    return(
        <>
        <div>
            <PageTitle titulo="Cuentas Egresos y gastos" icon="../../Finanzas-icon.svg"/>
                {
                    selectedOption === false ?
                    <FiltroPaginado filtro swith finanzas 
                            opcionesSwitch1="Cuentas contables" 
                            opcionesSwitch2="Registros Egresos y Gastos">
                    <div style={{display:"flex", flexWrap: "wrap", gap: "36px", paddingLeft: "5px"}}>
                        <CuentasContales/>
                    </div>
                    </FiltroPaginado>
                    :
                    <FiltroPaginado filtro swith finanzas add onAdd={handleModal}
                            opcionesSwitch1="Cuentas contables" 
                            opcionesSwitch2="Registros Egresos y Gastos"
                            onFilter={Onfilter}>
                        <div style={{display:"flex", flexWrap: "wrap", gap: "23px", paddingLeft: "5px"}}>
                            <RegistrosEyG/>
                        </div>
                    </FiltroPaginado>
                }
            
        </div>
        {showFiltro && <FiltroEgresosGastos/>}
        {showModal && <AddEgresosGastos/>}
        </>
    )
}

export{EgresosGastos}