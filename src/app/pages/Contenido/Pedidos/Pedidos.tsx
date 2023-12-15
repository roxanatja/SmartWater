import { SmartwaterContext } from "../../../SmartwaterContext";
import { PedidosCurso } from "../../components/CuadroPedidos/PedidosCurso";
import { FiltroPaginado } from "../../components/FiltroPaginado/FiltroPaginado";
import { PageTitle } from "../../components/PageTitle/PageTitle";
import { Switch } from "../../components/Switch/Switch";
import "./Pedidos.css";
import { FC, useContext, useEffect } from "react";

const Pedidos: FC = () => {

    const {selectedOption} = useContext(SmartwaterContext);


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

                        </div>
                    }
                </FiltroPaginado>
            </div>
        </>
    )
}

export { Pedidos }