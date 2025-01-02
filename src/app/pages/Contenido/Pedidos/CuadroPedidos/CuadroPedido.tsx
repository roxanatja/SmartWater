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

interface Props {
  order: Order;
  products: Product[]
  zones: Zone[]
}

const CuadroPedido = ({ order, products, zones }: Props) => {
  const [client, setClient] = useState<Order['clientNotRegistered'] & { storeImage?: string; _id?: string; } | null>(null); // Estado para almacenar los clientes
  const { setShowModal, setSelectedClient } = useContext(PedidosContext);

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
              _id: res._id
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
              <div className="flex items-center justify-between pr-4">
                <div className="flex gap-12">
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
                  <a
                    href={`https://wa.me/${client?.phoneNumber}`}
                    className="btn-whatsapp PedidosCurso-datos flex gap-2 items-center"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img src="/whap-icon.svg" alt="Icono de WhatsApp" className="w-[20px] h-[20px]" />
                    <span className="whitespace-nowrap">{formatIncompletePhoneNumber(client?.phoneNumber || "", "BO")}</span>
                  </a>
                  <div className="flex gap-2 items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="20" viewBox="0 0 21 20" fill="none">
                      <path d="M10.8509 9.58464C10.2984 9.58464 9.76847 9.36514 9.37777 8.97444C8.98707 8.58374 8.76758 8.05384 8.76758 7.5013C8.76758 6.94877 8.98707 6.41886 9.37777 6.02816C9.76847 5.63746 10.2984 5.41797 10.8509 5.41797C11.4034 5.41797 11.9334 5.63746 12.3241 6.02816C12.7148 6.41886 12.9342 6.94877 12.9342 7.5013C12.9342 7.77489 12.8804 8.0458 12.7757 8.29856C12.671 8.55132 12.5175 8.78099 12.3241 8.97444C12.1306 9.1679 11.9009 9.32135 11.6482 9.42605C11.3954 9.53075 11.1245 9.58464 10.8509 9.58464ZM10.8509 1.66797C9.30382 1.66797 7.82008 2.28255 6.72612 3.37651C5.63216 4.47047 5.01758 5.95421 5.01758 7.5013C5.01758 11.8763 10.8509 18.3346 10.8509 18.3346C10.8509 18.3346 16.6842 11.8763 16.6842 7.5013C16.6842 5.95421 16.0697 4.47047 14.9757 3.37651C13.8817 2.28255 12.398 1.66797 10.8509 1.66797Z" fill="currentColor" />
                    </svg>
                    <span>{client?.zone ? zones.find(z => z._id === client.zone)?.name || "Sin zona" : "Sin zona"}</span>
                  </div>
                </div>
                {
                  !client?.isClient &&
                  <div className="flex gap-2 items-center">
                    <span>Cliente no registrado</span>
                  </div>
                }
              </div>
              <div className="absolute right-0 p-4 rounded-full z-[35] top-2 flex flex-col gap-6">
                <button type="button" className="invert-0 dark:invert" onClick={handleOpen}>
                  <img src="/Opciones-icon.svg" alt="" />
                </button>

                {
                  !order.attended &&
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
                }
              </div>
            </div>

            {/* Productos del pedido */}
            <div className="flex flex-wrap CuadroVentaCliente-productos items-end justify-end">
              <div className="w-full max-h-28 overflow-y-auto mb-6">
                {order.detail.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="font-bold text-left sticky top-0 col-span-2">
                      <span>Productos</span>
                    </div>
                    <div className="font-bold sticky top-0 text-center">
                      <span>Cantidad</span>
                    </div>
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
                  {formatDateTime(order.deliverDate, 'numeric', '2-digit', '2-digit')}
                </span>
              </div>
              {
                order.attended &&
                <div className="PedidosCurso-infoEntrega flex flex-col gap-1 items-center">
                  <span>Fecha de atención</span>
                  <span className="text-blue_custom">
                    {formatDateTime(order.attended, 'numeric', '2-digit', '2-digit')}
                  </span>
                </div>
              }
            </div>

            {/* Información adicional del pedido */}
            <div className="PedidosCurso-Nota flex gap-3 border-b border-blue_custom pb-2 relative mt-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-blue_custom"
              >
                <g clipPath="url(#clip0_14_2925)">
                  <path
                    d="M2.5 0C1.11929 0 0 1.11929 0 2.5V17.5C0 18.8807 1.11929 20 2.5 20H17.5C18.8807 20 20 18.8807 20 17.5V7.5C20 6.84375 19.5938 6.40625 18.9375 6.1875L14.6875 4.6875C14.2188 4.53125 14 4.09375 14 3.75V2.5C14 1.11929 12.8807 0 11.5 0H2.5ZM18.5938 17.8125C18.5938 18.0563 18.3438 18.25 18.0625 18.25H1.875C1.61875 18.25 1.40625 18.0313 1.40625 17.8125V2.1875C1.40625 1.93125 1.61875 1.71875 1.875 1.71875H11.875V3.125C11.875 4.78125 13.1563 6.09375 14.6875 6.09375C15.3125 6.09375 15.8438 5.84375 16.2812 5.40625L18.5938 7.71875V17.8125ZM16.875 16.25H13.75V13.125C13.75 12.6438 13.4062 12.2812 12.9375 12.125C12.5312 12 11.9688 12.3125 11.9062 12.75L11.875 12.875V16.25H8.75V8.75H11.0938C11.3438 8.75 11.5625 8.53125 11.5625 8.28125V8.1875C11.5625 7.9375 11.3438 7.71875 11.0938 7.71875H8.75V5.3125C8.75 4.59375 9.34375 4 10.0625 4C10.7812 4 11.375 4.59375 11.375 5.3125V6.09375C11.375 6.34375 11.5938 6.5625 11.8438 6.5625H16.875C17.125 6.5625 17.3438 6.78125 17.3438 7.03125V16.2188L16.9062 16.25H16.875Z"
                    fill="currentColor"
                  />
                  <path
                    d="M14.3125 9.8125H5.625C5.375 9.8125 5.15625 9.59375 5.15625 9.34375V8.75C5.15625 8.5 5.375 8.28125 5.625 8.28125H14.3125C14.5625 8.28125 14.7812 8.5 14.7812 8.75V9.34375C14.7812 9.59375 14.5625 9.8125 14.3125 9.8125Z"
                    fill="currentColor"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_14_2925">
                    <rect width="20" height="20" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <div>
                {order.comment || "Sin comentarios"}
              </div> {/* Comentario del pedido */}

            </div>
            <a
              href={`https://www.google.com/maps?q=${client?.location.latitude},${client?.location.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="flex gap-1 items-center justify-center w-full mt-3"
            >
              <svg className="text-blue_custom"
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
              <span className="whitespace-nowrap">Ver ubicación en el mapa</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
export { CuadroPedido };
