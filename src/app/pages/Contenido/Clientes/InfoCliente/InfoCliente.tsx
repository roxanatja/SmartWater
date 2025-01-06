import { useContext, useEffect, useRef, useState } from "react";
import "./InfoCliente.css";
import { Option } from "../../../components/Option/Option";
import { ClientesContext } from "../ClientesContext";
import { Client } from "../../../../../type/Cliente/Client";
import { formatDateTime } from "../../../../../utils/helpers";
import CobroPopUp from "../../../components/CashRegister/CashRegister";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Modal from "../../../EntryComponents/Modal";
import { Zone } from "../../../../../type/City";
import { formatIncompletePhoneNumber } from "libphonenumber-js";
import { ClientsApiConector } from "../../../../../api/classes";

const InfoCliente = ({ client, zones }: { client: Client; zones: Zone[] }) => {
  const { setShowMiniModal, setSelectedClient } = useContext(ClientesContext);

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [zone, setZone] = useState<string>("");
  const [date, setDate] = useState<string>();
  const [showCobroPopUp, setShowCobroPopUp] = useState<boolean>(false);

  const optionsRef = useRef<HTMLDivElement>(null);
  const location = client.location;
  const navigate = useNavigate();

  const url = `https://www.google.com/maps/place/${location?.latitude || ""} ${location?.longitude || ""
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
        <div>
          <p className="mb-4 text-center text-[#888]">
            Se <b>eliminará</b> este cliente <br /> pulsa <b>Proceder</b> para continuar
          </p>
          <div className="flex justify-center">
            <button
              className="bg-red-500 px-3 py-1 rounded-lg ml-2 text-white"
              onClick={() => { toast.dismiss(t.id); }}
            >
              Cancelar
            </button>
            <button
              className="bg-blue_custom px-3 py-1 rounded-lg ml-2 text-white"
              onClick={async () => {
                toast.dismiss(t.id);
                const response = await ClientsApiConector.deleteClient({ clientId: client?._id || '' }) as any;
                if (!!response) {
                  if (response.mensaje) {
                    toast.success(response.mensaje, {
                      position: "top-center",
                      duration: 2000
                    });
                    window.location.reload();
                  } else if (response.error) {
                    toast.error(response.error, {
                      position: "top-center",
                      duration: 2000
                    });
                  }
                } else {
                  toast.error("Error al eliminar cliente", {
                    position: "top-center",
                    duration: 2000
                  });
                }
              }}
            >
              Proceder
            </button>
          </div>
        </div>
      ),
      {
        className: "shadow-md dark:shadow-slate-400 border border-slate-100 bg-main-background",
        icon: null,
        position: "top-center"
      }
    );
    setShowOptions(false);
  };

  const showMiniModal = () => {
    setShowMiniModal(true);
    setSelectedClient(client);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsRef.current &&
        !optionsRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="infoClientes-container relative bg-blocks dark:border-blocks">
        <div
          onClick={() => {
            setSelectedClient(client);
            navigate("/Clientes/Informacion");
          }}
          className="bg-transparent w-full h-full absolute top-0 left-0 rounded-xl cursor-pointer"
        ></div>
        <div className="infoClientes-header">
          <div className="flex justify-start gap-4 w-[calc(100%_-_30px)] flex-wrap">
            <div className="infoClientes-datos" style={{ fontWeight: "500" }}>
              {client.storeImage ? (
                <img
                  src={client.storeImage}
                  alt=""
                  className="infoClientes-imgStore"
                />
              ) : (
                <div className="bg-blue_custom text-white px-3.5 py-1.5 rounded-full flex justify-center items-center relative">
                  <div className="opacity-0">.</div>
                  <p className="absolute font-extrabold whitespace-nowrap">
                    {client.fullName?.[0] || "S"}
                  </p>
                </div>
              )}
              <span>{client.fullName || "Sin nombre"}</span>
            </div>
            <div className="infoClientes-datos">
              <img src="./Location-icon.svg" alt="" className="invert-0 dark:invert" />
              <span className="whitespace-nowrap">{zone}</span>
            </div>
            <div className="infoClientes-datos">
              <img src="./CasaUbi-icon.svg" alt="" className="invert-0 dark:invert" />
              <span className="whitespace-nowrap">{client.code}</span>
            </div>
            <div className="infoClientes-datos relative z-10">
              <a
                href={`https://wa.me/${client?.phoneNumber}`}
                className="btn-whatsapp flex items-center gap-1"
                target="_blank"
                rel="noreferrer"
              >
                <img src="./whap-icon.svg" alt="Icono de WhatsApp" />
                <span className="whitespace-nowrap">{formatIncompletePhoneNumber(client.phoneNumber, "BO")}</span>
              </a>
            </div>
          </div>
          <div className="absolute right-0 p-4 rounded-full z-[35] top-0 flex flex-col gap-6">
            <button type="button" className="invert-0 dark:invert" onClick={showMiniModal}>
              <img src="./Opciones-icon.svg" alt="" />
            </button>

            <div className="relative" ref={optionsRef}>
              <button type="button" className="invert-0 dark:invert" onClick={() => Opciones()}>
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
        </div>
        <div className="infoClientes-body w-[calc(100%_-_30px)]">
          <div className="infoClientes-ventasContainer">
            <div className="infoClientes-ventas">
              <span>Última venta</span>
              <div className="infoClientes-ultimaventa border-blue_custom text-blue_custom">
                <span>{date}</span>
              </div>
            </div>
            <div className="infoClientes-ventas relative z-10">
              <span className="text-blue_custom">Préstamos activos</span>
              <div
                className="infoClientes-moneda cursor-pointer bg-blue_custom"
                onClick={() => setShowCobroPopUp(true)}
              >
                <img src="./Moneda-icon.svg" alt="" />
                <div>
                  <span>{client.credit?.toString()} Bs.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a className="infoClientes-footer relative z-10" rel="noreferrer"
          target="_blank"
          href={url}>
          <img src="./Location-azul-icon.svg" alt="" />
          <span className="infoClientes-ubi text-blue_custom"
          >
            Ver ubicación en el mapa
          </span>
        </a>
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
