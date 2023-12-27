import { FC } from "react"
import { ReportesEgresosGraficosProvider } from "./ReportesEgresosGraficosContext"
import { Route, Routes } from "react-router-dom"
import { EgresosGastos } from "./EgresosGastos/EgresosGastos"
import { PagoProveedores } from "./PagoProveedores/PagoProveedores"
import { ReportesEgresosGraficos } from "./ReportesEgresosGraficos"
import { CuentasPorPagar } from "./CuentasPorPagar/CuentasPorPagar"



const ReportesEgresosGraficosWrapper: FC = () => {

    return (
        <>
            <ReportesEgresosGraficosProvider>
                <Routes>
                    <Route path='/*' element={<ReportesEgresosGraficos />} />
                    <Route path='/EgresosGastos' element={<EgresosGastos />}/>
                    <Route path='/CuentasPorPagar' element={<CuentasPorPagar />}/>
                    <Route path='/PagoProveedores' element={<PagoProveedores/>} />
                </Routes>
            </ReportesEgresosGraficosProvider>
        </>
    )

}

export { ReportesEgresosGraficosWrapper }