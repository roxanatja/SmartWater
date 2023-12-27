import { FC } from "react";
import { ClientesProvider } from "./ClientesContext";
import { Clientes } from "./Clientes";


const ClientesWrapper: FC = () => {

    return (
        <>
            <ClientesProvider>
                <Clientes />
            </ClientesProvider>
        </>
    )

}

export { ClientesWrapper }