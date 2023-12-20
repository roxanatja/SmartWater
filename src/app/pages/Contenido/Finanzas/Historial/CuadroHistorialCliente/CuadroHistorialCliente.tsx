import { FC, useContext, useState } from "react";
import "./CuadroHistorialCliente.css";
import { SmartwaterContext } from "../../../../../SmartwaterContext";
import { Option } from "../../../../components/Option/Option"

const CuadroHistorialCliente: FC = () => {
    
    const { setShowMiniModal } = useContext(SmartwaterContext)

    const [showOptions, setShowOptions] = useState<boolean>(false);

    const Opciones = () => {
        setShowOptions(!showOptions);
        console.log(showOptions)
    }

    const Delete = () => {
        setShowOptions(false);
    }

    return(
        <>
        <div className="CuadroHistorialCliente-container">
            <div style={{padding: "15px 20px 12px 10px"}}>
                <div style={{display: "flex", justifyContent: "space-between", marginBottom: "25px"}}>
                    <div style={{display: "flex", alignItems: "center", gap: "15px"}}>
                        <div className="CuadroVentaCliente-header">
                            <img src="../../Cliente2.svg" alt="" />
                            <span>Rubén González</span>
                        </div>
                        <div className="CuadroVentaCliente-text">
                            <span>No. Cliente: <span style={{color: "#1A3D7D"}}>NREV5896</span></span>
                        </div>
                        <div className="infoClientes-ultimaventa">
                            <span>20/01/2023</span>
                        </div>
                    </div>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <button type="button" className="btn" onClick={() => setShowMiniModal(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="12" viewBox="0 0 19 12" fill="none">
                                <path d="M5.96141 5.5H15.3742C15.6238 5.5 15.8632 5.57902 16.0397 5.71967C16.2163 5.86032 16.3154 6.05109 16.3154 6.25C16.3154 6.44891 16.2163 6.63968 16.0397 6.78033C15.8632 6.92098 15.6238 7 15.3742 7H5.96141C5.71177 7 5.47235 6.92098 5.29583 6.78033C5.1193 6.63968 5.02013 6.44891 5.02013 6.25C5.02013 6.05109 5.1193 5.86032 5.29583 5.71967C5.47235 5.57902 5.71177 5.5 5.96141 5.5ZM5.96141 10.5H15.3742C15.6238 10.5 15.8632 10.579 16.0397 10.7197C16.2163 10.8603 16.3154 11.0511 16.3154 11.25C16.3154 11.4489 16.2163 11.6397 16.0397 11.7803C15.8632 11.921 15.6238 12 15.3742 12H5.96141C5.71177 12 5.47235 11.921 5.29583 11.7803C5.1193 11.6397 5.02013 11.4489 5.02013 11.25C5.02013 11.0511 5.1193 10.8603 5.29583 10.7197C5.47235 10.579 5.71177 10.5 5.96141 10.5ZM0.941275 0.5H9.09899C9.34863 0.5 9.58805 0.579018 9.76457 0.71967C9.9411 0.860322 10.0403 1.05109 10.0403 1.25C10.0403 1.44891 9.9411 1.63968 9.76457 1.78033C9.58805 1.92098 9.34863 2 9.09899 2H0.941275C0.691633 2 0.452216 1.92098 0.275693 1.78033C0.0991698 1.63968 0 1.44891 0 1.25C0 1.05109 0.0991698 0.860322 0.275693 0.71967C0.452216 0.579018 0.691633 0.5 0.941275 0.5ZM1.25503 12C0.922178 12 0.602955 11.8946 0.367591 11.7071C0.132226 11.5196 0 11.2652 0 11C0 10.7348 0.132226 10.4804 0.367591 10.2929C0.602955 10.1054 0.922178 10 1.25503 10C1.58789 10 1.90711 10.1054 2.14248 10.2929C2.37784 10.4804 2.51007 10.7348 2.51007 11C2.51007 11.2652 2.37784 11.5196 2.14248 11.7071C1.90711 11.8946 1.58789 12 1.25503 12ZM2.51007 6C2.51007 6.26522 2.37784 6.51957 2.14248 6.70711C1.90711 6.89464 1.58789 7 1.25503 7C0.922178 7 0.602955 6.89464 0.367591 6.70711C0.132226 6.51957 0 6.26522 0 6C0 5.73478 0.132226 5.48043 0.367591 5.29289C0.602955 5.10536 0.922178 5 1.25503 5C1.58789 5 1.90711 5.10536 2.14248 5.29289C2.37784 5.48043 2.51007 5.73478 2.51007 6ZM15.4545 2.918L12.6382 0.417C12.5977 0.381061 12.5711 0.336546 12.5617 0.288837C12.5523 0.241128 12.5604 0.192267 12.5851 0.148161C12.6098 0.104054 12.65 0.06659 12.7009 0.040297C12.7517 0.014004 12.811 7.78815e-06 12.8716 0H18.5042C18.5648 7.78815e-06 18.6241 0.014004 18.675 0.040297C18.7258 0.06659 18.766 0.104054 18.7907 0.148161C18.8154 0.192267 18.8235 0.241128 18.8141 0.288837C18.8047 0.336546 18.7781 0.381061 18.7376 0.417L15.9214 2.917C15.8919 2.94311 15.8559 2.96398 15.8157 2.97828C15.7755 2.99257 15.732 2.99996 15.6879 2.99996C15.6439 2.99996 15.6003 2.99257 15.5601 2.97828C15.5199 2.96398 15.4839 2.94311 15.4545 2.917V2.918Z" fill="black"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="CuadroVentaCliente-productos">
                    <div style={{width: "100%"}}>
                        <table style={{width: "75%"}}>
                            <thead style={{textAlign: "left", marginBottom: "5px"}}>
                                <tr>
                                    <th style={{width: "50%"}}>
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
                                        <div style={{display: "flex", alignItems: "center", gap: "26px", marginBottom: "6px 6px"}}>
                                            <img src="../../BotellaGrande.svg" alt="" />
                                            <span className="CuadroVentaCliente-text">Botellon 20 lts</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="CuadroVentaCliente-TextContainer" style={{ marginBottom: "6px"}}>
                                            <span className="CuadroVentaCliente-text" style={{fontWeight: "600"}}>1</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ marginBottom: "6px"}}>
                                            <span className="CuadroVentaCliente-text" style={{fontWeight: "600"}}>15 Bs.</span>
                                        </div>
                                    </td>
                                </tr>
                                <tr style={{}}>
                                    <td>
                                        <div style={{display: "flex", alignItems: "center", gap: "26px", marginBottom: "6px"}}>
                                            <img src="../../dispensador.svg" alt="" />
                                            <span className="CuadroVentaCliente-text">Dispensador</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="CuadroVentaCliente-TextContainer" style={{ marginBottom: "6px"}}>
                                            <span className="CuadroVentaCliente-text" style={{fontWeight: "600"}}>1</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ marginBottom: "6px"}}>
                                            <span className="CuadroVentaCliente-text" style={{fontWeight: "600"}}>15 Bs.</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <button type="button" className="btn" onClick={() => Opciones()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="16" viewBox="0 0 6 16" fill="none">
                                <path d="M3.29522 12C3.96093 12 4.59938 12.2107 5.07011 12.5858C5.54084 12.9609 5.80529 13.4696 5.80529 14C5.80529 14.5304 5.54084 15.0391 5.07011 15.4142C4.59938 15.7893 3.96093 16 3.29522 16C2.62951 16 1.99107 15.7893 1.52034 15.4142C1.04961 15.0391 0.785156 14.5304 0.785156 14C0.785156 13.4696 1.04961 12.9609 1.52034 12.5858C1.99107 12.2107 2.62951 12 3.29522 12ZM3.29522 6C3.96093 6 4.59938 6.21071 5.07011 6.58579C5.54084 6.96086 5.80529 7.46957 5.80529 8C5.80529 8.53043 5.54084 9.03914 5.07011 9.41421C4.59938 9.78929 3.96093 10 3.29522 10C2.62951 10 1.99107 9.78929 1.52034 9.41421C1.04961 9.03914 0.785156 8.53043 0.785156 8C0.785156 7.46957 1.04961 6.96086 1.52034 6.58579C1.99107 6.21071 2.62951 6 3.29522 6ZM3.29522 0C3.96093 0 4.59938 0.210714 5.07011 0.585786C5.54084 0.960859 5.80529 1.46957 5.80529 2C5.80529 2.53043 5.54084 3.03914 5.07011 3.41421C4.59938 3.78929 3.96093 4 3.29522 4C2.62951 4 1.99107 3.78929 1.52034 3.41421C1.04961 3.03914 0.785156 2.53043 0.785156 2C0.785156 1.46957 1.04961 0.960859 1.52034 0.585786C1.99107 0.210714 2.62951 0 3.29522 0Z" fill="black"/>
                            </svg>
                        </button>
                        <Option visible={showOptions} eliminar={true} deleteAction={Delete}/>
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

export{CuadroHistorialCliente}