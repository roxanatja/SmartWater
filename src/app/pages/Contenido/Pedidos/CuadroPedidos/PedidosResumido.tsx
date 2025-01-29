import { useState, useEffect } from "react";
import "./PedidosResumido.css";
import { ClientsApiConector, OrdersApiConector, ProductsApiConector } from "../../../../../api/classes";
import { Order } from "../../../../../type/Order/Order";
import Modal from "../../../EntryComponents/Modal";
import { CuadroRealizarPedido } from "../../../components/CuadroRealizarPedido/CuadroRealizarPedido";
import Product from "../../../../../type/Products/Products";
import { UnitMeasure } from "../../../../../type/Products/UnitMeasure";
import { formatDateTime } from "../../../../../utils/helpers";

const PedidosResumido = () => {
  const [showMiniModal, setShowMiniModal] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<(Order)[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await ProductsApiConector.get({ pagination: { page: 1, pageSize: 3000 } });
        const ordersData = await OrdersApiConector.get({ pagination: { page: 1, pageSize: 4 } });

        const ordersPopulated: Order[] = []

        for (const order of ordersData?.data || []) {
          const client = await ClientsApiConector.getClient({ clientId: order.client })
          ordersPopulated.push({ ...order, client })
        }

        setProducts(productsData?.data || []);
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
    <div className="cuadroClientes bg-blocks dark:border-blocks">
      <div className="titulo-pedidos">
        <span className="Pedidos-title">
          Pedidos <span className="Pedidos-title2">vista rapida</span>{" "}
        </span>
        <div className="opciones-svg cursor-pointer">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={handleOpcionesClick} >
            <g id="&#240;&#159;&#147;&#141;Icon">
              <path id=" &#226;&#134;&#179;Color" fill-rule="evenodd" clip-rule="evenodd" d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor" fill-opacity="0.87" />
            </g>
          </svg>
          <Modal
            isOpen={showMiniModal}
            onClose={() => {
              setShowMiniModal(false);
            }}
            className="w-3/12"
          >
            <h2 className="text-blue_custom font-semibold p-6 pb-0 sticky top-0 z-30">
              Realizar Pedido Rápido
            </h2>
            <div className="p-6">
              <CuadroRealizarPedido onClose={() => setShowMiniModal(false)} />
            </div>
          </Modal>
        </div>
      </div>

      <div className="todos-clientes w-full">
        {orders.map((order, index) => {
          const product = products.find(
            (product) => product._id === order.detail[0]?.product
          );

          if ((!order.client && !order.clientNotRegistered) || !product) {
            console.warn(
              `Cliente o producto no encontrado para el pedido con ID: ${order._id}`
            );
            return null;
          }

          const quantityText = (product.unitMeasure as UnitMeasure).name

          return (
            <div key={index} className="pedidosResumido-body w-full grid grid-cols-4">
              <div className="pedidosResumido-datos flex-1 col-span-2">
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
                              {order.client.fullName?.[0] || "S"}
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
              <span className="pedidosResumido-ultimaventa border-blue_custom text-blue_custom">
                {formatDateTime(order.created, 'numeric', '2-digit', '2-digit', false, true)}
              </span>
              <div className="flex items-center gap-2 text-sm">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="pedidosResumido-productImage"
                  />
                )}
                <span className="whitespace-nowrap overflow-hidden overflow-ellipsis">
                  {order.detail[0]?.quantity} {quantityText}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div >
  );
};

export default PedidosResumido;
