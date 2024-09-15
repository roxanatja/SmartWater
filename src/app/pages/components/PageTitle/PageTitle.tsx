import "./PageTitle.css";
import React, { FC } from "react";

type TituloPages = {
  titulo: string;
  icon?: string;
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
        <div className="bg-blue_custom text-xl text-white flex items-center justify-center px-4 rounded-full relative cursor-pointer hover:bg-blue-800">
          <i className="fa-solid fa-bell"></i>
          <div className="bg-red-500 rounded-full p-2 absolute top-0 right-0" />
        </div>
      </div>
    </>
  );
};

export { PageTitle };
