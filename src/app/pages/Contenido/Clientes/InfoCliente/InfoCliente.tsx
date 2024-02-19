import { useContext, useState } from "react"
import "./InfoCliente.css"
import { Option } from "../../../components/Option/Option"
import { ClientesContext } from "../ClientesContext"
import { Client } from "../../../../../type/Cliente/Client"

const InfoCliente = (client:Client) => {

    const { setShowMiniModal, setSelectedClient } = useContext(ClientesContext)

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

    const showMiniModal = () => {
        setShowMiniModal(true);
        setSelectedClient(client);
    }

    return(
        <>
        <div className="infoClientes-container">
            <div className="infoClientes-header">
                <div className="infoClientes-datoscontainer">
                    <div className="infoClientes-datos" style={{fontWeight: "500"}}>
                        <img src="./Cliente2.svg" alt="" />
                        <span>{client.fullName}</span>
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
                        <span>{client.phoneNumber}</span>
                    </div>
                </div>
                <div>
                    <button type="button" className="btn" onClick={showMiniModal}>
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
                <a className="infoClientes-ubi" href="https://www.google.com/maps">Ver ubicación en el mapa</a>
            </div>
        </div>
        </>
    )
}

export {InfoCliente}