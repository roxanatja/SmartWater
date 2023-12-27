import { FC } from "react"
import { ReportesEgresosProvider } from "./ReportesEgresosContext"
import { ReportesEgresos } from "./ReportesEgresos"



const ReportesEgresosWrapper: FC = () => {

    return (
        <>
            <ReportesEgresosProvider>
                <ReportesEgresos/>
            </ReportesEgresosProvider>
        </>
    )

}

export { ReportesEgresosWrapper }