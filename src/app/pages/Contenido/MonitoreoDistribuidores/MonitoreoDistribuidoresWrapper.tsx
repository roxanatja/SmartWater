import { FC } from "react"
import { MonitoreoDistribuidoresProvider } from "./MonitoreoDistribuidoresContext"
import { MonitoreoDistribuidores } from "./MonitoreoDistribuidores"
import { Navigate, Route, Routes } from "react-router-dom"
import MapClientDetails from "./MapClientDetails"
import ClientInfo from "./ClientInfo/ClientInfo"
import { RegistrarPedido } from "./RegistrarPedido/RegistrarPedido"
import { RegistrarPedidoCliente } from "./RegistrarPedidoCliente/RegistrarPedidoCliente"
import { RegistrarVenta } from "./RegistrarVenta/RegistrarVenta"
import { RegistrarPrestamo } from "./RegistrarPrestamo/RegistrarPrestamo"
import { RegistrarDevolucion } from "./RegistrarDevolucion/RegistrarDevolucion"


const MonitoreoDistribuidoresWrapper: FC = () => {

    return (
        <>
            <MonitoreoDistribuidoresProvider>
                <Routes>
                    <Route path='/*' element={<MonitoreoDistribuidores />} />
                    <Route path='/DetallesCliente' element={<MapClientDetails />} />
                    <Route path='/Informacion' element={<ClientInfo />} />
                    <Route path='/RegistrarPedido' element={<RegistrarPedido />} />
                    <Route path='/RegistrarPedidoCliente' element={<RegistrarPedidoCliente />} />
                    <Route path='/RegistrarVenta' element={<RegistrarVenta />} />
                    <Route path='/RegistrarPrestamo' element={<RegistrarPrestamo />} />
                    <Route path='/RegistrarDevolucion' element={<Navigate to={"/MonitoreoDistribuidores/RegistrarDevolucion/parcial"} replace />} />
                    <Route
                        path="/RegistrarDevolucion/:parcial"
                        element={<RegistrarDevolucion />}
                    />
                </Routes>
            </MonitoreoDistribuidoresProvider>
        </>
    )

}

export { MonitoreoDistribuidoresWrapper }