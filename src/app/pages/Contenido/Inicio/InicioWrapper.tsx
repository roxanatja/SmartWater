import { FC } from "react";
import { InicioProvider } from "./InicioContext";
import { Inicio } from "./Inicio";


const InicioWrapper: FC = () => {

    return (
        <>
            <InicioProvider>
                <Inicio/>
            </InicioProvider>
        </>
    )

}

export { InicioWrapper }