import { FC } from "react";
import { ArqueoDeCajaProvider } from "./ArqueoDeCajaContext";
import { ArqueoDeCaja } from "./ArqueoDeCaja";



const ArqueoDeCajaWrapper: FC = () => {

    return (
        <>
            <ArqueoDeCajaProvider>
                <ArqueoDeCaja />
            </ArqueoDeCajaProvider>
        </>
    )

}

export { ArqueoDeCajaWrapper }