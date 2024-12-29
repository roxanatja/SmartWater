import { FC } from "react";
import { Horarioprovider } from "./HorarioContext";
import { Horarios } from "./Horarios";



const HorariosWrapper: FC = () => {

    return (
        <>
            <Horarioprovider>
                <Horarios />
            </Horarioprovider>
        </>
    )

}

export { HorariosWrapper }