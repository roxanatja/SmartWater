import { FC } from "react";
import { ProveedoresProvider } from "./ProveedoresContext";
import { Proveedores } from "./Proveedores";



const ProveedoresWrapper: FC = () => {

    return (
        <>
            <ProveedoresProvider>
                <Proveedores/>
            </ProveedoresProvider>
        </>
    )

}

export { ProveedoresWrapper }