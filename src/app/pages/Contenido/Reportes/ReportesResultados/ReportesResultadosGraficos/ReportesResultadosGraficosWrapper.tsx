import { FC } from "react"
import { ReportesResultadosGraficosProvider } from "./ReportesResultadosGraficosContext"
import { ReportesResultadosGraficos } from "./ReportesResultadosGraficos"



const ReportesResultadosGraficosWrapper: FC = () => {

    return (
        <>
            <ReportesResultadosGraficosProvider>
                    <ReportesResultadosGraficos />
            </ReportesResultadosGraficosProvider>
        </>
    )

}

export { ReportesResultadosGraficosWrapper }