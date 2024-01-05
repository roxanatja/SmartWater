import { FC } from "react";
import { BarriosProvider } from "./BarriosContext";
import { Barrios } from "./Barrios";



const BarriosWrapper: FC = () => {

    return (
        <>
            <BarriosProvider>
                <Barrios />
            </BarriosProvider>
        </>
    )

}

export { BarriosWrapper }