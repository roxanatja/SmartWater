import { FC, useContext, useState } from "react";
import "./AsignarPermisos.css";
import { UsuariosContext } from "../UsuariosContext";

const AsignarPermisos: FC = () =>{

    const { setShowMiniModal } = useContext(UsuariosContext);

    const handleCloseModal = () => {
        setShowMiniModal(false);
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
                            <div className="AsignarPermisos-tituloinput">
                                <span>Zonas</span>
                                <button className="AsignarPermisos-tituloinput-btn"> 
                                    <span className="material-symbols-outlined">
                                        expand_less
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="AsignarPermisos-grupo-input">
                            <div className="AsignarPermisos-grupo-check">
                                <input
                                className="input-check"
                                type="checkbox"
                                checked={checkbox1}
                                onChange={handleCheckbox1Change}
                                />
                                <label className="AsignarPermisos-text-check">Zona 1</label>
                            </div>
                            <div className="AsignarPermisos-grupo-check">
                                <input
                                className="input-check"
                                type="checkbox"
                                checked={checkbox1}
                                onChange={handleCheckbox1Change}
                                />
                                <label className="AsignarPermisos-text-check">Zona 2</label>
                            </div>
                        </div>
                        <div className="AsignarPermisos-grupo-input">
                            <div className="AsignarPermisos-grupo-check">
                                <input
                                className="input-check"
                                type="checkbox"
                                checked={checkbox1}
                                onChange={handleCheckbox1Change}
                                />
                                <label className="AsignarPermisos-text-check">Zona 3</label>
                            </div>
                            <div className="AsignarPermisos-grupo-check">
                                <input
                                className="input-check"
                                type="checkbox"
                                checked={checkbox1}
                                onChange={handleCheckbox1Change}
                                />
                                <label className="AsignarPermisos-text-check">Zona 4</label>
                            </div>
                        </div>
                        <div className="grupo-input">
                            <div className="AsignarPermisos-tituloinput">
                                <span>Permisos</span>
                                <button className="AsignarPermisos-tituloinput-btn"> 
                                    <span className="material-symbols-outlined">
                                        expand_less
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="AsignarPermisos-grupo-input">
                            <div className="AsignarPermisos-grupo-check">
                                <input
                                className="input-check"
                                type="checkbox"
                                checked={checkbox1}
                                onChange={handleCheckbox1Change}
                                />
                                <label className="AsignarPermisos-text-check">Registrar clientes</label>
                            </div>
                            <div className="AsignarPermisos-grupo-check">
                                <input
                                className="input-check"
                                type="checkbox"
                                checked={checkbox1}
                                onChange={handleCheckbox1Change}
                                />
                                <label className="AsignarPermisos-text-check">Eliminar clientes</label>
                            </div>
                        </div>
                        <div className="AsignarPermisos-grupo-input">
                            <div className="AsignarPermisos-grupo-check">
                                <input
                                className="input-check"
                                type="checkbox"
                                checked={checkbox1}
                                onChange={handleCheckbox1Change}
                                />
                                <label className="AsignarPermisos-text-check">Editar clientes</label>
                            </div>
                            <div className="AsignarPermisos-grupo-check">
                                <input
                                className="input-check"
                                type="checkbox"
                                checked={checkbox1}
                                onChange={handleCheckbox1Change}
                                />
                                <label className="AsignarPermisos-text-check">Registrar ventas</label>
                            </div>
                        </div>
                        <div className="AsignarPermisos-grupo-input">
                            <div className="AsignarPermisos-grupo-check">
                                <input
                                className="input-check"
                                type="checkbox"
                                checked={checkbox1}
                                onChange={handleCheckbox1Change}
                                />
                                <label className="AsignarPermisos-text-check">Editar ventas</label>
                            </div>
                            <div className="AsignarPermisos-grupo-check">
                                <input
                                className="input-check"
                                type="checkbox"
                                checked={checkbox1}
                                onChange={handleCheckbox1Change}
                                />
                                <label className="AsignarPermisos-text-check">Eliminar ventas</label>
                            </div>
                        </div>
                        <div className="AsignarPermisos-grupo-input">
                            <div className="AsignarPermisos-grupo-check">
                                <input
                                className="input-check"
                                type="checkbox"
                                checked={checkbox1}
                                onChange={handleCheckbox1Change}
                                />
                                <label className="AsignarPermisos-text-check">Editar préstamos</label>
                            </div>
                            <div className="AsignarPermisos-grupo-check">
                                <input
                                className="input-check"
                                type="checkbox"
                                checked={checkbox1}
                                onChange={handleCheckbox1Change}
                                />
                                <label className="AsignarPermisos-text-check">Registrar pedidos</label>
                            </div>
                        </div>
                        <div className="AsignarPermisos-grupo-input">
                            <div className="AsignarPermisos-grupo-check">
                                <input
                                className="input-check"
                                type="checkbox"
                                checked={checkbox1}
                                onChange={handleCheckbox1Change}
                                />
                                <label className="AsignarPermisos-text-check">Cancelar pedidos</label>
                            </div>
                            <div className="AsignarPermisos-grupo-check">
                                <input
                                className="input-check"
                                type="checkbox"
                                checked={checkbox1}
                                onChange={handleCheckbox1Change}
                                />
                                <label className="AsignarPermisos-text-check">Eliminar pedidos</label>
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

export{AsignarPermisos}