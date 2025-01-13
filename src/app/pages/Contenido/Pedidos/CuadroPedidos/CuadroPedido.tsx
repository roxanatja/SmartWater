import React, { useContext, useEffect, useRef, useState } from "react";
import "./PedidosAtendidos.css";
import { PedidosContext } from "../PedidosContext";
import Product from "../../../../../type/Products/Products";
import { Order } from "../../../../../type/Order/Order";
import { Zone } from "../../../../../type/City";
import { ClientsApiConector, OrdersApiConector } from "../../../../../api/classes";
import { formatIncompletePhoneNumber } from "libphonenumber-js";
import toast from "react-hot-toast";
import { Client } from "../../../../../type/Cliente/Client";
import { Option } from "../../../components/Option/Option";
import { formatDateTime } from "../../../../../utils/helpers";
import { useNavigate } from "react-router-dom";

interface Props {
  order: Order;
  products: Product[]
  zones: Zone[]
}

const CuadroPedido = ({ order, products, zones }: Props) => {
  const [client, setClient] = useState<Order['clientNotRegistered'] & { storeImage?: string; _id?: string; } | null>(null); // Estado para almacenar los clientes
  const { setShowModal, setSelectedClient, setSelectedOrder } = useContext(PedidosContext);

  const navigate = useNavigate()
  const optionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (order) {
      if (order.client) {
        ClientsApiConector.getClient({ clientId: order.client }).then(res => {
          if (res) {
            setClient({
              hasOrder: res.hasOrder,
              isClient: true,
              location: res.location,
              address: res.address,
              district: res.district,
              fullName: res.fullName,
              phoneNumber: res.phoneNumber,
              zone: res.zone,
              storeImage: res.storeImage,
              _id: res._id,
              from: 'internal'
            })
          }
          else { setClient(null) }
        })
      } else if (order.clientNotRegistered) {
        setClient(order.clientNotRegistered)
      } else {
        setClient(null)
      }
    }
  }, [order])

  const handleOpen = async () => {
    setShowModal(true);
    setSelectedClient(client as unknown as Client);
  };

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const Opciones = () => {
    setShowOptions(!showOptions);
    setSelectedClient(client as unknown as Client);
  };

  const Edit = () => {
    setSelectedClient(client as unknown as Client);
    setSelectedOrder(order)
    navigate("/Pedidos/RegistrarPedido")
    setShowOptions(false);
  };

  const Delete = async () => {
    toast.error(
      (t) => (
        <div>
          <p className="mb-4 text-center text-[#888]">
            Se <b>cancelará</b> este pedido <br /> pulsa <b>Proceder</b> para continuar
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
                const response = await OrdersApiConector.cancel({ orderId: order?._id || '' });
                if (!!response) {
                  if (response.mensaje) {
                    toast.success(response.mensaje, {
                      position: "top-center",
                      duration: 2000
                    });
                    window.location.reload();
                  }
                } else {
                  toast.error("Error al cancelar el pedido", {
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
      <div className="CuadroVentaCliente-container relative bg-blocks dark:border-blocks w-full">
        <div className="p-4 flex flex-col justify-between h-full">
          {/* Datos del cliente */}
          <div className="first-container">
            <div className={`flex flex-col gap-3 pb-4 w-[calc(100%_-_30px)]`}>
              <div className="flex items-start gap-4 justify-between pr-4">
                <div className="flex gap-x-12 gap-y-3 flex-wrap">
                  {
                    client &&
                    <>
                      <div className="CuadroVentaCliente-header">
                        {client?.storeImage ? (
                          <img
                            src={client?.storeImage}
                            alt=""
                            className="infoClientes-imgStore"
                          />
                        ) : (
                          <div className="bg-blue_custom text-white px-3.5 py-1.5 rounded-full flex justify-center items-center">
                            <div className="opacity-0">.</div>
                            <p className="absolute font-extrabold whitespace-nowrap">
                              {client?.fullName?.[0] || "S"}
                            </p>
                          </div>
                        )}

                        {/* Muestra la imagen del cliente */}
                        <span>{client?.fullName || "N/A"}</span>
                      </div>
                    </>
                  }

                  <div className="flex gap-2 items-center text-sm">
                    <img src="/whap-icon.svg" alt="Icono de WhatsApp" className="w-6 h-6" />
                    {
                      (!!client?.phoneNumber && client?.phoneNumber !== undefined
                        && client?.phoneNumber.trim() !== "" && !client?.phoneNumber.includes("undefined") && client?.phoneNumber !== "+591") ?
                        < a
                          href={`https://wa.me/${client?.phoneNumber}`}
                          className="btn-whatsapp flex items-center gap-1"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="whitespace-nowrap">{formatIncompletePhoneNumber(client.phoneNumber, "BO")}</span>
                        </a> :
                        <span>N/A</span>
                    }
                  </div>
                  <div className="flex gap-2 items-center text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                      <path d="M10.8509 9.58464C10.2984 9.58464 9.76847 9.36514 9.37777 8.97444C8.98707 8.58374 8.76758 8.05384 8.76758 7.5013C8.76758 6.94877 8.98707 6.41886 9.37777 6.02816C9.76847 5.63746 10.2984 5.41797 10.8509 5.41797C11.4034 5.41797 11.9334 5.63746 12.3241 6.02816C12.7148 6.41886 12.9342 6.94877 12.9342 7.5013C12.9342 7.77489 12.8804 8.0458 12.7757 8.29856C12.671 8.55132 12.5175 8.78099 12.3241 8.97444C12.1306 9.1679 11.9009 9.32135 11.6482 9.42605C11.3954 9.53075 11.1245 9.58464 10.8509 9.58464ZM10.8509 1.66797C9.30382 1.66797 7.82008 2.28255 6.72612 3.37651C5.63216 4.47047 5.01758 5.95421 5.01758 7.5013C5.01758 11.8763 10.8509 18.3346 10.8509 18.3346C10.8509 18.3346 16.6842 11.8763 16.6842 7.5013C16.6842 5.95421 16.0697 4.47047 14.9757 3.37651C13.8817 2.28255 12.398 1.66797 10.8509 1.66797Z" fill="currentColor" />
                    </svg>
                    <span>{client?.zone ? zones.find(z => z._id === client.zone)?.name || "Sin zona" : "Sin zona"}</span>
                  </div>
                  <div className="flex gap-2 items-center text-sm">
                    <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 0L0 9H3V17H17V9H20L10 0ZM10 4.7C12.1 4.7 13.8 6.4 13.8 8.5C13.8 11.5 10 15 10 15C10 15 6.2 11.5 6.2 8.5C6.2 6.4 7.9 4.7 10 4.7ZM10 7C9.60218 7 9.22064 7.15804 8.93934 7.43934C8.65804 7.72064 8.5 8.10218 8.5 8.5C8.5 8.89782 8.65804 9.27936 8.93934 9.56066C9.22064 9.84196 9.60218 10 10 10C10.3978 10 10.7794 9.84196 11.0607 9.56066C11.342 9.27936 11.5 8.89782 11.5 8.5C11.5 8.10218 11.342 7.72064 11.0607 7.43934C10.7794 7.15804 10.3978 7 10 7Z" fill="black" />
                    </svg>
                    <span>{client?.address || "Sin dirección"}</span>
                  </div>
                </div>
                {
                  client && !client.isClient &&
                  <div className="flex gap-2 items-start text-end justify-end">
                    <span className="whitespace-nowrap text-sm">{client.from === "customer" ? "De SmartApp" : "Cliente no registrado"}</span>
                  </div>
                }
              </div>
              {
                !order.attended &&
                <div className="absolute right-0 p-4 rounded-full z-[35] top-2 flex flex-col gap-6">
                  <button type="button" className="invert-0 dark:invert" onClick={handleOpen}>
                    <img src="/Opciones-icon.svg" alt="" />
                  </button>

                  <div className="relative" ref={optionsRef}>
                    <button type="button" className="invert-0 dark:invert" onClick={() => Opciones()}>
                      <img src="/opcion-icon.svg" alt="" />
                    </button>
                    <Option
                      editAction={Edit}
                      visible={showOptions}
                      editar={true}
                      eliminar={true}
                      deleteAction={Delete}
                      eliminarText="Cancelar"
                    />
                  </div>
                </div>
              }
            </div>

            {/* Productos del pedido */}
            <div className="flex flex-wrap CuadroVentaCliente-productos items-end justify-end w-[calc(100%_-_30px)]">
              <div className="w-full max-h-28 overflow-y-auto mb-6">
                {order.detail.length > 0 ? (
                  <div className="relative">
                    <div className="grid grid-cols-3 gap-4 sticky top-0 bg-blocks mb-3">
                      <div className="font-bold text-left col-span-2">
                        <span>Productos</span>
                      </div>
                      <div className="font-bold text-center">
                        <span>Cantidad</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">

                      {order.detail.map((detail, index: number) => {
                        let product = products.find(
                          (product) => product._id === detail.product
                        );
                        return (
                          <React.Fragment key={index}>
                            <div className="flex items-center gap-2 col-span-2">
                              <img
                                src={
                                  product?.imageUrl ||
                                  "https://imgs.search.brave.com/cGS0E8gPAr04hSRQFlmImRAbRRWldP32Qfu_0atMNyQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMudmV4ZWxzLmNv/bS9tZWRpYS91c2Vy/cy8zLzE1NjkyOC9p/c29sYXRlZC9wcmV2/aWV3LzZjNjVjMTc3/ZTk0ZTc1NTRlMWZk/YjBhZjMwMzhhY2I3/LWljb25vLWN1YWRy/YWRvLWRlLXNpZ25v/LWRlLWludGVycm9n/YWNpb24ucG5n"
                                }
                                alt=""
                                className="w-7 h-7 rounded-full"
                              />
                              <span className="CuadroVentaCliente-text">
                                {product ? product.name : "Producto no encontrado"}
                              </span>
                            </div>
                            <div className="flex w-full justify-center">
                              <div className="CuadroVentaCliente-TextContainer font-semibold text-center !bg-transparent !border-blue_custom">
                                <span className="CuadroVentaCliente-text">
                                  {detail.quantity}
                                </span>
                              </div>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p>No hay items para mostrar</p>
                )}
              </div>
            </div>
          </div>

          <div className="footer">
            {/* Información de entrega y ubicación */}
            <div className="flex justify-evenly w-full flex-wrap text-base">
              <div className="PedidosCurso-infoEntrega flex flex-col gap-1 items-center">
                <span>Entrega programada</span>
                <span className="text-blue_custom">
                  {formatDateTime(order.deliverDate, 'numeric', '2-digit', '2-digit', false, true)}
                </span>
              </div>
              {
                order.attended &&
                <div className="PedidosCurso-infoEntrega flex flex-col gap-1 items-center">
                  <span>Fecha de atención</span>
                  <span className="text-blue_custom">
                    {formatDateTime(order.attended, 'numeric', '2-digit', '2-digit', false, true)}
                  </span>
                </div>
              }
            </div>

            {/* Información adicional del pedido */}
            <div className="PedidosCurso-Nota flex gap-3 border-b border-blue_custom pb-2 relative mt-4">
              <i className="fa-solid fa-message text-xl text-blue_custom"></i>

              <div>
                {order.comment || "Sin comentarios"}
              </div> {/* Comentario del pedido */}

            </div>
            <a
              href={`https://www.google.com/maps?q=${client?.location?.latitude},${client?.location?.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="flex gap-1 items-center justify-center w-full mt-3"
            >
              <svg className="text-blue_bright"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M9.99935 9.58366C9.44682 9.58366 8.91691 9.36417 8.52621 8.97346C8.13551 8.58276 7.91602 8.05286 7.91602 7.50033C7.91602 6.94779 8.13551 6.41789 8.52621 6.02719C8.91691 5.63649 9.44682 5.41699 9.99935 5.41699C10.5519 5.41699 11.0818 5.63649 11.4725 6.02719C11.8632 6.41789 12.0827 6.94779 12.0827 7.50033C12.0827 7.77391 12.0288 8.04482 11.9241 8.29758C11.8194 8.55034 11.6659 8.78001 11.4725 8.97346C11.279 9.16692 11.0494 9.32038 10.7966 9.42507C10.5438 9.52977 10.2729 9.58366 9.99935 9.58366ZM9.99935 1.66699C8.45225 1.66699 6.96852 2.28157 5.87456 3.37554C4.7806 4.4695 4.16602 5.95323 4.16602 7.50033C4.16602 11.8753 9.99935 18.3337 9.99935 18.3337C9.99935 18.3337 15.8327 11.8753 15.8327 7.50033C15.8327 5.95323 15.2181 4.4695 14.1241 3.37554C13.0302 2.28157 11.5464 1.66699 9.99935 1.66699Z"
                  fill="currentColor"
                />
              </svg>
              <span className="whitespace-nowrap text-blue_bright">Ver ubicación en el mapa</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
export { CuadroPedido };
