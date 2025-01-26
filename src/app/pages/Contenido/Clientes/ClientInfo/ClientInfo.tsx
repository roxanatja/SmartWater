import { FC, useContext, useEffect } from "react";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";

import { ClientesContext, client } from "../ClientesContext";
import InfoClient from "../../../EntryComponents/InfoClient";
import { PrestamosProvider } from "../../Préstamos/PrestamosContext";

const ClientInfo: FC = () => {
  const { setSelectedClient, selectedClient } = useContext(ClientesContext);
  const navigate = useNavigate();

  const handleClick = () => {
    setSelectedClient(client);
  };

  useEffect(() => {
    if (selectedClient._id === "") {
      navigate(-1)
    }
  }, [selectedClient, navigate])

  return (
    <>
      <div className="px-10 h-screen overflow-y-auto">
        <PageTitle titulo="Información Cliente" icon="../clientes-icon.svg" />
        <div
          className="RegistrarVenta-titulo flex items-start cursor-pointer text-blue_custom"
          onClick={handleClick}
        >
          <button className="RegistrarVenta-btn">
            <span className="material-symbols-outlined translate-y-0.5 text-blue_custom">
              arrow_back
            </span>
          </button>
          <span>Regresar</span>
        </div>
        <PrestamosProvider>
          <InfoClient client={selectedClient} />
        </PrestamosProvider>
      </div>
    </>
  );
};

export default ClientInfo;
