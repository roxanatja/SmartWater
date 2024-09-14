import { useContext, useEffect, useState } from "react";
import "./InfoCliente.css";
import { Option } from "../../../components/Option/Option";
import { ClientesContext } from "../ClientesContext";
import { Client } from "../../../../../type/Cliente/Client";
import { formatDateTime } from "../../../../../utils/helpers";
import { DeleteClient } from "../../../../../services/ClientsService";
import { GetZone } from "../../../../../services/ZonesService";
import CobroPopUp from "../../../components/CashRegister/CashRegister";

const InfoCliente = (client: Client) => {
  const { setShowMiniModal, setSelectedClient } = useContext(ClientesContext);

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [zone, setZone] = useState<string>("");
  const [date, setDate] = useState<string>();
  const [showCobroPopUp, setShowCobroPopUp] = useState<boolean>(false); // Agregado el estado para el Pop-Up
  const location = client.location;
  const url = `https://www.google.com/maps/place/${location?.latitude || ""} ${
    location?.longitude || ""
  }`;

  useEffect(() => {
    const getZone = async () => {
      try {
        const response = await GetZone();

        response.data.forEach((element: any) => {
          if (element._id === client.zone) {
            setZone(element.name);
          }
        });
      } catch (error) {
        console.error(error);
      }
    };

    getZone();

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
    try {
      const response = await DeleteClient(client._id);
      console.log(response);
      if (response.status === 200) {
        console.log("Cliente eliminado", response);
        window.alert(`Cliente eliminado`);
        window.location.reload();
      } else {
        console.log("Error al eliminar cliente", response.data);
        window.alert(`Error al eliminar cliente: ${response.data.error}`);
      }
    } catch (error) {
      console.error(error);
    }
    setShowOptions(false);
  };

  const showMiniModal = () => {
    setShowMiniModal(true);
    setSelectedClient(client);
  };

  return (
    <>
      <div className="infoClientes-container">
        <div className="infoClientes-header">
          <div className="infoClientes-datoscontainer">
            <div className="infoClientes-datos" style={{ fontWeight: "500" }}>
              {client.storeImage && client.storeImage.length > 1 ? (
                <img
                  src={client.storeImage}
                  alt=""
                  className="infoClientes-imgStore"
                />
              ) : (
                <img src="" alt="" />
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
            <div className="infoClientes-datos">
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
          <div>
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
            <div className="infoClientes-ventas">
              <span style={{ color: "#1A3D7D" }}>Prestamos activos</span>
              <div className="infoClientes-moneda">
                <img src="./Moneda-icon.svg" alt="" />
                <div>
                  <span
                    onClick={() => setShowCobroPopUp(true)}
                    style={{ cursor: "pointer" }}
                  >
                    {client.credit.toString()} Bs.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
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
        <div className="infoClientes-footer">
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

      {showCobroPopUp && (
        <CobroPopUp client={client} onClose={() => setShowCobroPopUp(false)} />
      )}
    </>
  );
};

export { InfoCliente };
