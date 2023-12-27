import { FC } from "react";
import { EgresosGastosProvider } from "./EgresosGastosContext";
import { EgresosGastos } from "./EgresosGastos";



const EgresosGastosWrapper: FC = () => {

    return (
        <>
            <EgresosGastosProvider>
                <EgresosGastos/>
            </EgresosGastosProvider>
        </>
    )

}

export { EgresosGastosWrapper }