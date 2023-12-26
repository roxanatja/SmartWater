import { FC } from "react"
import { ReportesIngresosProvider } from "./ReportesIngresosContext"
import { ReportesIngresos } from "./ReportesIngresos"



const ReportesIngresosWrapper: FC = () => {

    return (
        <>
            <ReportesIngresosProvider>
                <ReportesIngresos/>
            </ReportesIngresosProvider>
        </>
    )

}

export { ReportesIngresosWrapper }