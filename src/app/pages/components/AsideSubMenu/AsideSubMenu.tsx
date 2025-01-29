import { NavLink, useLocation } from "react-router-dom";
import "./AsideSubMenu.css";
import React, { useEffect, useState } from "react";
type ItemSub = {
    id: number,
    titulo: string,
    to: string,
    icon?: string,
    opciones?: Array<ItemSub>
}

type Item = {
    tituloItem: string,
    icon?: string,
    to: string,
    opciones?: Array<ItemSub>
    isInner?: boolean
}

const AsideSubMenu = ({ tituloItem, icon, opciones, to, isInner }: Item) => {
    const location = useLocation();

    const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(false);
    const [indiceActivo, setIndiceActivo] = useState<number | null>(null);

    const handleOpcionesClick = () => {
        setOpcionesVisibles(!opcionesVisibles);
    };

    useEffect(() => {
        if (location && to) {
            setOpcionesVisibles(location.pathname.includes(to))
        }

        if (opciones) {
            const idx = opciones.findIndex(opcion => {
                return location.pathname.includes(opcion.to)
            });

            setIndiceActivo(idx !== -1 ? idx : null)
        }
    }, [location, to, opciones])


    return (
        <>
            {
                !isInner ?
                    <div className={opcionesVisibles ? "backgroundSub-item active-link" : "backgroundSub-item"}>
                        <span className="biñetaSub-item"></span>
                        <div className="infoSub-item" onClick={handleOpcionesClick}>
                            <div className="infoTitle-item">
                                <img src={icon} alt="" />
                                <span className="tituloSub-item">{tituloItem}</span>
                            </div>
                            <div className="infoTitle-item">
                                <button type="button" className={opcionesVisibles ? "btn-option active-btn" : "btn-option"}>
                                    <img src="../../../Desplegable-icon.svg" alt="" />
                                </button>
                            </div>
                        </div>
                    </div> :
                    <div className={`infoSub-item cursor-pointer m-0 ${opcionesVisibles ? "active-link pl-1 rounded-md" : "hover:text-[#3C9FFF]"}`} onClick={handleOpcionesClick}>
                        <div className="infoTitle-item">
                            {icon && <img src={icon} alt="" />}
                            <span className="tituloSub-item font-[500] !text-[12px]">{tituloItem}</span>
                        </div>
                        <div className="infoTitle-item">
                            <button type="button" className={opcionesVisibles ? "btn-option active-btn" : "btn-option"}>
                                <img src="../../../Desplegable-icon.svg" alt="" />
                            </button>
                        </div>
                    </div>
            }

            {opcionesVisibles && opciones && opciones.length > 0 && (
                <div className={`opciones-container ${isInner ? "ml-[20px]" : ""}`}>
                    {opciones.map((opcion, index) => (
                        <React.Fragment key={index}>
                            {
                                opcion.opciones && opcion.opciones.length > 0 ?
                                    <AsideSubMenu
                                        tituloItem={opcion.titulo}
                                        to={opcion.to}
                                        icon={opcion.icon}
                                        opciones={opcion.opciones}
                                        isInner
                                    /> :
                                    <NavLink to={opcion.to} onClick={() => setIndiceActivo(index)}>
                                        <div className={indiceActivo === index ? "activo opcion" : "opcion"}>
                                            {opcion.icon && <img src={opcion.icon} alt="" />}
                                            <span>{opcion.titulo}</span>
                                        </div>
                                    </NavLink>
                            }
                        </React.Fragment>
                    ))}
                </div>
            )}
        </>
    )
}

export { AsideSubMenu }