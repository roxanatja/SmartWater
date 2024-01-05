import { FC } from "react"
import { VentasProvider } from "./VentasContext"
import { Ventas } from "./Ventas"
import { Route, Routes } from "react-router-dom"
import { RegistrarVenta } from "./RegistrarVenta/RegistrarVenta"
import { RegistrarPedido } from "./RegistrarPedido/RegistrarPedido"
import { RegistrarPrestamo } from "./RegistrarPrestamo/RegistrarPrestamo"
import { RegistrarDevolucion } from "./RegistrarDevolucion/RegistrarDevolucion"


const VentasWrapper: FC = () => {

    return (
        <>
            <VentasProvider>
                <Routes>
                    <Route path='/*' element={<Ventas />} />
                    <Route path='/RegistrarVenta' element={<RegistrarVenta />}/>
                    <Route path='/RegistrarPedido' element={<RegistrarPedido />}/>
                    <Route path='/RegistrarPrestamo' element={<RegistrarPrestamo />}/>
                    <Route path='/RegistrarDevolucion' element={<RegistrarDevolucion />}/>
                </Routes>
            </VentasProvider>
        </>
    )

}

export { VentasWrapper }