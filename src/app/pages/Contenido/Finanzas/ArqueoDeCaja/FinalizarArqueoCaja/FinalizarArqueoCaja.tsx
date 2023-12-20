import { FC, useState } from "react";
import "./FinalizarArqueoCaja.css";

const FinalizarArqueoCaja: FC = () => {

    const [isChecked, setIsChecked] = useState<boolean>(false);

    const toggleSwitch = () => {
        setIsChecked(!isChecked);
    };
    
    return(
        <>
        <div style={{width: "100%", paddingLeft: "40px", paddingTop: "35px"}}>
            <div className="FinalizarArqueoCaja-hora">
                <span>Hora  de apertura</span>
                <span style={{fontWeight: "500"}}>13/09/23 23:43:21</span>
            </div>
            <div>
                <table style={{width: "25%"}}>
                    <thead>
                        <tr className="FinalizarArqueoCaja-titulos">
                            <th>
                                <span>Distribuidor  1</span>
                            </th>
                            <th>
                                <span>Abierto</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody >
                        <tr className="FinalizarArqueoCaja-body">
                            <td>
                                <div style={{marginTop: "16px"}}>
                                    <span>Alberto</span>
                                </div>
                            </td>
                            <td>
                                <div style={{marginTop: "16px"}}>
                                    <label className="switch-container">
                                        <input type="checkbox" checked={isChecked} onChange={toggleSwitch} />
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "32px", marginTop: "55px", width: "100%", maxWidth: "1100px"}}>
                <div className="FinalizarArqueoCaja-FormTitle">
                    <span>Saldos según sistema</span>
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                    <div style={{display: "flex", alignItems: "center", gap: "24px", width:"323px"}}>
                        <label className="FinalizarArqueoCaja-item">Monto</label>
                        <input className="FinalizarArqueoCaja-imput" type="number" />
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "24px", width:"323px"}}>
                        <label className="FinalizarArqueoCaja-item">Ingresos</label>
                        <input className="FinalizarArqueoCaja-imput" type="number" />
                    </div>
                    <div style={{display: "flex", flexDirection: "column", gap: "16px", paddingLeft:"86px"}}>
                        <div style={{display: "flex", alignItems: "center", gap: "24px", width:"323px"}}>
                            <label className="FinalizarArqueoCaja-item" style={{fontWeight: "400"}}>Ventas efectivo</label>
                            <input className="FinalizarArqueoCaja-imput" style={{width: "190px"}} type="number" />
                        </div>
                        <div style={{display: "flex", alignItems: "center", gap: "24px", width:"323px"}}>
                            <label className="FinalizarArqueoCaja-item" style={{fontWeight: "400"}}>Cobro ventas. Crédito</label>
                            <input className="FinalizarArqueoCaja-imput" style={{width: "145px"}} type="number" />
                        </div>
                        <div style={{display: "flex", alignItems: "center", gap: "24px", width:"323px"}}>
                            <label className="FinalizarArqueoCaja-item" style={{fontWeight: "400"}}>Ventas por cobrar </label>
                            <input className="FinalizarArqueoCaja-imput" style={{width: "170px"}} type="number" />
                        </div>
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "24px", width:"323px"}}>
                        <label className="FinalizarArqueoCaja-item">Egresos</label>
                        <input className="FinalizarArqueoCaja-imput" type="number" />
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "82px", paddingLeft:"86px"}}>
                        <div style={{display: "flex", alignItems: "center", gap: "24px", width:"323px"}}>
                            <label className="FinalizarArqueoCaja-item" style={{fontWeight: "400"}}>Gastos</label>
                            <input className="FinalizarArqueoCaja-imput" type="number" />
                        </div>
                        <div style={{display: "flex", alignItems: "center", gap: "24px", width:"323px"}}>
                            <label className="FinalizarArqueoCaja-item" style={{fontWeight: "400"}}>Total efectivo</label>
                            <input className="FinalizarArqueoCaja-imput" style={{width: "204px"}} type="number" />
                        </div>
                    </div>
                </div>
                <div className="FinalizarArqueoCaja-FormTitle">
                    <span>Saldos según sistema</span>
                </div>
                <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                    <div style={{display: "flex", alignItems: "center", gap: "24px", width:"323px"}}>
                        <label className="FinalizarArqueoCaja-item" style={{fontWeight: "400"}}>Monto</label>
                        <input className="FinalizarArqueoCaja-imput" type="number" />
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "24px", width:"323px"}}>
                        <label className="FinalizarArqueoCaja-item" style={{fontWeight: "400"}}>Ingresos</label>
                        <input className="FinalizarArqueoCaja-imput" type="number" />
                    </div>
                    <div style={{display: "flex", alignItems: "center", gap: "82px"}}>
                        <div style={{display: "flex", alignItems: "center", gap: "24px", width:"323px"}}>
                            <label className="FinalizarArqueoCaja-item" style={{fontWeight: "400"}}>Cuentas por cobrar</label>
                            <input className="FinalizarArqueoCaja-imput" style={{width: "161px"}} type="number" />
                        </div>
                        <div style={{display: "flex", alignItems: "center", gap: "24px", width:"323px"}}>
                            <label className="FinalizarArqueoCaja-item" style={{fontWeight: "400"}}>Cuentas por cobrar</label>
                            <input className="FinalizarArqueoCaja-imput" style={{width: "161px"}} type="number" />
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", gap: "16px"}}>
                        <label className="FinalizarArqueoCaja-item" style={{fontWeight: "400"}}>Comentario</label>
                        <textarea className="FinalizarArqueoCaja-textarea" name="" id="" rows={7}></textarea>
                    </div>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div style={{display: "flex", alignItems: "center", gap: "24px", width:"323px"}}>
                            <label className="FinalizarArqueoCaja-item" style={{fontWeight: "400"}}>Diferencia</label>
                            <input className="FinalizarArqueoCaja-imput" type="text" />
                        </div>
                    </div>
                </div>
                <div style={{display: "flex", alignItems: "center", justifyContent: "end"}}>
                    <button type="button" className="btn FinalizarArqueoCaja-btn">Finalizar arqueo</button>
                </div>
            </div>
        </div>
        </>
    )
}

export{ FinalizarArqueoCaja }