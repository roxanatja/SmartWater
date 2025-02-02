import { FC } from "react"
import { ReportesGraficosProvider } from "./ReportesGraficosContext"
import { Route, Routes } from "react-router-dom"
import { ReportesGraficos } from "./ReportesGraficos"
import { PrestamosVsVentas } from "./PrestamosVsVentas/PrestamosVsVentas"
import { VentasPorProductos } from "./VentasPorProductos/VentasPorProductos"
import { VentasPorDistribuidor } from "./VentasPorDistribuidor/VentasPorDistribuidor"
import { CxcPorDistribuidor } from "./CxcPorDistribuidor/CxcPorDistribuidor"
import { PrestamosPorItem } from "./PrestamosPorItem/PrestamosPorItem"



const ReportesGraficosWrapper: FC = () => {

    return (
        <>
            <ReportesGraficosProvider>
                <Routes>
                    <Route path='/*' element={<ReportesGraficos />} />
                    <Route path='/PrestamosVsVentas' element={<PrestamosVsVentas />} />
                    <Route path='/VentasPorProductos' element={<VentasPorProductos />} />
                    <Route path='/VentasPorDistribuidor' element={<VentasPorDistribuidor />} />
                    <Route path='/CuentasPorCobrar' element={<CxcPorDistribuidor />} />
                    <Route path='/Prestamos' element={<PrestamosPorItem />} />
                </Routes>
            </ReportesGraficosProvider>
        </>
    )

}

export { ReportesGraficosWrapper }