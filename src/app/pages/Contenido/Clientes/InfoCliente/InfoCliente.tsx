import { FC, useContext, useState } from "react"
import "./InfoCliente.css"
import { Option } from "../../../components/Option/Option"
import { ClientesContext } from "../ClientesContext"

const InfoCliente: FC = () => {

    const { setShowMiniModal } = useContext(ClientesContext)

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
        <div className="infoClientes-container">
            <div className="infoClientes-header">
                <div className="infoClientes-datoscontainer">
                    <div className="infoClientes-datos" style={{fontWeight: "500"}}>
                        <img src="./Cliente2.svg" alt="" />
                        <span>Rubén González</span>
                    </div>
                    <div className="infoClientes-datos">
                        <img src="./Location-icon.svg" alt="" />
                        <span>zona norte</span>
                    </div>
                    <div className="infoClientes-datos">
                        <img src="./CasaUbi-icon.svg" alt="" />
                        <span>N° 125451215</span>
                    </div>
                    <div className="infoClientes-datos">
                        <img src="./whap-icon.svg" alt="" />
                        <span>78 25 48 96 87</span>
                    </div>
                </div>
                <div>
                    <button type="button" className="btn" onClick={() => setShowMiniModal(true)}>
                        <img src="./Opciones-icon.svg" alt=""/>
                    </button>
                </div>
            </div>
            <div className="infoClientes-body">
                <div className="infoClientes-ventasContainer">
                    <div className="infoClientes-ventas" >
                        <span>última venta</span>
                        <div className="infoClientes-ultimaventa">
                            <span>20/01/2023</span>
                        </div>
                    </div>
                    <div className="infoClientes-ventas" >
                        <span style={{color: "#1A3D7D"}}>Prestamos activos</span>
                        <div className="infoClientes-moneda">
                            <img src="./Moneda-icon.svg" alt=""/>
                            <div>
                                <span>100 Bs.</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <button type="button" className="btn" onClick={() => Opciones()}>
                        <img src="./opcion-icon.svg" alt="" />
                    </button>
                    <Option editAction={Edit} visible={showOptions} editar={true} eliminar={true} deleteAction={Delete}/>
                </div>
            </div>
            <div className="infoClientes-footer">
                <img src="./Location-azul-icon.svg" alt=""/>
                <a className="infoClientes-ubi" href="#">Ver ubicación en el mapa</a>
            </div>
        </div>
        </>
    )
}

export {InfoCliente}