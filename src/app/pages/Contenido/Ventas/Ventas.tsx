import { CuadroVentaCliente } from "../../components/CuadroVentaCliente/CuadroVentaCliente";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./Ventas.css";
import { FC } from "react";

const Ventas: FC = () => {

    return (
        <>
            <div>
                <PageTitle titulo="Ventas" icon="./Ventas-icon.svg" />
                <FiltroPaginado exportar={true} add={false} paginacion={false} infoPedidos={true} resultados={true}>
                    <CuadroVentaCliente/>
                </FiltroPaginado>
            </div>
        </>
    )
}

export { Ventas }