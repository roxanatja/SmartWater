import { SmartwaterContext } from "../../../SmartwaterContext";
import { CuadroVentaCliente } from "../../components/CuadroVentaCliente/CuadroVentaCliente";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { OpcionesClientes } from "../Clientes/OpcionesClientes/OpcionesClientes";
import "./Ventas.css";
import { FC, useContext } from "react";

const Ventas: FC = () => {

    const { showMiniModal } = useContext(SmartwaterContext)

    return (
        <>
            <div>
                <PageTitle titulo="Ventas" icon="./Ventas-icon.svg" />
                <FiltroPaginado exportar={true} add={false} paginacion={false} infoPedidos={true} resultados={true}>
                    <CuadroVentaCliente/>
                </FiltroPaginado>
            </div>
            {showMiniModal && <OpcionesClientes/>}
        </>
    )
}

export { Ventas }