import "./CuadroClientes.css";
import { useEffect, useState } from "react";
import { Client } from "../../../../type/Cliente/Client";
import { ClientsApiConector } from "../../../../api/classes";
import { formatDateTime } from "../../../../utils/helpers";

const CuadroClientes = () => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await ClientsApiConector.getClients({ pagination: { page: 1, pageSize: 4 } });

        if (clientsData && clientsData.data) {
          const validClients = clientsData.data
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

  return (
    <>
      <div className="cuadroClientes !bg-blocks dark:!border-blocks">
        <div className="titulo-cliente">
          <div>
            <span className="Cliente-title">
              Clientes <span className="Cliente-title2">vista rapida</span>{" "}
            </span>
          </div>
        </div>
        <div className="todos-clientes w-full">
          {clients.map((item) => {
            return (
              <div className="grid grid-cols-4 w-full" key={item._id}>
                <div className="perfil-cliente flex-1 col-span-2 overflow-hidden">
                  {
                    item.clientImage ?
                      <img src={item.clientImage || 'clientes-icon-blue.svg'} className="img-cliente" alt="Cliente" /> :
                      (
                        <div className="bg-blue_custom text-white relative px-3.5 py-1.5 rounded-full flex justify-center items-center">
                          <div className="opacity-0">.</div>
                          <p className="absolute font-extrabold ">
                            {item.fullName?.[0] || "S"}
                          </p>
                        </div>
                      )
                  }
                  <div>
                    <span>{(!item.fullName || item.fullName.trim() === "") ? "Sin nombre" : item.fullName}</span>
                  </div>
                </div>
                <div className="fecha-cliente border-blue_custom text-blue_custom">
                  <span>{formatDateTime(item.created, 'numeric', '2-digit', '2-digit', false, true)}</span>
                </div>
                <div className="moneda-cliente bg-blue_custom w-full">
                  <img src="./Moneda-icon.svg" alt="" />
                  <div>
                    <span>{item.credit.toPrecision()} Bs.</span>
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
