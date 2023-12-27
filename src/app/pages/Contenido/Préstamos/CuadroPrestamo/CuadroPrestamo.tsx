import { FC, useContext, useState } from "react";
import "./CuadroPrestamo.css";
import { Option } from "../../../components/Option/Option";
import { PrestamosContext } from "../PrestamosContext";

type Prestamo = {
    estadoContrato: "Contrato Vencido" | "Sin Contrato" | "Con Contrato" | null
}

const CuadroPrestamo: FC<Prestamo> = ({estadoContrato}) => {

    const { setShowMiniModal } = useContext(PrestamosContext)

    const [showOptions, setShowOptions] = useState<boolean>(false);

    const Opciones = () => {
        setShowOptions(!showOptions);
    }
    
    const Edit = () => {
        setShowOptions(false);
    }

    const Delete = () => {
        setShowOptions(false);
    }

    return(
        <>
        <div className="CuadroPrestamo-container">
            <div style={{display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px"}}>
                <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                    <div className="CuadroVentaCliente-header">
                        <img src="./Cliente2.svg" alt="" />
                        <span>Rubén González</span>
                    </div>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <button type="button" className="btn" onClick={() => setShowMiniModal(true)}>
                            <img src="./Opciones-icon.svg" alt="" />
                        </button>
                    </div>
                    <div className="infoClientes-ultimaventa">
                        <span>20/01/2023</span>
                    </div>
                </div>
                <div className="CuadroVentaCliente-text">
                    <span>No. Cliente: <span style={{color: "#1A3D7D"}}>NREV5896</span></span>
                </div>
            </div>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "end"}}>
                <div>
                    <span className="CuadroPrestamo-texto">ítems</span>
                </div>
                <div>
                    <button type="button" className="btn" onClick={() => Opciones()}>
                        <img src="./opcion-icon.svg" alt="" />
                    </button>
                    <Option editAction={Edit} visible={showOptions} editar={true} eliminar={true} deleteAction={Delete}/>
                </div>
            </div>
            <div className="CuadroVentaCliente-productos" style={{alignItems: "end", justifyContent: "left"}}>
                <div style={{width: "70%"}}>
                    <table style={{width: "90%"}}>
                        <thead style={{textAlign: "left"}}>
                            <tr>
                                <th>
                                    <span>Productos</span>
                                </th>
                                <th>
                                    <span>Cantidad</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                                        <img src="./Botella-icon.svg" alt="" />
                                        <span className="CuadroVentaCliente-text">20 lts</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="CuadroVentaCliente-TextContainer">
                                        <span className="CuadroVentaCliente-text" style={{fontWeight: "600"}}>1</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {
                    estadoContrato === "Con Contrato" ? 
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <img src="./ConContrato.svg" alt="" />
                        <span className="CuadroPrestamo-texto" style={{fontSize: "10px", fontWeight: "500", fontFamily: "'Poppins', sans-serif"}}>Contrato</span>
                    </div>
                    :
                    estadoContrato === "Sin Contrato" ?
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="29" height="29" viewBox="0 0 29 29" fill="none">
                            <image xlinkHref="./ConContrato.svg" x="4" y="5" width="21" height="21" />
                            <circle cx="14.5" cy="14.5" r="13" stroke="#FF0000" strokeWidth="3"/>
                            <path d="M7.0 22.9L23.1 6" stroke="#FF0000" strokeWidth="3"/>
                        </svg>
                        <span className="CuadroPrestamo-texto" style={{fontSize: "9px", fontWeight: "500", fontFamily: "'Poppins', sans-serif"}}>Sin Contrato</span>
                    </div>
                    :
                    estadoContrato === "Contrato Vencido" ?
                    <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                        <img src="./ContratoVencido.svg" alt="" />
                        <span className="CuadroPrestamo-texto" style={{fontSize: "10px", fontWeight: "500", fontFamily: "'Poppins', sans-serif"}}>Contrato Vencido</span>
                    </div>
                    : 
                    null
                }
            </div>
        </div>
        </>
    )
}

export{ CuadroPrestamo }