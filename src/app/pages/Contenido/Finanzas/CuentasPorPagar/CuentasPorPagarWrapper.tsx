import { FC } from "react";
import { CuentasPorPagarProvider } from "./CuentasPorPagarContext";
import { Navigate, Route, Routes } from "react-router-dom";
import PagarRoot from "./PagarRoot";



const CuentasPorPagarWrapper: FC = () => {
    return (
        <>
            <CuentasPorPagarProvider>
                <Routes>
                    <Route path="/" element={<Navigate to={"/Finanzas/CuentasPorPagar/Cuentas"} replace />} />
                    {/* <Route path='/Historial/:client' element={<HistorialRoot />} />
                    <Route path='/Historial/:client/:section' element={<HistorialRoot />} /> */}
                    <Route path='/:section' element={<PagarRoot />} />
                </Routes>
            </CuentasPorPagarProvider>
        </>
    )

}

export { CuentasPorPagarWrapper }