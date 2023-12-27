import { FC } from "react"
import { PrestamosProvider } from "./PrestamosContext"
import { Prestamos } from "./Prestamos"


const PrestamosWrapper: FC = () => {

    return (
        <>
            <PrestamosProvider>
                <Prestamos />
            </PrestamosProvider>
        </>
    )

}

export { PrestamosWrapper }