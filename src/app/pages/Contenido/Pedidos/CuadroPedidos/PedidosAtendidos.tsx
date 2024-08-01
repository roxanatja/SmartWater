import { FC, useContext, useEffect, useState } from "react";
import "./PedidosAtendidos.css";
import { loadClients } from "../../../../../services/ClientsService";
import { GetProducts } from "../../../../../services/ProductsService";
import { loadOrders } from "../../../../../services/OrdersService";
import { GetZone } from "../../../../../services/ZonesService";
import { PedidosContext } from "../PedidosContext";

interface Order {
  // Define los campos de tu orden aquí según la respuesta de la API
  id: string;
  clientName: string;
  phone: string;
  zone: string;
  address: string;
  bottleCount: number;
  scheduledDelivery: string;
  attentionDate: string;
  note: string;
  locationUrl: string;
}

const PedidosAtendidos: FC = () => {
  const [clients, setClients] = useState<any[]>([]); // Estado para almacenar los clientes
  const [products, setProducts] = useState<any[]>([]); // Estado para almacenar los productos
  const [orders, setOrders] = useState<any[]>([]); // Estado para almacenar las órdenes
  const [zones, setZones] = useState<any[]>([]);
  const { setShowMiniModal } = useContext(PedidosContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsData = await loadClients();
        const productsData = await GetProducts();
        const ordersData = await loadOrders({ attended: true });
        const zonesData = await GetZone();

        console.log("Orders Data:", ordersData);
        console.log("Clients Data:", clientsData);
        console.log("Products Data:", productsData);
        console.log("Zones Data:", zonesData);

        setClients(clientsData.data);
        setProducts(productsData.data);
        setOrders(ordersData.data);
        setZones(zonesData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      {orders.map((order, index) => {
        const client = clients.find((client) => client.user == order.user);
        const zone = zones.find((zone) => zone._id === client?.zone);
        if (!client) {
          console.warn(`No se encontró el cliente con el ID: ${order.user}`);
          return null; // O maneja esto de otra manera, como mostrar un mensaje de error
        }

        return (
          <div
            key={index}
            className="PedidosCurso-container"
            style={{ gap: "14px" }}
          >
            {/* Datos del cliente */}
            <div className="PedidosCurso-datoscontainer">
              <div className="PedidosCurso-datos">
                {client &&
                  client.storeImage && ( // Verifica si client.storeImage existe
                    <>
                      <img
                        src={client.storeImage}
                        alt=""
                        className="PedidosCurso-profileImage"
                      />

                      {/* Muestra la imagen del cliente */}
                      <span>{client.fullName}</span>
                    </>
                  )}
              </div>
              <div className="PedidosCurso-datos">
                <a
                  href={`https://api.whatsapp.com/send?phone=${client?.phoneNumber}`}
                  className="btn-whatsapp"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="./whap-icon.svg" alt="Icono de WhatsApp" />
                </a>
                <span>{client?.phoneNumber}</span>
              </div>
              <div className="PedidosCurso-datos">
                <img src="./Location-icon.svg" alt="" />
                <span>{zone?.name}</span>
              </div>
              <div className="PedidosCurso-datos">
                <img src="./CasaUbi-icon.svg" alt="" />
                <span>N° {client.code}</span>
              </div>
              <div className="PedidosCurso-datos">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowMiniModal(true)}
                >
                  <img src="./Opciones-icon.svg" alt="" />
                </button>
              </div>
            </div>

            {/* Productos del pedido */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {order.detail.map((item: any, idx: number) => (
                <div key={idx}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <img
                      src={
                        products.find((product) => product._id === item.product)
                          ?.imageUrl
                      }
                      alt=""
                      className="Pedidos-img"
                    />
                    <div
                      className="CuadroVentaCliente-TextContainer"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <span
                        className="CuadroVentaCliente-text"
                        style={{ fontWeight: "600" }}
                      >
                        {item.quantity} {/* Mostrar la cantidad de la orden */}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Información de entrega y ubicación */}
              <div className="PedidosCurso-infoEntregaContainer">
                <div className="PedidosCurso-infoEntrega">
                  <span>Entrega programada</span>
                  <span style={{ color: "#1A3D7D" }}>
                    {new Date(order.deliverDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="PedidosCurso-infoUbi">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M9.99935 9.58366C9.44682 9.58366 8.91691 9.36417 8.52621 8.97346C8.13551 8.58276 7.91602 8.05286 7.91602 7.50033C7.91602 6.94779 8.13551 6.41789 8.52621 6.02719C8.91691 5.63649 9.44682 5.41699 9.99935 5.41699C10.5519 5.41699 11.0818 5.63649 11.4725 6.02719C11.8632 6.41789 12.0827 6.94779 12.0827 7.50033C12.0827 7.77391 12.0288 8.04482 11.9241 8.29758C11.8194 8.55034 11.6659 8.78001 11.4725 8.97346C11.279 9.16692 11.0494 9.32038 10.7966 9.42507C10.5438 9.52977 10.2729 9.58366 9.99935 9.58366ZM9.99935 1.66699C8.45225 1.66699 6.96852 2.28157 5.87456 3.37554C4.7806 4.4695 4.16602 5.95323 4.16602 7.50033C4.16602 11.8753 9.99935 18.3337 9.99935 18.3337C9.99935 18.3337 15.8327 11.8753 15.8327 7.50033C15.8327 5.95323 15.2181 4.4695 14.1241 3.37554C13.0302 2.28157 11.5464 1.66699 9.99935 1.66699Z"
                      fill="#367DFD"
                    />
                  </svg>
                  <a
                    href={`https://www.google.com/maps?q=${client?.location.latitude},${client?.location.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="PedidosCurso-infoUbicacion"
                  >
                    Ver ubicación en el mapa
                  </a>
                </div>
              </div>
            </div>

            {/* Información adicional del pedido */}
            <div className="PedidosCurso-Nota">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <g clipPath="url(#clip0_14_2925)">
                  <path
                    d="M2.5 0C1.11929 0 0 1.11929 0 2.5V17.5C0 18.8807 1.11929 20 2.5 20H17.5C18.8807 20 20 18.8807 20 17.5V7.5C20 6.84375 19.5938 6.40625 18.9375 6.1875L14.6875 4.6875C14.2188 4.53125 14 4.09375 14 3.75V2.5C14 1.11929 12.8807 0 11.5 0H2.5ZM18.5938 17.8125C18.5938 18.0563 18.3438 18.25 18.0625 18.25H1.875C1.61875 18.25 1.40625 18.0313 1.40625 17.8125V2.1875C1.40625 1.93125 1.61875 1.71875 1.875 1.71875H11.875V3.125C11.875 4.78125 13.1563 6.09375 14.6875 6.09375C15.3125 6.09375 15.8438 5.84375 16.2812 5.40625L18.5938 7.71875V17.8125ZM16.875 16.25H13.75V13.125C13.75 12.6438 13.4062 12.2812 12.9375 12.125C12.5312 12 11.9688 12.3125 11.9062 12.75L11.875 12.875V16.25H8.75V8.75H11.0938C11.3438 8.75 11.5625 8.53125 11.5625 8.28125V8.1875C11.5625 7.9375 11.3438 7.71875 11.0938 7.71875H8.75V5.3125C8.75 4.59375 9.34375 4 10.0625 4C10.7812 4 11.375 4.59375 11.375 5.3125V6.09375C11.375 6.34375 11.5938 6.5625 11.8438 6.5625H16.875C17.125 6.5625 17.3438 6.78125 17.3438 7.03125V16.2188L16.9062 16.25H16.875Z"
                    fill="#1A3D7D"
                  />
                  <path
                    d="M14.3125 9.8125H5.625C5.375 9.8125 5.15625 9.59375 5.15625 9.34375V8.75C5.15625 8.5 5.375 8.28125 5.625 8.28125H14.3125C14.5625 8.28125 14.7812 8.5 14.7812 8.75V9.34375C14.7812 9.59375 14.5625 9.8125 14.3125 9.8125Z"
                    fill="#1A3D7D"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_14_2925">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span>{order.comment}</span> {/* Comentario del pedido */}
            </div>
          </div>
        );
      })}
    </>
  );
};
export { PedidosAtendidos };
