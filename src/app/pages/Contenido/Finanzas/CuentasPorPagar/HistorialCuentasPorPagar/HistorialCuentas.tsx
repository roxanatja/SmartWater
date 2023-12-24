import { FC, useContext } from "react";
import "./HistorialCuentas.css";
import { useNavigate } from "react-router-dom";
import { SmartwaterContext } from "../../../../../SmartwaterContext";
import { PageTitle } from "../../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../../components/FiltroPaginado/FiltroPaginado";
import { CuadroPagosProveedor } from "../CuadroPagosProveedor/CuadroPagosProveedor";
import { CuadroHistorialCredito } from "./CuadroHistorialCredito/CuadroHistorialCredito";

const HistorialCuentas: FC = () => {

    const {selectedOption, setShowMiniModal} = useContext(SmartwaterContext);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/Finanzas/CuentasPorPagar');
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
            <FiltroPaginado swith infoPedidos opcionesSwitch1="Compras al crédito" opcionesSwitch2="Pagos a cuenta">
                {
                    selectedOption === false ?
                    <div style={{display:"flex", flexWrap: "wrap", gap: "24px"}}>
                        <CuadroHistorialCredito/>
                        <CuadroHistorialCredito/>
                    </div>
                    :
                    <div style={{display:"flex", flexWrap: "wrap", gap: "23px"}}>
                        <CuadroPagosProveedor/>
                    </div>
                }
            </FiltroPaginado>
        </div>
        </>
    )
}

export{ HistorialCuentas }