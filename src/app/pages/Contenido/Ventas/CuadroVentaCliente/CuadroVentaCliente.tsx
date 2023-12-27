import { FC, useContext, useState } from "react";
import "./CuadroVentaCliente.css";
import { Option } from "../../../components/Option/Option";
import { VentasContext } from "../VentasContext";

const CuadroVentaCliente: FC = () => {

    const { setShowModal } = useContext(VentasContext);

    const [showOptions, setShowOptions] = useState<boolean>(false);

    const handleOpen = () => {
        setShowModal(true);
    }

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
        <div className="CuadroVentaCliente-container">
            <div style={{padding: "15px 20px 12px 10px"}}>
                <div style={{display: "flex", flexDirection: "column", gap: "5px", marginBottom: "10px"}}>
                    <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                        <div className="CuadroVentaCliente-header">
                            <img src="./Cliente2.svg" alt="" />
                            <span>Rubén González</span>
                        </div>
                        <div style={{display: "flex", alignItems: "center"}}>
                            <button type="button" className="btn" onClick={handleOpen}>
                                <img src="./Opciones-icon.svg" alt=""/>
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
                <div className="CuadroVentaCliente-productos">
                    <div style={{width: "100%"}}>
                        <table style={{width: "100%"}}>
                            <thead style={{textAlign: "left", marginBottom: "5px"}}>
                                <tr>
                                    <th>
                                        <span>Productos</span>
                                    </th>
                                    <th>
                                        <span>Cantidad</span>
                                    </th>
                                    <th>
                                        <span>Precio</span>
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
                                    <td>
                                        <div>
                                            <span className="CuadroVentaCliente-text" style={{fontWeight: "600"}}>15 Bs.</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr style={{}}>
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
                                    <td>
                                        <div>
                                            <span className="CuadroVentaCliente-text" style={{fontWeight: "600"}}>15 Bs.</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <button type="button" className="btn" onClick={() => Opciones()}>
                            <img src="./opcion-icon.svg" alt="" />
                        </button>
                        <Option editAction={Edit} visible={showOptions} editar={true} eliminar={true} deleteAction={Delete}/>
                    </div>
                </div>
            </div>
            <div style={{width: "98%", height: "1px", background: "#52A5F5", marginLeft: "3px"}}>
            </div>
            <div style={{width: "100%", textAlign: "right", padding: "9px 43px 20px 0px"}}>
                <span className="CuadroVentaCliente-text" style={{fontWeight: "600", fontSize: "14px", marginRight: "17px"}}>Total:</span>
                <span className="CuadroVentaCliente-text" style={{fontWeight: "600", fontSize: "18px", color: "#1A3D7D"}}>60Bs</span>
            </div>
        </div>
        </>
    )
}

export { CuadroVentaCliente }