import { FC } from "react";
import { ClientesProvider } from "./ClientesContext";
import { Clientes } from "./Clientes";
import { Route, Routes } from "react-router-dom";
import { RegistrarVenta } from "./RegistrarVenta/RegistrarVenta";


const ClientesWrapper: FC = () => {

    return (
        <>
            <ClientesProvider>
                <Routes>
                    <Route path='/*' element={<Clientes />} />
                    <Route path='/RegistrarVenta' element={<RegistrarVenta />}/>
                </Routes>
            </ClientesProvider>
        </>
    )

}

export { ClientesWrapper }