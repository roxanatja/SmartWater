import { FC, useContext } from "react";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";

import { ClientesContext, client } from "../ClientesContext";
import InfoClient from "../../../EntryComponents/InfoClient";
import { Client } from "../../../../../Class/types.data";

const ClientInfo: FC = () => {
  const { setSelectedClient, selectedClient } = useContext(ClientesContext);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/Clientes");
    setSelectedClient(client);
  };

  return (
    <>
      <div>
        <PageTitle titulo="Informacion Cliente" icon="../clientes-icon.svg" />
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
        <InfoClient client={selectedClient as unknown as Client} />
      </div>
    </>
  );
};

export default ClientInfo;
