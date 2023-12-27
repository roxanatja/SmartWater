import { FC } from "react"
import { MapaClientesProvider } from "./MapaClientesContext"
import { MapaClientes } from "./MapaClientes"


const MapaClientesWrapper: FC = () => {

    return (
        <>
            <MapaClientesProvider>
                <MapaClientes />
            </MapaClientesProvider>
        </>
    )

}

export { MapaClientesWrapper }