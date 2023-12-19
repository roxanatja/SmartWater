import { FC, useState } from "react";
import "./ArqueoDeCaja.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { TableArqueoCaja } from "./TableArqueoCaja/TableArqueoCaja";
import { FinalizarArqueoCaja } from "./FinalizarArqueoCaja/FinalizarArqueoCaja";

const ArqueoDeCaja: FC = () => {

    const [finalizarArqueo, setFinalizarArqueo] = useState<boolean>(false);

    return(
        <>
        <div>
            <PageTitle titulo="Arqueo De Cajas" icon="../Finanzas-icon.svg"/>
            {
                finalizarArqueo === false ?
                <div style={{width: "100%", padding: "70px 20px 0px 40px"}}>
                    <TableArqueoCaja/>
                    <form>
                        <div className="ArqueoCaja-containerform">
                            <div className="ArqueoCaja-tituloform">
                                <span>Nuevo arqueo de caja</span>
                            </div>
                            <div className="ArqueoCaja-bodyform">
                                <div className="ArqueoCaja-itemform">
                                    <label>Fecha</label>
                                    <input type="date" style={{fontSize: "12px"}}/>
                                </div>
                                <div className="ArqueoCaja-itemform">
                                    <label>Hora</label>
                                    <input type="time" style={{fontSize: "12px"}}/>
                                </div>
                                <div className="ArqueoCaja-itemform">
                                    <label>Monto inicial BS.</label>
                                    <input type="text" style={{fontSize: "12px"}}/>
                                </div>
                                <div className="ArqueoCaja-itemform">
                                    <label>Distribuidor 1</label>
                                    <input type="text" style={{fontSize: "12px"}}/>
                                </div>
                            </div>
                            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
                                <button /*type="submit"*/ type="button" className="ArqueoCaja-btn" onClick={() => setFinalizarArqueo(true)}>
                                    <span>Iniciar arqueo</span>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                :
                <FinalizarArqueoCaja/>
            }
        </div>
        </>
    )
}

export{ ArqueoDeCaja }