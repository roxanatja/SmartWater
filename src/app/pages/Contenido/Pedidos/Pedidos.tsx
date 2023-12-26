import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import "./Pedidos.css";
import { FC, useContext, useEffect } from "react";
import { PedidosContext } from "./PedidosContext";
import { PedidosCurso } from "./CuadroPedidos/PedidosCurso";
import { PedidosAtendidos } from "./CuadroPedidos/PedidosAtendidos";
import { OpcionesPedidos } from "./CuadroPedidos/OpcionesPedidos/OpcionesPedidos";
import { SmartwaterContext } from "../../../SmartwaterContext";

const Pedidos: FC = () => {

    const { showMiniModal} = useContext(PedidosContext);
    const { selectedOption, setSelectedOption } = useContext(SmartwaterContext);

    useEffect(() => {
        setSelectedOption(false);
    }, [setSelectedOption])

    return (
        <>
            <div>
                <PageTitle titulo="Pedidos" icon="./Pedidos-icon.svg"/>
                <FiltroPaginado swith={true} opcionesSwitch1="En curso" opcionesSwitch2="Atendidos">
                    {
                        selectedOption === false ?
                        <div style={{display:"flex", flexWrap: "wrap"}}>
                            <PedidosCurso/>
                        </div>
                        :
                        <div style={{display:"flex", flexWrap: "wrap"}}>
                            <PedidosAtendidos/>
                        </div>
                    }
                </FiltroPaginado>
            </div>
            {showMiniModal && <OpcionesPedidos/>}
        </>
    )
}

export { Pedidos }