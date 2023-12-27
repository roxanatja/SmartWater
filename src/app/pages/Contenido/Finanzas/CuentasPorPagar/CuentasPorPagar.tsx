import { FC, useContext } from "react";
import "./CuentasPorPagar.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";
import { CuadroCuentasPorPagar } from "./CuadroCuentasPorPagar/CuadroCuentasPorPagar";
import { SmartwaterContext } from "../../../../SmartwaterContext";
import { CuadroPagosProveedor } from "./CuadroPagosProveedor/CuadroPagosProveedor";
import { ModalCuentasPorPagar } from "./ModalCuentasPorPagar";
import { CuentasPorPagarContext } from "./CuentasPorPagarContext";

const CuentasPorPagar: FC = () => {

    const { selectedOption } = useContext(SmartwaterContext);
    const { showMiniModal } = useContext(CuentasPorPagarContext);

    // useEffect(() => {
    //     setSelectedOption(false)
    // }, [setSelectedOption])

    return(
        <>
        <div>
            <PageTitle titulo="Cuentas por pagar / pagos" icon="../../Finanzas-icon.svg"/>
            <FiltroPaginado swith opcionesSwitch1="Cuentas por pagar" opcionesSwitch2="Pagos a proveedores" finanzas>
            {
                selectedOption === false ? 
                <div style={{display: "flex", flexWrap: "wrap", gap: "20px"}}>
                    <CuadroCuentasPorPagar/>
                    <CuadroCuentasPorPagar/>
                </div>
                : 
                <div style={{display: "flex", flexWrap: "wrap", gap: "20px"}}>
                    <CuadroPagosProveedor/>
                    <CuadroPagosProveedor/>
                </div>
            }
            </FiltroPaginado>
        </div>
        {showMiniModal && <ModalCuentasPorPagar/>}
        </>
    )
}

export{CuentasPorPagar}