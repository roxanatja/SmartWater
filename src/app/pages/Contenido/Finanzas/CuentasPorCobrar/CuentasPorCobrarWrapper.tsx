import { FC } from "react";
import { CuentasPorCobrarProvider } from "./CuentasPorCobrarContext";
import { Navigate, Route, Routes } from "react-router-dom";
import { HistorialCuentasPorCobrar } from "./HistorialCuentasPorCobrar/HistorialCuentasPorCobrar";
import CobrarRoot from "./CobrarRoot";



const CuentasPorCobrarWrapper: FC = () => {
    return (
        <>
            <CuentasPorCobrarProvider>
                <Routes>
                    <Route path="/" element={<Navigate to={"/Finanzas/CuentasPorCobrarCobros/Cuentas"} replace />} />
                    <Route path='/:section' element={<CobrarRoot />} />
                    <Route path='/Historial' element={<HistorialCuentasPorCobrar />} />
                </Routes>
            </CuentasPorCobrarProvider>
        </>
    )

}

export { CuentasPorCobrarWrapper }