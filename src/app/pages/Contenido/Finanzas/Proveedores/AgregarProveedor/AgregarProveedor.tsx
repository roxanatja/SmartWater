import { FC, useContext } from "react";
import "./AgregarProveedor.css";
import { SmartwaterContext } from "../../../../../SmartwaterContext";

const AgregarProveedor: FC = () => {

    const { setShowModal } = useContext(SmartwaterContext);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return(
        <>
        <form>
            <div className="modal-overlay">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header" style={{height: "auto"}}>
                        <div className="Titulo-Modal">
                            <div>
                                <span>Registro de proveedor</span>
                            </div>
                            <div>
                                <button type="button" className="btn" onClick={handleCloseModal}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="25" viewBox="0 0 21 25" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M16.4034 6.91L15.186 5.5L10.3599 11.09L5.53374 5.5L4.31641 6.91L9.14256 12.5L4.31641 18.09L5.53374 19.5L10.3599 13.91L15.186 19.5L16.4034 18.09L11.5772 12.5L16.4034 6.91Z" fill="black" fill-opacity="0.87"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="grupo-input">
                            <div className="input-grup">
                                <label className="label-grup">Nombre</label>
                                <input type="text" className="input-text" style={{textAlign: "left"}}/>
                            </div>
                        </div>
                        <div className="grupo-input">
                            <div className="input-grup">
                                <label className="label-grup">Correo</label>
                                <input type="text" className="input-text" style={{textAlign: "left"}}/>
                            </div>
                        </div>
                        <div className="grupo-input">
                            <div className="input-grup">
                                <label className="label-grup">Dirección</label>
                                <input type="text" className="input-text" style={{textAlign: "left"}}/>
                            </div>
                        </div>
                        <div className="grupo-input">
                            <div className="input-grup">
                                <label className="label-grup">Nit</label>
                                <input type="text" className="input-text" style={{textAlign: "left"}}/>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn-cancelar" onClick={handleCloseModal}>Cancelar</button>
                        <button type="button" className="btn-registrar">Registrar</button>
                    </div>
                </div>
            </div>
        </form>
        </>
    )
}

export{AgregarProveedor}