import NotificationsDropdown from "../Notificaciones/NotificationsDropdown";
import "./PageTitle.css";
import React, { FC } from "react";

type TituloPages = {
  titulo: string;
  icon?: string;
};

const PageTitle: FC<TituloPages> = ({ titulo, icon }) => {
  return (
    <>
      <div className="Pages sticky top-0 z-[100] py-5">
        <div className="Title-Pages">
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
