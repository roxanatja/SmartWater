import { FC } from "react";
import { ZonasProvider } from "./ZonasContext";
import { Zonas } from "./Zonas";



const ZonasWrapper: FC = () => {

    return (
        <>
            <ZonasProvider>
                <Zonas />
            </ZonasProvider>
        </>
    )

}

export { ZonasWrapper }