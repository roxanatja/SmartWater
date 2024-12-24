import { FC, useState, useEffect } from "react";
import "./PedidosResumido.css";
import { GetProducts } from "../../../../../services/ProductsService";
import { ClientsApiConector, OrdersApiConector } from "../../../../../api/classes";
import { Order } from "../../../../../type/Order/Order";
import Modal from "../../../EntryComponents/Modal";
import { CuadroRealizarPedido } from "../../../components/CuadroRealizarPedido/CuadroRealizarPedido";

const PedidosResumido = () => {
  const [showMiniModal, setShowMiniModal] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<(Order)[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await GetProducts();
        const ordersData = await OrdersApiConector.get({ pagination: { page: 1, pageSize: 4 } });

        const ordersPopulated: Order[] = []

        for (const order of ordersData?.data || []) {
          const client = await ClientsApiConector.getClient({ clientId: order.client })
          ordersPopulated.push({ ...order, client })
        }

        setProducts(productsData.data);
        setOrders(ordersPopulated);
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
        <div className="opciones-svg">
          <img src="./Opciones-icon.svg" alt="" onClick={handleOpcionesClick} />
          <Modal
            isOpen={showMiniModal}
            onClose={() => {
              setShowMiniModal(false);
            }}
            className="w-3/12"
          >
            <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30 bg-white">
              Realizar Pedido
            </h2>
            <div className="p-6">
              <CuadroRealizarPedido onClose={() => setShowMiniModal(false)} />
            </div>
          </Modal>
        </div>
      </div>

      <div className="todos-clientes w-full">
        {orders.slice(0, 4).map((order, index) => {
          const product = products.find(
            (product) => product._id === order.detail[0]?.product
          );

          if ((!order.client && !order.clientNotRegistered) || !product) {
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
                {
                  !!order.client &&
                  <>
                    {
                      order.client.storeImage ?
                        <img src={order.client.storeImage || 'clientes-icon-blue.svg'} className="img-cliente" alt="Cliente" /> :
                        (
                          <div className="bg-blue_custom text-white relative px-3.5 py-1.5 rounded-full flex justify-center items-center">
                            <div className="opacity-0">.</div>
                            <p className="absolute font-extrabold ">
                              {order.client.fullName?.[0]}
                            </p>
                          </div>
                        )
                    }
                    <span>{order.client.fullName || "Sin nombre"}</span>
                  </>
                }
                {
                  (!order.client && !!order.clientNotRegistered) &&
                  <>
                    <div className="bg-blue_custom text-white relative px-3.5 py-1.5 rounded-full flex justify-center items-center">
                      <div className="opacity-0">.</div>
                      <p className="absolute font-extrabold ">
                        {order.clientNotRegistered.fullName?.[0]}
                      </p>
                    </div>
                    <span>{order.clientNotRegistered.fullName}</span>
                  </>
                }
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
    </div >
  );
};

export default PedidosResumido;
