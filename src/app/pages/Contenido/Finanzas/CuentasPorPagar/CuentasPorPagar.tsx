import { FC } from "react";
import "./CuentasPorPagar.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { FiltroPaginado } from "../../../components/FiltroPaginado/FiltroPaginado";

const CuentasPorPagar: FC = () => {
    return(
        <>
        <div>
            <PageTitle titulo="Cuentas por pagar / pagos" icon="../../Finanzas-icon.svg"/>
            <FiltroPaginado swith opcionesSwitch1="Cuentas por pagar" opcionesSwitch2="Pagos a proveedores" finanzas>

            </FiltroPaginado>
        </div>
        </>
    )
}

export{CuentasPorPagar}