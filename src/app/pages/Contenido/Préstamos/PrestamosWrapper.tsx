import { FC } from "react"
import { PrestamosProvider } from "./PrestamosContext"
import { Prestamos } from "./Prestamos"
import { Route, Routes } from "react-router-dom"
import { RegistrarDevolucion } from "./RegistrarDevolucion/RegistrarDevolucion"
import { RegistrarPrestamos } from "./RegistrarPrestamos/RegistrarPrestamos"


const PrestamosWrapper: FC = () => {

    return (
        <>
            <PrestamosProvider>
                <Routes>
                    <Route path='/*' element={<Prestamos />} />
                    <Route path='/RegistrarPrestamo' element={<RegistrarPrestamos />} />
                    <Route path='/RegistrarDevolucion/:parcial' element={<RegistrarDevolucion />} />
                </Routes>
            </PrestamosProvider>
        </>
    )

}

export { PrestamosWrapper }