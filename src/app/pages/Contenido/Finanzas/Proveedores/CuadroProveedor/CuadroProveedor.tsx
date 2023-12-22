import { FC, useState } from "react";
import "./CuadroProveedor.css";
import { Option } from "../../../../components/Option/Option";

const CuadroProveedor: FC = () => {
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
        <div className="CuadroProveedor-container">
            <div className="CuadroProveedor-header">
                <div className="CuadroVentaCliente-header">
                    <img src="../Cliente2.svg" alt="" />
                    <span>Rubén González</span>
                </div>
                <div className="CuadroVentaCliente-header2">
                    <div className="PedidosCurso-datos">
                        <img src="../../whap-icon.svg" alt="" />
                        <span>78 25 48 96 87</span>
                    </div>
                    <button className="btn" onClick={Opciones}>
                        <span className="material-symbols-outlined">
                            more_vert
                        </span>
                        <Option visible={showOptions} editar eliminar editAction={Edit} deleteAction={Delete}/>
                    </button>
                </div>
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "7px", marginBottom: "10px"}}>
                <div className="CuadroVentaCliente-body">
                    <span>Correo: </span>
                    <span style={{color: "#1A3D7D"}}>juanperez@gmail.com</span>
                </div>
                <div className="CuadroVentaCliente-body">
                    <span>Dirección: </span>
                    <span style={{color: "#1A3D7D"}}>Avenida Mariscal Santa Cruz, Edificio Hansa, Piso 20.</span>
                </div>
                <div className="CuadroVentaCliente-body">
                    <span>Nit: </span>
                    <span style={{color: "#1A3D7D"}}>123456789</span>
                </div>
            </div>
            <div style={{display: "flex", alignItems: "center", width: "100%", justifyContent: "end", gap: "10px"}}>
                <span className="CuadroVentaCliente-body" style={{color: "#1A3D7D", fontWeight: "600"}}>
                    Saldo por pagar Ds.
                </span>
                <div className="moneda-cliente">
                    <img src="../Moneda-icon.svg" alt=""/>
                    <div>
                        <span>1000 Bs.</span>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export{CuadroProveedor}