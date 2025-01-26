import { NavLink, useLocation } from "react-router-dom";
import "./AsideItem.css";

type Item = {
    tituloItem: string,
    to: string,
    icon: string,
    iconDesplegable?: string
    notificacion?: string
}

const AsideItem = ({ tituloItem, to, icon, iconDesplegable, notificacion }: Item) => {
    const location = useLocation();
    const isActive = location.pathname.includes(to);

    return (
        <>
            <NavLink to={to}>
                <div className={isActive ? "background-item active-link" : "background-item"}>
                    <span className="biñeta-item"></span>
                    <div className="info-item">
                        <img src={icon} alt="" />
                        <span className="titulo-item">{tituloItem}</span>
                        {
                            notificacion !== undefined ?
                                <div className="notificacion-item">
                                    <span>{notificacion}</span>
                                </div>
                                :
                                null
                        }
                    </div>
                </div>
            </NavLink>
        </>
    )
}

export { AsideItem }