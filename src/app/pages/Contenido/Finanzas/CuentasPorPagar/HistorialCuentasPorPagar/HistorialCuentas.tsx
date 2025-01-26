import { FC, useContext } from "react";
import "./HistorialCuentas.css";
import { useNavigate } from "react-router-dom";
import { SmartwaterContext } from "../../../../../SmartwaterContext";
import { PageTitle } from "../../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../../components/FiltroPaginado/FiltroPaginado";
import { CuadroPagosProveedor } from "../CuadroPagosProveedor/CuadroPagosProveedor";
import { CuadroHistorialCredito } from "./CuadroHistorialCredito/CuadroHistorialCredito";
import { CuentasPorPagarContext } from "../CuentasPorPagarContext";
import { FiltroHistorialCuentasPorPagar } from "./FiltroHistorialCuentasPorPagar/FiltroHistorialCuentasPorPagar";

const HistorialCuentas: FC = () => {

    const {selectedOption} = useContext(SmartwaterContext);
    const {setShowMiniModal, showFiltro, setShowFiltro} = useContext(CuentasPorPagarContext);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/Finanzas/CuentasPorPagar');
        setShowMiniModal(false);
    };

    const Onfilter = () => {
        setShowFiltro(true)
    }

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
            <FiltroPaginado filtro swith infoPedidos opcionesSwitch1="Compras al crédito" opcionesSwitch2="Pagos a cuenta" onFilter={Onfilter}>
                {
                    selectedOption === false ?
                    <div style={{display:"flex", flexWrap: "wrap", gap: "24px"}}>
                        <CuadroHistorialCredito/>
                        <CuadroHistorialCredito/>
                    </div>
                    :
                    <div style={{display:"flex", flexWrap: "wrap", gap: "23px"}}>
                        {/* <CuadroPagosProveedor/> */}
                    </div>
                }
            </FiltroPaginado>
        </div>
        {showFiltro && <FiltroHistorialCuentasPorPagar/>}
        </>
    )
}

export{ HistorialCuentas }