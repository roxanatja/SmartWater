import { FC } from "react";
import { CuentasPorCobrarProvider } from "./CuentasPorCobrarContext";
import { Navigate, Route, Routes } from "react-router-dom";
import CobrarRoot from "./CobrarRoot";
import HistorialRoot from "./HistorialCuentasPorCobrar/HistorialRoot";



const CuentasPorCobrarWrapper: FC = () => {
    return (
        <>
            <CuentasPorCobrarProvider>
                <Routes>
                    <Route path="/" element={<Navigate to={"/Finanzas/CuentasPorCobrarCobros/Cuentas"} replace />} />
                    <Route path='/Historial/:client' element={<HistorialRoot />} />
                    <Route path='/Historial/:client/:section' element={<HistorialRoot />} />
                    <Route path='/:section' element={<CobrarRoot />} />
                </Routes>
            </CuentasPorCobrarProvider>
        </>
    )

}

export { CuentasPorCobrarWrapper }