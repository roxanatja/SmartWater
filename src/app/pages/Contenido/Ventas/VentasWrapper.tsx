import { FC } from "react"
import { VentasProvider } from "./VentasContext"
import { Ventas } from "./Ventas"


const VentasWrapper: FC = () => {

    return (
        <>
            <VentasProvider>
                <Ventas />
            </VentasProvider>
        </>
    )

}

export { VentasWrapper }