import { FC } from "react";
import "./ArqueoDeCaja.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";

const CuentasPorCobrar: FC = () => {
    return(
        <>
        <div>
            <PageTitle titulo="Cuentas por cobrar / cobros" icon="../Finanzas-icon.svg"/>
        </div>
        </>
    )
}

export{ CuentasPorCobrar }