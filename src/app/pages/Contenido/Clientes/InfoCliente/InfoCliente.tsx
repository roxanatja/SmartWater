import { useContext, useEffect, useState } from "react";
import "./InfoCliente.css";
import { Option } from "../../../components/Option/Option";
import { ClientesContext } from "../ClientesContext";
import { Client } from "../../../../../type/Cliente/Client";
import { formatDateTime } from "../../../../../utils/helpers";
import { DeleteClient } from "../../../../../services/ClientsService";
import CobroPopUp from "../../../components/CashRegister/CashRegister";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Modal from "../../../EntryComponents/Modal";
import { Zone } from "../../../../../Class/types.data";

const InfoCliente = ({ client, zones }: { client: Client; zones: Zone[] }) => {
  const { setShowMiniModal, setSelectedClient } = useContext(ClientesContext);

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [zone, setZone] = useState<string>("");
  const [date, setDate] = useState<string>();
  const [showCobroPopUp, setShowCobroPopUp] = useState<boolean>(false);
  const location = client.location;
  const navigate = useNavigate();

  const url = `https://www.google.com/maps/place/${location?.latitude || ""} ${
    location?.longitude || ""
  }`;

  useEffect(() => {
    setZone(zones.find((x) => x._id === client.zone)?.name || "");
  }, [client.zone, zones]);

  useEffect(() => {
    var date = formatDateTime(client.lastSale, "numeric", "numeric", "numeric");
    if (date === "Invalid Date") {
      date = "Sin ventas";
    }

    setDate(date);
  }, [client.lastSale, client.zone]);

  const Opciones = () => {
    setShowOptions(!showOptions);
  };

  const Edit = () => {
    setSelectedClient(client);
    setShowOptions(false);
  };

  const Delete = async () => {
    toast.error(
      (t) => (
        <span>
          Se <b>eliminara</b> este cliente <br /> <b>pulsa</b> para continuar
          <button
            className="bg-red-500 px-2 py-1 rounded-lg ml-2"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const response = await DeleteClient(client._id);
                if (response.status === 200) {
                  toast.success("Cliente eliminado", {
                    position: "top-center",
                  });
                  window.location.reload();
                } else {
                  toast.error("Error al eliminar cliente", {
                    position: "top-center",
                  });
                  toast.error(response.data.error, {
                    position: "top-center",
                  });
                  console.log("Error al eliminar cliente", response.data);
                }
              } catch (error) {
                console.error(error);
              }
            }}
          >
            <i className="fa-solid fa-xmark text-white"></i>
          </button>
        </span>
      ),
      {
        position: "top-center",
      }
    );
    setShowOptions(false);
  };

  const showMiniModal = () => {
    setShowMiniModal(true);
    setSelectedClient(client);
  };

  return (
    <>
      <div className="infoClientes-container relative">
        <div
          onClick={() => {
            setSelectedClient(client);
            navigate("/Clientes/Informacion");
          }}
          className="bg-transparent w-full h-full absolute top-0 left-0 rounded-xl cursor-pointer"
        ></div>
        <div className="infoClientes-header">
          <div className="flex justify-between w-8/12 max-sm:w-full">
            <div className="infoClientes-datos" style={{ fontWeight: "500" }}>
              {client.storeImage ? (
                <img
                  src={client.storeImage}
                  alt=""
                  className="infoClientes-imgStore"
                />
              ) : (
                <div className="bg-blue_custom text-white px-3.5 py-1.5 rounded-full flex justify-center items-center">
                  <div className="opacity-0">.</div>
                  <p className="absolute font-extrabold ">
                    {client.fullName[0]}
                  </p>
                </div>
              )}
              <span>{client.fullName}</span>
            </div>
            <div className="infoClientes-datos">
              <img src="./Location-icon.svg" alt="" />
              <span>{zone}</span>
            </div>
            <div className="infoClientes-datos">
              <img src="./CasaUbi-icon.svg" alt="" />
              <span>{client.code}</span>
            </div>
            <div className="infoClientes-datos relative z-10">
              <a
                href={`https://api.whatsapp.com/send?phone=${client?.phoneNumber}`}
                className="btn-whatsapp"
                target="_blank"
                rel="noreferrer"
              >
                <img src="./whap-icon.svg" alt="Icono de WhatsApp" />
              </a>
              <span>{client.phoneNumber}</span>
            </div>
          </div>
          <div className="absolute right-0 p-4 rounded-full z-10">
            <button type="button" className="btn" onClick={showMiniModal}>
              <img src="./Opciones-icon.svg" alt="" />
            </button>
          </div>
        </div>
        <div className="infoClientes-body">
          <div className="infoClientes-ventasContainer">
            <div className="infoClientes-ventas">
              <span>última venta</span>
              <div className="infoClientes-ultimaventa">
                <span>{date}</span>
              </div>
            </div>
            <div className="infoClientes-ventas relative z-10">
              {client.hasLoan && (
                <span style={{ color: "#1A3D7D" }}>Prestamos activos</span>
              )}
              <div
                className="infoClientes-moneda cursor-pointer"
                onClick={() => setShowCobroPopUp(true)}
              >
                <img src="./Moneda-icon.svg" alt="" />
                <div>
                  <span>{client.credit.toString()} Bs.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <button type="button" className="btn" onClick={() => Opciones()}>
              <img src="./opcion-icon.svg" alt="" />
            </button>
            <Option
              editAction={Edit}
              visible={showOptions}
              editar={true}
              eliminar={true}
              deleteAction={Delete}
            />
          </div>
        </div>
        <div className="infoClientes-footer relative z-10">
          <img src="./Location-azul-icon.svg" alt="" />
          <a
            className="infoClientes-ubi"
            rel="noreferrer"
            target="_blank"
            href={url}
          >
            Ver ubicación en el mapa
          </a>
        </div>
      </div>

      <Modal
        isOpen={showCobroPopUp}
        onClose={() => setShowCobroPopUp(false)}
        className="p-6 w-2/12"
      >
        <CobroPopUp client={client} onClose={() => setShowCobroPopUp(false)} />
      </Modal>
    </>
  );
};

export { InfoCliente };
