import { FC } from "react";
import "./TableArqueoCaja.css";

const TableArqueoCaja: FC = () => {
    return(
        <>
        <div>
            <table style={{width: "65%"}}>
                <thead>
                    <tr className="TableArqueoCaja-titulos">
                        <th>
                            <span>Hora  de apertura</span>
                        </th>
                        <th>
                            <span>Hora de cierre</span>
                        </th>
                        <th>
                            <span>Distribuidor </span>
                        </th>
                        <th>
                            <span>Sistema</span>
                        </th>
                        <th>
                            <span>Diferencia</span>
                        </th>
                        <th>
                            <span>Estado</span>
                        </th>
                    </tr>
                </thead>
                <tbody >
                    <tr className="TableArqueoCaja-body">
                        <td>
                            <div style={{marginTop: "16px"}}>
                                <span>13/09/23 23:43:21</span>
                            </div>
                        </td>
                        <td>
                            <div style={{marginTop: "16px"}}>
                                <span>13/09/23 23:45:40</span>
                            </div>
                        </td>
                        <td>
                            <div style={{marginTop: "16px"}}>
                                <span>Alberto</span>
                            </div>
                        </td>
                        <td>
                            <div style={{marginTop: "16px"}}>
                                <span>250</span>
                            </div>
                        </td>
                        <td>
                            <div style={{marginTop: "16px"}}>
                                <span>0</span>
                            </div>
                        </td>
                        <td>
                            <div style={{marginTop: "16px"}}>
                                <span>Cerrado</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        </>
    )
}

export{ TableArqueoCaja }