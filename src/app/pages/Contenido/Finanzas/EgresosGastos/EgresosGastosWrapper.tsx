import { FC } from "react";
import { EgresosGastosProvider } from "./EgresosGastosContext";
import { EgresosGastos } from "./EgresosGastos";
import { Navigate, Route, Routes } from "react-router-dom";

const EgresosGastosWrapper: FC = () => {

    return (
        <>
            <EgresosGastosProvider>
                <Routes>
                    <Route path="/" element={<Navigate to={"/Finanzas/EgresosGastos/Cuentas"} replace />} />
                    <Route path="/:section" element={<EgresosGastos />} />
                </Routes>
            </EgresosGastosProvider>
        </>
    )

}

export { EgresosGastosWrapper }