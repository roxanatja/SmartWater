import { FC } from "react"
import { MapaClientesProvider } from "./MapaClientesContext"
import { MapaClientes } from "./MapaClientes"
import { Route, Routes } from "react-router-dom"
import { RegistrarPedido } from "./RegistrarPedido/RegistrarPedido"
import MapClientDetails from "./MapClientDetails"


const MapaClientesWrapper: FC = () => {

    return (
        <>
            <MapaClientesProvider>
                <Routes>
                    <Route path='/*' element={<MapaClientes />} />
                    <Route path='/DetallesCliente' element={<MapClientDetails />} />
                    <Route path='/RegistrarPedido' element={<RegistrarPedido />} />
                </Routes>
            </MapaClientesProvider>
        </>
    )

}

export { MapaClientesWrapper }