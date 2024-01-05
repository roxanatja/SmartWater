import { FC } from "react";
import { UsuariosProvider } from "./UsuariosContext";
import { Usuarios } from "./Usuarios";



const UsuariosWrapper: FC = () => {

    return (
        <>
            <UsuariosProvider>
                <Usuarios />
            </UsuariosProvider>
        </>
    )

}

export { UsuariosWrapper }