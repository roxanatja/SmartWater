import { FC, useContext } from "react";
import "./HistorialCuentasPorCobrar.css";
import { PageTitle } from "../../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../../components/FiltroPaginado/FiltroPaginado";
import { SmartwaterContext } from "../../../../../SmartwaterContext";
import { CuadroHistorialCliente } from "./CuadroHistorialCliente/CuadroHistorialCliente";
import { CobrosClientes } from "../CuadroCuentasPorCobrar/CobrosClientes";
import { useNavigate } from "react-router-dom";
import { CuentasPorCobrarContext } from "../CuentasPorCobrarContext";

const HistorialCuentasPorCobrar: FC = () => {

    const {selectedOption} = useContext(SmartwaterContext);
    const {setShowMiniModal} = useContext(CuentasPorCobrarContext);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/Finanzas/CuentasPorCobrarCobros');
        setShowMiniModal(false);
    };

    return(
        <>
        <div>
            <div>
                <button className="btn" onClick={handleClick}>
                    <span className="material-symbols-outlined">
                        arrow_back
                    </span>
                </button>
            </div>
            <PageTitle titulo="Historial" icon="../../Finanzas-icon.svg"/>
            <FiltroPaginado swith infoPedidos opcionesSwitch1="Ventas al crédito" opcionesSwitch2="Cobros" finanzas>
                {
                    selectedOption === false ?
                    <div style={{display:"flex", flexWrap: "wrap", gap: "24px"}}>
                        <CuadroHistorialCliente/>
                        <CuadroHistorialCliente/>
                        <CuadroHistorialCliente/>
                    </div>
                    :
                    <div style={{display:"flex", flexWrap: "wrap", gap: "23px"}}>
                        <CobrosClientes/>
                    </div>
                }
            </FiltroPaginado>
        </div>
        </>
    )
}

export{ HistorialCuentasPorCobrar }