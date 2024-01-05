import { FC } from "react"
import { PrestamosProvider } from "./PrestamosContext"
import { Prestamos } from "./Prestamos"
import { Route, Routes } from "react-router-dom"
import { RegistrarVenta } from "./RegistrarVenta/RegistrarVenta"
import { RegistrarDevolucion } from "./RegistrarDevolucion/RegistrarDevolucion"


const PrestamosWrapper: FC = () => {

    return (
        <>
            <PrestamosProvider>
                <Routes>
                    <Route path='/*' element={<Prestamos />} />
                    <Route path='/RegistrarVenta' element={<RegistrarVenta />}/>
                    <Route path='/RegistrarDevolucion' element={<RegistrarDevolucion />}/>
                </Routes>
            </PrestamosProvider>
        </>
    )

}

export { PrestamosWrapper }