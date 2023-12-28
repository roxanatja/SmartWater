import { FC, useContext, useState } from "react";
import "./AddUsuario.css";
import { UsuariosContext } from "../UsuariosContext";

const AddUsuario: FC = () => {

    const { setShowModal } = useContext(UsuariosContext);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const [checkbox1, setCheckbox1] = useState<boolean>(false);
    
    const handleCheckbox1Change = () => {
        setCheckbox1(!checkbox1);
    };

return (
    <>
        <form onSubmit={(e) => e.preventDefault()}>
            <div className="modal-overlay">
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header" style={{height: "auto"}}>
                        <div className="Titulo-Modal">
                            <div>
                                <span>Registro de usuario</span>
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
                                <label className="label-grup">Nombre completo</label>
                                <input type="text" className="input-text" style={{textAlign: "left"}}/>
                            </div>
                        </div>
                        <div className="grupo-input" style={{gap: "16px"}}>
                            <div className="input-grup">
                                <label className="label-grup">Identidad</label>
                                <input type="text" className="input-text" style={{textAlign: "left"}}/>
                            </div>
                            <div className="input-grup">
                                <label className="label-grup">Correo electronico</label>
                                <input type="text" className="input-text" style={{textAlign: "left"}}/>
                            </div>
                        </div>
                        <div className="grupo-input" style={{gap: "20px"}}>
                            <div className="input-grup">
                                <label className="label-grup">Telefono</label>
                                <select name="Proveedor" className="input-select">
                                    <option value="93456979667">93456979667</option>
                                    <option value="93456979667">93456979667</option>
                                </select>
                            </div>
                            <div className="input-grup">
                                <label className="label-grup">Contraseña</label>
                                <input type="password" className="input-text" style={{textAlign: "left"}}/>
                            </div>
                        </div>
                        <div className="grupo-input">
                            <div className="input-grup">
                                <label className="label-grup">Cargo</label>
                                <select name="Proveedor" className="input-select">
                                    <option value="Administrador">Administrador</option>
                                    <option value="Cliente">Cliente</option>
                                </select>
                            </div>
                        </div>
                        <div className="grupo-checbox" style={{justifyContent: "right"}}>
                            <div className="grupo-check">
                                <label className="text-check">Estado</label>
                                <label className="switch-container">
                                    <input type="checkbox" checked={checkbox1} onChange={handleCheckbox1Change} />
                                    <span className="slider"></span>
                                </label>
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

export{AddUsuario}