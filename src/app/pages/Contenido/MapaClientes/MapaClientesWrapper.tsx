import { FC } from "react"
import { MapaClientesProvider } from "./MapaClientesContext"
import { MapaClientes } from "./MapaClientes"
import { Route, Routes } from "react-router-dom"
import { RegistrarPedido } from "./RegistrarPedido/RegistrarPedido"


const MapaClientesWrapper: FC = () => {

    return (
        <>
            <MapaClientesProvider>
                <Routes>
                    <Route path='/*' element={<MapaClientes />}/>
                    <Route path='/RegistrarPedido' element={<RegistrarPedido />}/>
                </Routes>
            </MapaClientesProvider>
        </>
    )

}

export { MapaClientesWrapper }