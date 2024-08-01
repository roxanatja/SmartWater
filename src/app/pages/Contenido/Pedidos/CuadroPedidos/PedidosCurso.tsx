import { FC, useContext, useState, useEffect } from "react";
import "./PedidosCurso.css";
import { PedidosContext } from "../PedidosContext";
import { Option } from "../../../components/Option/Option";
import { loadOrders } from "../../../../../services/OrdersService";
import { loadClients } from "../../../../../services/ClientsService";
import { GetProducts } from "../../../../../services/ProductsService";
import { GetZone } from "../../../../../services/ZonesService";

const PedidosCurso: FC = () => {
  const { setShowMiniModal } = useContext(PedidosContext);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [clients, setClients] = useState<any[]>([]); // Estado para almacenar los clientes
  const [products, setProducts] = useState<any[]>([]); // Estado para almacenar los productos
  const [orders, setOrders] = useState<any[]>([]); // Estado para almacenar las órdenes
  const [zones, setZones] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsData = await loadClients();
        const productsData = await GetProducts();
        const ordersData = await loadOrders({ attended: false }); // Pasar parámetros si es necesario
        const zonesData = await GetZone();

        console.log("Original Orders Data:", ordersData);

        // Obtener la fecha actual
        const today = new Date();

        // Filtrar los pedidos con fecha de entrega a partir de la fecha actual
        const filteredOrders = ordersData.data.filter(
          (order: any) => new Date(order.deliverDate) >= today
        );

        console.log("Filtered Orders Data:", filteredOrders);
        console.log("Clients Data:", clientsData);
        console.log("Products Data:", productsData);
        console.log("Zones Data:", zonesData);

        setClients(clientsData.data);
        setProducts(productsData.data);
        setOrders(filteredOrders);
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
        const client = clients.find((client) => client.user === order.user);
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
                {client && client.storeImage && (
                  <>
                    <img
                      src={client.storeImage}
                      alt=""
                      className="PedidosCurso-profileImage"
                    />
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
                        {item.quantity}
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
                    {new Date(order.deliverDate).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
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
                    d="M2.5 0C1.11929 0 0 1.11929 0 2.5V17.5C0 18.8807 1.11929 20 2.5 20H17.5C18.8807 20 20 18.8807 20 17.5V2.5C20 1.11929 18.8807 0 17.5 0H2.5ZM2.5 1.66667H17.5C18.1568 1.66667 18.8055 1.82442 19.366 2.14814L4.11155 17.4026C3.78549 17.0593 3.55604 16.6741 3.36914 16.2586C2.74112 16.0558 2.25 15.3408 2.25 14.5V2.5C2.25 1.82765 2.42786 1.17467 2.75943 0.595145C2.07757 1.07167 1.66885 1.70242 1.66885 2.5V2.5C1.66885 2.67355 1.74853 2.84715 1.80957 3.02759C1.67474 3.31588 1.5 3.63748 1.5 4V13.5C1.5 14.1811 1.87053 14.8122 2.53617 15.0975C2.64614 14.4442 2.92493 13.8618 3.38632 13.4163L18.6468 2.22428C18.8397 2.44509 19.0714 2.70718 19.3333 2.94463V14.5C19.3333 15.6586 18.6828 16.6667 17.5 16.6667H4.40706C4.19066 17.0532 3.97929 17.4308 3.78817 17.7876L17.5505 3.44684C17.4919 3.3915 17.4494 3.3393 17.4086 3.29189C17.2638 3.05909 17.1383 2.79815 17.0464 2.50868C17.0747 2.42924 17.0627 2.34734 17.0627 2.25V2.5C17.0627 2.2177 17.0532 1.94054 17.0145 1.66667H2.5ZM15.5 16.6667H4.49999C4.22624 16.6667 3.97998 16.7407 3.75 16.8786L7.61007 12.9163C7.77459 13.1497 7.96885 13.3672 8.18673 13.5527C8.59609 13.8834 9.06258 14.1519 9.56257 14.3269C9.86846 14.438 10.1905 14.4857 10.5 14.4857C10.8096 14.4857 11.1317 14.438 11.4377 14.3269C11.9377 14.1519 12.4042 13.8834 12.8136 13.5527C13.0314 13.3672 13.2257 13.1497 13.3902 12.9163L17.25 16.8786C17.0203 17.0162 16.7735 16.6667 16.5 16.6667H15.5Z"
                    fill="#0F0F0F"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_14_2925">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              <span>Entrega en el día.</span>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default PedidosCurso;
