import { FC } from "react"
import { PedidosProvider } from "./PedidosContext"
import { Pedidos } from "./Pedidos"


const PedidosWrapper: FC = () => {

    return (
        <>
            <PedidosProvider>
                <Pedidos />
            </PedidosProvider>
        </>
    )

}

export { PedidosWrapper }