import { FC } from "react";
import { ClientesProvider } from "./ClientesContext";
import { Clientes } from "./Clientes";
import { Route, Routes } from "react-router-dom";
import { RegistrarVenta } from "./RegistrarVenta/RegistrarVenta";
import { RegistrarPedido } from "./RegistrarPedido/RegistrarPedido";
import { RegistrarPrestamo } from "./RegistrarPrestamo/RegistrarPrestamo";
import { RegistrarDevolucion } from "./RegistrarDevolucion/RegistrarDevolucion";


const ClientesWrapper: FC = () => {

    return (
        <>
            <ClientesProvider>
                <Routes>
                    <Route path='/*' element={<Clientes />} />
                    <Route path='/RegistrarVenta' element={<RegistrarVenta />}/>
                    <Route path='/RegistrarPedido' element={<RegistrarPedido />}/>
                    <Route path='/RegistrarPrestamo' element={<RegistrarPrestamo />}/>
                    <Route path='/RegistrarDevolucion' element={<RegistrarDevolucion />}/>
                </Routes>
            </ClientesProvider>
        </>
    )

}

export { ClientesWrapper }