import { FC } from "react"
import { ReportesResultadosProvider } from "./ReportesResultadosContext"
import { ReportesResultados } from "./ReportesResultados"
import { Route, Routes } from "react-router-dom"
import { ReportesResultadosGraficosWrapper } from "./ReportesResultadosGraficos/ReportesResultadosGraficosWrapper"



const ReportesResultadosWrapper: FC = () => {

    return (
        <>
            <ReportesResultadosProvider>
                <Routes>
                    <Route path='/*' element={<ReportesResultados/>} />
                    <Route path='/Graficos' element={<ReportesResultadosGraficosWrapper />}/>
                </Routes>
            </ReportesResultadosProvider>
        </>
    )

}

export { ReportesResultadosWrapper }