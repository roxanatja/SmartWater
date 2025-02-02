import { FC } from "react";
import "./ReportesResultadosGraficos.css";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../../../components/PageTitle/PageTitle";
import { TablaReporteResultados } from "./TablaReporteResultados/TablaReporteResultados";
import { BarChart } from "../../../../components/Barchart/Barchart";

const ReportesResultadosGraficos: FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <div className="px-10 h-full overflow-y-auto">
                <PageTitle titulo="Efectivo, egresos y gastos" icon="/Reportes-icon.svg" hasBack onBack={() => {
                    navigate('/Reportes/Resultados');
                }} />


                <div style={{ marginTop: "32px" }}>
                    <div>
                        <TablaReporteResultados />
                    </div>
                    <div style={{ marginTop: "80px" }}>
                        <BarChart />
                    </div>
                </div>
            </div>
        </>
    )
}

export { ReportesResultadosGraficos }