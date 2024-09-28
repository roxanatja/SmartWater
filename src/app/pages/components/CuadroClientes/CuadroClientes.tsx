import "./CuadroClientes.css";
import { useEffect, useState } from "react";
import { loadClients } from "../../../../services/ClientsService";
import { Client } from "../../../../type/Cliente/Client";
import { OpcionesClientes } from "../../Contenido/Clientes/OpcionesClientes/OpcionesClientes";
import Modal from "../../EntryComponents/Modal";

const CuadroClientes = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [showMiniModal, setShowMiniModal] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await loadClients();
        if (clientsData && clientsData.data) {
          const validClients = clientsData.data
            .slice(0, 4) // Mostrar solo los primeros 4 clientes
            .map((client: Client) => ({
              ...client,
              credit:
                typeof client.credit === "number"
                  ? client.credit
                  : Number(client.credit),
            }));
          setClients(validClients);
        }
      } catch (error) {
        console.error("Error al cargar los clientes:", error);
      }
    };

    fetchClients();
  }, []);

  const handleOpcionesClick = () => {
    setShowMiniModal(!showMiniModal);
  };

  return (
    <>
      <div className="cuadroClientes">
        <div className="titulo-cliente">
          <div>
            <span className="Cliente-title">
              Clientes <span className="Cliente-title2">vista rapida</span>{" "}
            </span>
          </div>
          <div className="opciones-svg" onClick={handleOpcionesClick}>
            <img src="./Opciones-icon.svg" alt="" />

            <Modal
              isOpen={showMiniModal}
              onClose={() => {
                setShowMiniModal(false);
              }}
              className="w-3/12"
            >
              <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-white">
                Opciones Cliente
              </h2>
              <div className="p-6">
                <OpcionesClientes
                  onClose={() => {
                    setShowMiniModal(false);
                  }}
                />
              </div>
            </Modal>
          </div>
        </div>
        <div className="todos-clientes">
          {clients.map((item) => {
            return (
              <div className="cliente" key={item._id}>
                <div className="perfil-cliente">
                  <img src={item.storeImage} className="img-cliente" alt="" />
                  <div>
                    <span>{item.fullName}</span>
                  </div>
                </div>
                <div className="fecha-pago">
                  <div className="fecha-cliente">
                    <span>{new Date(item.created).toLocaleDateString()}</span>
                  </div>
                  <div className="moneda-cliente">
                    <img src="./Moneda-icon.svg" alt="" />
                    <div>
                      <span>{item.credit.toPrecision()} Bs.</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export { CuadroClientes };
