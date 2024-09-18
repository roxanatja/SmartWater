import { FC } from "react";
import "./RegistrarPedido.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";

const RegistrarPedido: FC = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/Clientes");
  };

  return (
    <>
      <div>
        <PageTitle titulo="Clientes" icon="../clientes-icon.svg" />
        <div
          className="RegistrarVenta-titulo flex items-start cursor-pointer"
          onClick={handleClick}
        >
          <button className="RegistrarVenta-btn">
            <span className="material-symbols-outlined translate-y-0.5">
              arrow_back
            </span>
          </button>
          <span>Regresar</span>
        </div>
        <RegistrarPedido />
      </div>
    </>
  );
};

export { RegistrarPedido };
