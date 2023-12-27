import { FC } from "react";
import { CuentasPorCobrarProvider } from "./CuentasPorCobrarContext";
import { CuentasPorCobrar } from "./CuentasPorCobrar";
import { Route, Routes } from "react-router-dom";
import { HistorialCuentasPorCobrar } from "./HistorialCuentasPorCobrar/HistorialCuentasPorCobrar";



const CuentasPorCobrarWrapper: FC = () => {

    return (
        <>
            <CuentasPorCobrarProvider>
                <Routes>
                    <Route path='/*' element={<CuentasPorCobrar/>} />
                    <Route path='/Historial' element={<HistorialCuentasPorCobrar/>} />
                </Routes>
            </CuentasPorCobrarProvider>
        </>
    )

}

export { CuentasPorCobrarWrapper }