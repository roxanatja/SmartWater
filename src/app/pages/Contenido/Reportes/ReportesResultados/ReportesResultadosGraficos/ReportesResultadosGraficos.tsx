import { FC } from "react";
import "./ReportesResultadosGraficos.css";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../../../components/PageTitle/PageTitle";
import { TablaReporteResultados } from "./TablaReporteResultados/TablaReporteResultados";
import { BarChart } from "../../../../components/Barchart/Barchart";

const ReportesResultadosGraficos:FC = () => {

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/Reportes/Resultados');
    };
    
    return(
        <>
        <div>
            <div>
                <button className="btn" onClick={handleClick}>
                    <span className="material-symbols-outlined">
                        arrow_back
                    </span>
                </button>
            </div>
            <PageTitle titulo="Efectivo, egresos y gastos" icon="../../Reportes-icon.svg"/>
            <div style={{width: "100%", display: "flex", justifyContent: "right", marginTop: "50px"}}>
                <button type="button" className="boton-filtro">
                    <span style={{marginRight: "5px"}}>Filtrar</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <g clipPath="url(#clip0_35_4995)">
                        <path d="M0 19.5C0 18.6703 0.670312 18 1.5 18H4.06406C4.64062 16.6734 5.9625 15.75 7.5 15.75C9.0375 15.75 10.3594 16.6734 10.9359 18H22.5C23.3297 18 24 18.6703 24 19.5C24 20.3297 23.3297 21 22.5 21H10.9359C10.3594 22.3266 9.0375 23.25 7.5 23.25C5.9625 23.25 4.64062 22.3266 4.06406 21H1.5C0.670312 21 0 20.3297 0 19.5ZM9 19.5C9 18.6703 8.32969 18 7.5 18C6.67031 18 6 18.6703 6 19.5C6 20.3297 6.67031 21 7.5 21C8.32969 21 9 20.3297 9 19.5ZM18 12C18 11.1703 17.3297 10.5 16.5 10.5C15.6703 10.5 15 11.1703 15 12C15 12.8297 15.6703 13.5 16.5 13.5C17.3297 13.5 18 12.8297 18 12ZM16.5 8.25C18.0375 8.25 19.3594 9.17344 19.9359 10.5H22.5C23.3297 10.5 24 11.1703 24 12C24 12.8297 23.3297 13.5 22.5 13.5H19.9359C19.3594 14.8266 18.0375 15.75 16.5 15.75C14.9625 15.75 13.6406 14.8266 13.0641 13.5H1.5C0.670312 13.5 0 12.8297 0 12C0 11.1703 0.670312 10.5 1.5 10.5H13.0641C13.6406 9.17344 14.9625 8.25 16.5 8.25ZM9 3C8.17031 3 7.5 3.67031 7.5 4.5C7.5 5.32969 8.17031 6 9 6C9.82969 6 10.5 5.32969 10.5 4.5C10.5 3.67031 9.82969 3 9 3ZM12.4359 3H22.5C23.3297 3 24 3.67031 24 4.5C24 5.32969 23.3297 6 22.5 6H12.4359C11.8594 7.32656 10.5375 8.25 9 8.25C7.4625 8.25 6.14062 7.32656 5.56406 6H1.5C0.670312 6 0 5.32969 0 4.5C0 3.67031 0.670312 3 1.5 3H5.56406C6.14062 1.67344 7.4625 0.75 9 0.75C10.5375 0.75 11.8594 1.67344 12.4359 3Z" fill="#1B1B1B"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_35_4995">
                        <rect width="24" height="24" fill="white"/>
                        </clipPath>
                        </defs>
                    </svg>
                </button>
            </div>
            <div style={{marginTop: "32px"}}>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-start"}}>
                        <div style={{display: "flex", alignItems: "flex-start", gap: "48px"}}>
                            <div style={{display: "flex", alignItems: "center", gap: "15px"}}>
                                <div className="ReportesResultadosGraficos-Fecha">
                                    <span style={{textAlign: "left", width: "100%"}}>De</span>
                                    <div className="ReportesResultadosGraficos-FechaInput">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 22 24" fill="none">
                                            <path d="M19.2 2.4H18V0H15.6V2.4H6V0H3.6V2.4H2.4C1.068 2.4 0 3.468 0 4.8V21.6C0 22.2365 0.252856 22.847 0.702944 23.2971C1.15303 23.7471 1.76348 24 2.4 24H19.2C20.52 24 21.6 22.92 21.6 21.6V4.8C21.6 4.16348 21.3471 3.55303 20.8971 3.10294C20.447 2.65286 19.8365 2.4 19.2 2.4ZM19.2 21.6H2.4V8.4H19.2V21.6ZM10.8 19.2V16.8H6V13.2H10.8V10.8L15.6 15L10.8 19.2Z" fill="black"/>
                                        </svg>
                                        <input type="date" />
                                    </div>
                                </div>
                                <div className="ReportesResultadosGraficos-Fecha">
                                    <span style={{textAlign: "left", width: "100%"}}>A</span>
                                    <div className="ReportesResultadosGraficos-FechaInput">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 22 24" fill="none">
                                            <path d="M19.2 2.4H18V0H15.6V2.4H6V0H3.6V2.4H2.4C1.068 2.4 0 3.468 0 4.8V21.6C0 22.2365 0.252856 22.847 0.702944 23.2971C1.15303 23.7471 1.76348 24 2.4 24H19.2C20.52 24 21.6 22.92 21.6 21.6V4.8C21.6 4.16348 21.3471 3.55303 20.8971 3.10294C20.447 2.65286 19.8365 2.4 19.2 2.4ZM19.2 21.6H2.4V8.4H19.2V21.6ZM10.8 10.8V13.2H15.6V16.8H10.8V19.2L6 15L10.8 10.8Z" fill="black"/>
                                        </svg>
                                        <input type="date" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button className="ReportesResultadosGraficos-btn">
                                <span>Generar reporte</span>
                            </button>
                        </div>
                    </div>
                </form>
                <div>
                    <TablaReporteResultados/>
                </div>
                <div style={{marginTop: "80px"}}>
                    <BarChart/>
                </div>
            </div>
        </div>
        </>
    )
}

export{ReportesResultadosGraficos}