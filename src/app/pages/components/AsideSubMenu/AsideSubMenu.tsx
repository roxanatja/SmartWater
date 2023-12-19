import { NavLink, useLocation } from "react-router-dom";
import "./AsideSubMenu.css";
import { useState } from "react";
type ItemSub = {
    id: number,
    titulo: string,
    to: string,
    icon?: string,
}
type Item = {
    tituloItem: string,
    icon?: string,
    opciones?: Array<ItemSub>
}

const AsideSubMenu = ({ tituloItem, icon, opciones }: Item) => {

    const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(false);
    const [indiceActivo, setIndiceActivo] = useState<number | null>(null);

    const handleOpcionesClick = () => {
        setOpcionesVisibles(!opcionesVisibles);
    };

    const location = useLocation();
    const isActive = opciones?.some(opcion => location.pathname === opcion.to);

    return (
        <>
            <div className={opcionesVisibles ? "backgroundSub-item active-link" : "backgroundSub-item"}>
                <span className="biñetaSub-item"></span>
                <div className="infoSub-item">
                    <div className="infoTitle-item">
                        <img src={icon} alt="" />
                        <span className="tituloSub-item">{tituloItem}</span>
                    </div>
                    <div className="infoTitle-item">
                        <button type="button" onClick={handleOpcionesClick} className={opcionesVisibles ? "btn-option active-btn" : "btn-option"}><img src="../Desplegable-icon.svg" alt="" /></button>
                    </div>
                </div>
            </div>
            {opcionesVisibles && opciones && opciones.length > 0 && (
                <div className="opciones-container">
                    {opciones.map((opcion, index) => (
                        <NavLink key={index} to={opcion.to} onClick={() => setIndiceActivo(index)}>
                            <div className={ indiceActivo === index && isActive ? "activo opcion" : "opcion"}>
                                {opcion.icon && <img src={opcion.icon} alt="" />}
                                <span>{opcion.titulo}</span>
                            </div>
                        </NavLink>
                    ))}
                </div>
            )}
        </>
    )
}

export { AsideSubMenu }