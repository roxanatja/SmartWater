import "./PageTitle.css";
import React, { FC } from 'react';

type TituloPages = {
    titulo: string,
    icon?: string
};

const PageTitle: FC<TituloPages> = ({ titulo, icon }) => {

    return (
        <>
            <div className="Pages">
                <div className="Title-Pages">
                    <img src={icon} alt="" />
                    <div>
                        <span>{titulo}</span>
                    </div>
                </div>
                <div>
                    <img src="./Notificacion-icon.svg" alt="" />
                </div>
            </div>
        </>
    )
}

export { PageTitle }
