import { FC } from "react";
import "./ReportesResultadosGraficos.css";
import { useNavigate } from "react-router-dom";
import { PageTitle } from "../../../../components/PageTitle/PageTitle";

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
            <div >
                
            </div>
        </div>
        </>
    )
}

export{ReportesResultadosGraficos}