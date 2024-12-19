import { FC, useState, useEffect } from "react";
import "./PedidosResumido.css";
import { loadOrders } from "../../../../../services/OrdersService";
import { loadClients } from "../../../../../services/ClientsService";
import { GetProducts } from "../../../../../services/ProductsService";
import { GetZone } from "../../../../../services/ZonesService";
import { OpcionesPedidos } from "./OpcionesPedidos/OpcionesPedidos";

const PedidosResumido: FC = () => {
  const [showMiniModal, setShowMiniModal] = useState(false);
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Get just 4 clients from API, instead of slicing
    const fetchData = async () => {
      try {
        const clientsData = await loadClients();
        const productsData = await GetProducts();
        const ordersData = await loadOrders();
        const zonesData = await GetZone();

        setClients(clientsData.data);
        setProducts(productsData.data);
        setOrders(ordersData.data.slice(-4));
        setZones(zonesData.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleOpcionesClick = () => {
    setShowMiniModal(!showMiniModal);
  };

  return (
    <div className="cuadroClientes">
      <div className="titulo-pedidos">
        <span className="Pedidos-title">
          Pedidos <span className="Pedidos-title2">vista rapida</span>{" "}
        </span>
        <div className="opciones-svg" onClick={handleOpcionesClick}>
          <img src="./Opciones-icon.svg" alt="" />
          {showMiniModal && <OpcionesPedidos />}
        </div>
      </div>

      <div className="todos-clientes w-full">
        {orders.slice(0, 4).map((order, index) => {
          const client = clients.find((client) => client.user === order.user);
          const product = products.find(
            (product) => product._id === order.detail[0]?.product
          );

          if (!client || !product) {
            console.warn(
              `Cliente o producto no encontrado para el pedido con ID: ${order._id}`
            );
            return null;
          }

          const quantityText =
            order.detail[0]?.quantity === 1 ? "botella" : "botellas";

          return (
            <div key={index} className="pedidosResumido-body w-full">
              <div className="pedidosResumido-datos flex-1">
                {client.storeImage && (
                  <img
                    src={client.storeImage || ''}
                    alt="Pedido"
                    className="pedidosResumido-imgStore"
                  />
                )}
                <span>{client.fullName}</span>
              </div>
              <div className="flex items-center flex-1 gap-3">
                <span className="pedidosResumido-ultimaventa">
                  {new Date(order.created).toLocaleDateString()}
                </span>
                <div className="flex items-center gap-2 text-sm">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="pedidosResumido-productImage"
                    />
                  )}
                  <span className="whitespace-nowrap">
                    {order.detail[0]?.quantity} {quantityText}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PedidosResumido;
