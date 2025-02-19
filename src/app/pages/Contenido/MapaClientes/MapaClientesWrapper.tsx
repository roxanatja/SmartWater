import { FC } from "react"
import { MapaClientesProvider } from "./MapaClientesContext"
import { MapaClientes } from "./MapaClientes"
import { Navigate, Route, Routes } from "react-router-dom"
import { RegistrarPedido } from "./RegistrarPedido/RegistrarPedido"
import MapClientDetails from "./MapClientDetails"
import { RegistrarVenta } from "./RegistrarVenta/RegistrarVenta"
import { RegistrarPedidoCliente } from "./RegistrarPedidoCliente/RegistrarPedidoCliente"
import { RegistrarPrestamo } from "./RegistrarPrestamo/RegistrarPrestamo"
import { RegistrarDevolucion } from "./RegistrarDevolucion/RegistrarDevolucion"


const MapaClientesWrapper: FC = () => {

    return (
        <>
            <MapaClientesProvider>
                <Routes>
                    <Route path='/*' element={<MapaClientes />} />
                    <Route path='/DetallesCliente' element={<MapClientDetails />} />
                    <Route path='/RegistrarPedido' element={<RegistrarPedido />} />
                    <Route path='/RegistrarPedidoCliente' element={<RegistrarPedidoCliente />} />
                    <Route path='/RegistrarVenta' element={<RegistrarVenta />} />
                    <Route path='/RegistrarPrestamo' element={<RegistrarPrestamo />} />
                    <Route path='/RegistrarDevolucion' element={<Navigate to={"/MapaClientes/RegistrarDevolucion/parcial"} replace />} />
                    <Route
                        path="/RegistrarDevolucion/:parcial"
                        element={<RegistrarDevolucion />}
                    />
                </Routes>
            </MapaClientesProvider>
        </>
    )

}

export { MapaClientesWrapper }