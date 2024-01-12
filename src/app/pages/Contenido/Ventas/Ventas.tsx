import { CuadroVentaCliente } from "./CuadroVentaCliente/CuadroVentaCliente";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { OpcionesVentas } from "./OpcionesVentas/OpcionesVentas";
import "./Ventas.css";
import { FC, useContext } from "react";
import { VentasContext } from "./VentasContext";
import { FiltroVenta } from "./FiltroVenta/FiltroVenta";

const Ventas: FC = () => {

    const { showModal, setShowFiltro, showFiltro } = useContext(VentasContext)

    const Onfilter = () => {
        setShowFiltro(true)
    }

    return (
        <>
            <div>
                <PageTitle titulo="Ventas" icon="./Ventas-icon.svg" />
                <FiltroPaginado filtro exportar={true} add={false} paginacion={false} infoPedidos={true} resultados={true} onFilter={Onfilter}>
                    <CuadroVentaCliente/>
                </FiltroPaginado>
            </div>
            {showModal && <OpcionesVentas/>}
            {showFiltro && <FiltroVenta/>}
        </>
    )
}

export { Ventas }