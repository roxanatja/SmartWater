import { FC, useContext, useEffect, useState } from "react";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { useNavigate } from "react-router-dom";

import InfoClient from "../../../EntryComponents/InfoClient";
import { PrestamosProvider } from "../../Préstamos/PrestamosContext";
import { useSessionStorage } from "@uidotdev/usehooks";
import Modal from "../../../EntryComponents/Modal";
import ClientForm from "../../../EntryComponents/Client.form";
import { MonitoreoDistribuidoresContext } from "../MonitoreoDistribuidoresContext";

const ClientInfo: FC = () => {
  const { selectedClient, allClients, zones } = useContext(MonitoreoDistribuidoresContext);

  const navigate = useNavigate();
  const [returnUrl, setReturnUrl] = useSessionStorage("returnUrl", "")
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);

  const handleClick = () => {
    navigate(-1)
  };

  useEffect(() => {
    if (selectedClient._id === "") {
      console.log(returnUrl)
      if (returnUrl) {
        navigate(returnUrl)
        setReturnUrl("")
      } else {
        navigate(-1)
      }
    }
  }, [selectedClient, navigate])

  return (
    <>
      <div className="px-10 h-screen overflow-y-auto">
        <PageTitle titulo="Información Cliente" icon="../clientes-icon.svg" />
        <div className="flex justify-between items-center gap-8">
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

          <button type="button" className="w-[200px] outline bg-blue_bright py-2 rounded-full text-white font-black shadow-xl truncate flex items-center gap-4 justify-center" onClick={() => { setShowRegisterModal(true) }}>
            <i className="fa-solid fa-pen-to-square"></i>
            <span>Editar</span>
          </button>
        </div>

        <PrestamosProvider>
          <InfoClient client={selectedClient} />
        </PrestamosProvider>
      </div>

      <Modal
        isOpen={showRegisterModal && !!selectedClient._id}
        onClose={() => {
          setShowRegisterModal(false);
        }}
        className="w-3/12"
      >
        <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-main-background">
          Registrar Cliente
        </h2>
        <div className="p-6">
          <ClientForm onCancel={() => {
            setShowRegisterModal(false);
          }}
            allClients={allClients}
            isOpen={showRegisterModal && !!selectedClient._id}
            zones={zones}
            selectedClient={selectedClient}
          />
        </div>
      </Modal >
    </>
  );
};

export default ClientInfo;
