import NotificationsDropdown from "../Notificaciones/NotificationsDropdown";
import "./PageTitle.css";
import React, { FC } from "react";

type TituloPages = {
  titulo: string;
  icon?: string;
  hasBack?: boolean;
  onBack?: () => void
};

const PageTitle: FC<TituloPages> = ({ titulo, icon, hasBack, onBack }) => {
  return (
    <>
      <div className="Pages sticky top-0 z-[49] py-5">
        <div className="Title-Pages">

          {
            (hasBack && onBack) &&
            <button className="RegistrarVenta-btn" onClick={onBack}>
              <span className="material-symbols-outlined translate-y-0.5 text-font-color">
                arrow_back
              </span>
            </button>
          }

          <img src={icon} alt="" className="invert dark:invert-0" />
          <div>
            <span>{titulo}</span>
          </div>
        </div>
        <NotificationsDropdown />
      </div>
    </>
  );
};

export { PageTitle };
