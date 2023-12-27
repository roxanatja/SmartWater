import { FC } from "react";
import { CuentasPorPagarProvider } from "./CuentasPorPagarContext";
import { CuentasPorPagar } from "./CuentasPorPagar";
import { Route, Routes } from "react-router-dom";
import { HistorialCuentas } from "./HistorialCuentasPorPagar/HistorialCuentas";



const CuentasPorPagarWrapper: FC = () => {

    return (
        <>
            <CuentasPorPagarProvider>
                <Routes>
                    <Route path='/*' element={<CuentasPorPagar/>} />
                    <Route path='/Historial' element={<HistorialCuentas/>} />
                </Routes>
            </CuentasPorPagarProvider>
        </>
    )

}

export { CuentasPorPagarWrapper }