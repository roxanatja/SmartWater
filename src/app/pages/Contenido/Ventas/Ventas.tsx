import { CuadroVentaCliente } from "./CuadroVentaCliente/CuadroVentaCliente";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { OpcionesVentas } from "./OpcionesVentas/OpcionesVentas";
import "./Ventas.css";
import { FC, useContext } from "react";
import { VentasContext } from "./VentasContext";

const Ventas: FC = () => {

    const { showModal } = useContext(VentasContext)

    return (
        <>
            <div>
                <PageTitle titulo="Ventas" icon="./Ventas-icon.svg" />
                <FiltroPaginado exportar={true} add={false} paginacion={false} infoPedidos={true} resultados={true}>
                    <CuadroVentaCliente/>
                </FiltroPaginado>
            </div>
            {showModal && <OpcionesVentas/>}
        </>
    )
}

export { Ventas }