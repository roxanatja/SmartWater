import { FC } from "react";
import { ConfiguracionGeneralProvider } from "./ConfiguracionGeneralContext";
import { ConfiguracionGeneral } from "./ConfiguracionGeneral";



const ConfiguracionGeneralWrapper: FC = () => {

    return (
        <>
            <ConfiguracionGeneralProvider>
                <ConfiguracionGeneral />
            </ConfiguracionGeneralProvider>
        </>
    )

}

export { ConfiguracionGeneralWrapper }