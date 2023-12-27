import { FC } from "react";

const TablaReporteResultados: FC = () => {
    return (
        <>
        <div style={{ width: "100%", marginTop: "25px" }}>
            <table style={{ width: "100%", borderSpacing: "0px" }}>
            <thead>
                <tr>
                    <th></th>
                    <div className="ReportesResultadosGraficos-TablaTitulo">
                        <th style={{ fontWeight: "500" }}>
                            <span>Enero</span>
                        </th>
                        <th style={{ fontWeight: "500" }}>
                            <span>Febrero</span>
                        </th>
                        <th style={{ fontWeight: "500" }}>
                            <span>Marzo</span>
                        </th>
                        <th style={{ fontWeight: "500" }}>
                            <span>Abril</span>
                        </th>
                        <th style={{ fontWeight: "500" }}>
                            <span>Mayo</span>
                        </th>
                        <th style={{ fontWeight: "500" }}>
                            <span>Junio</span>
                        </th>
                        <th style={{ fontWeight: "500" }}>
                            <span>Julio</span>
                        </th>
                        <th style={{ fontWeight: "500" }}>
                            <span>Agosto</span>
                        </th>
                    </div>
                </tr>
            </thead>
            <tbody>
                <tr>
                <th>
                    <div className="ReportesResultadosGraficos-TablaBody-item">
                        <span>Ingresos</span>
                    </div>
                </th>
                <div className="ReportesResultadosGraficos-TablaBody">
                    <td>
                        <div>
                            <span>50 Bs</span>
                        </div>
                    </td>
                    <td>
                        <div>
                            <span>50 Bs</span>
                        </div>
                    </td>
                    <td>
                        <div>
                            <span>50 Bs</span>
                        </div>
                    </td>
                    <td>
                        <div>
                            <span>50 Bs</span>
                        </div>
                    </td>
                    <td>
                        <div>
                            <span>50 Bs</span>
                        </div>
                    </td>
                    <td>
                        <div>
                            <span>50 Bs</span>
                        </div>
                    </td>
                    <td>
                        <div>
                            <span>50 Bs</span>
                        </div>
                    </td>
                    <td>
                        <div>
                            <span>50 Bs</span>
                        </div>
                    </td>
                </div>
                </tr>
                <tr>
                    <th>
                        <div className="ReportesResultadosGraficos-TablaBody-item2">
                        <span>Egresos</span>
                        </div>
                    </th>
                    <div className="ReportesResultadosGraficos-TablaBody" style={{ background: "#F3F3F3" }}>
                        <td>
                            <div>
                                <span>80 Bs</span>
                            </div>
                        </td>
                        <td>
                            <div>
                                <span>80 Bs</span>
                            </div>
                        </td>
                        <td>
                            <div>
                                <span>80 Bs</span>
                            </div>
                        </td>
                        <td>
                            <div>
                                <span>80 Bs</span>
                            </div>
                        </td>
                        <td>
                            <div>
                                <span>80 Bs</span>
                            </div>
                        </td>
                        <td>
                            <div>
                                <span>80 Bs</span>
                            </div>
                        </td>
                        <td>
                            <div>
                                <span>80 Bs</span>
                            </div>
                        </td>
                        <td>
                            <div>
                                <span>80 Bs</span>
                            </div>
                        </td>
                    </div>
                </tr>
                <tr>
                    <th>
                        <div className="ReportesResultadosGraficos-TablaBody-item3">
                            <span>Resultados</span>
                        </div>
                    </th>
                    <div className="ReportesResultadosGraficos-TablaBody">
                        <td>
                        <div>
                            <span>20 Bs</span>
                        </div>
                        </td>
                        <td>
                        <div>
                            <span>20 Bs</span>
                        </div>
                        </td>
                        <td>
                        <div>
                            <span>20 Bs</span>
                        </div>
                        </td>
                        <td>
                        <div>
                            <span>20 Bs</span>
                        </div>
                        </td>
                        <td>
                        <div>
                            <span>20 Bs</span>
                        </div>
                        </td>
                        <td>
                        <div>
                            <span>20 Bs</span>
                        </div>
                        </td>
                        <td>
                        <div>
                            <span>20 Bs</span>
                        </div>
                        </td>
                        <td>
                        <div>
                            <span>20 Bs</span>
                        </div>
                        </td>
                    </div>
                </tr>
            </tbody>
            </table>
        </div>
        </>
    );
};

export{TablaReporteResultados}