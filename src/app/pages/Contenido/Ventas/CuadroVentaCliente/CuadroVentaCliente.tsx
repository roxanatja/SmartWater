import { useContext, useEffect, useRef, useState } from "react";
import "./CuadroVentaCliente.css";
import { Option } from "../../../components/Option/Option";
import { VentasContext } from "../VentasContext";
import { Sale } from "../../../../../type/Sale/Sale";
import { Client } from "../../../../../type/Cliente/Client";
import Product from "../../../../../type/Products/Products";
import { formatDateTime } from "../../../../../utils/helpers";
import { toast } from "react-hot-toast";
import { SalesApiConector } from "../../../../../api/classes";
import { useNavigate } from "react-router-dom";

interface Props {
  sale: Sale;
  products: Product[];
  isCobro?: boolean
}

const CuadroVentaCliente = ({ products, sale, isCobro }: Props) => {
  const { setShowModal, setSelectedSale, setSelectedClient } = useContext(VentasContext);

  const [client, setClient] = useState<Client>();
  const [date, setDate] = useState<string>();
  const optionsRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate()

  useEffect(() => {
    if (sale) {
      var date = formatDateTime(sale.created, "numeric", "2-digit", "2-digit");
      setClient(sale.client);
      setDate(date);
    }
  }, [sale]);

  const handleOpen = async () => {
    setShowModal(true);
    setSelectedClient(client as unknown as Client);
  };

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const Opciones = () => {
    setShowOptions(!showOptions);
  };

  const Edit = () => {
    setSelectedClient(client as unknown as Client);
    setSelectedSale(sale);
    navigate("/Ventas/RegistrarVenta")
    setShowOptions(false);
  };

  const Delete = async () => {
    toast.error(
      (t) => (
        <div>
          <p className="mb-4 text-center text-[#888]">
            Se <b>eliminará</b> esta venta <br /> pulsa <b>Proceder</b> para continuar
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
                const response = await SalesApiConector.delete({ saleId: sale?._id || '' });
                if (!!response) {
                  if (response.mensaje) {
                    toast.success(response.mensaje, {
                      position: "top-center",
                      duration: 2000
                    });
                    window.location.reload();
                  }
                } else {
                  toast.error("Error al eliminar la venta", {
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
    <div className="CuadroVentaCliente-container relative bg-blocks dark:border-blocks w-full h-fit">
      <div className="p-4">
        <div className={`flex flex-col gap-3 pb-2 ${(!isCobro && !client?.deactivated) && "w-[calc(100%_-_30px)]"} overflow-hidden`}>
          <div className="flex items-center justify-between gap-2">
            <div className="CuadroVentaCliente-header flex-[2] overflow-hidden">
              {client?.clientImage ? (
                <img
                  src={client?.clientImage}
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
              <span className="break-all">{client?.fullName || "N/A"} {client?.deactivated && "- Cliente Eliminado"}</span>
            </div>
            <div className="flex gap-2 flex-1 justify-end w-fit">
              <div className="infoClientes-ultimaventa text-blue_custom border-blue_custom">
                <span>{date}</span>
              </div>
            </div>
          </div>
          <div className="CuadroVentaCliente-text">
            <span>
              <span className="font-semibold">
                No. Cliente:{" "}
              </span>
              <span className="text-blue_custom">{client?.code}</span>
            </span>
            <br />
            <span>
              Código:{" "}
              <span className="text-blue_custom">{sale.code || "Sin código"}</span>
            </span>
          </div>

          {
            (!isCobro && !client?.deactivated) &&
            <div className="absolute -right-2 p-4 rounded-full z-[35] top-2 flex flex-col gap-6">
              <button type="button" className="invert-0 dark:invert" onClick={handleOpen}>
                <img src="./Opciones-icon.svg" alt="" />
              </button>

              <div className="relative" ref={optionsRef}>
                <button type="button" className="invert-0 dark:invert" onClick={() => Opciones()}>
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
          }
        </div>
        <div className="CuadroVentaCliente-productos w-[calc(100%_-_30px)]">
          <div className="w-full min-h-16 max-h-28 overflow-y-auto mt-4 relative">
            <div className="grid grid-cols-5 mb-2 text-blue_custom sticky top-0 bg-blocks">
              <p className="col-span-3 text-sm">Productos</p>
              <p className="w-full overflow-hidden text-ellipsis text-center text-sm">Cantidad</p>
              <p className="w-full overflow-hidden text-ellipsis text-end pr-1 text-sm">Precio</p>
            </div>
            <div className="flex w-full gap-2 justify-center items-center">
              <div className="flex flex-col justify-center items-start gap-4 w-full">
                {sale.detail.map((detail, index) => {
                  let product = products.find((product) => product._id === detail.product);

                  const defaultProduct = {
                    name: "Producto desconocido",
                    icon: "./Botella-icon.svg",
                  };

                  return (
                    <ProductDetail
                      key={index}
                      product={product || defaultProduct}
                      detail={detail}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="PedidosCurso-Nota flex gap-3 border-b border-blue_bright/30 pb-2 relative mx-2 mt-4 w-[calc(100%_-_1rem)]">
        <i className="fa-solid fa-message text-lg text-blue_custom"></i>

        <div className="text-sm">
          {sale.comment || "Sin comentarios"}
        </div> {/* Comentario del pedido */}

      </div>

      <div className="relative bottom-0">
        <div className="w-full text-end px-5 py-3">
          <span
            className="CuadroVentaCliente-text"
            style={{ fontWeight: "600", fontSize: "14px", marginRight: "17px" }}
          >
            Total:
          </span>
          <span className="CuadroVentaCliente-text text-blue_custom" style={{ fontWeight: "600", fontSize: "18px" }}>
            <span>
              {sale.detail.reduce((current, det) => current += (det.price * det.quantity), 0)} Bs
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export { CuadroVentaCliente };

interface ProductDetailProps {
  product: {
    name: string;
    imageUrl?: string;
  };
  detail: {
    quantity: number;
    price: number;
  };
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, detail }) => {
  return (
    <div className="grid grid-cols-5 items-center w-full px-2">
      <div className="flex items-center justify-start gap-2 col-span-3">
        <img src={product.imageUrl || "./Botella-icon.svg"} alt={""} className="w-[30px] h-[30px] object-cover rounded-full" />
        <span className="CuadroVentaCliente-text truncate">{product.name}</span>
      </div>

      <div className="flex items-center justify-center">
        <span
          className="CuadroVentaCliente-text outline outline-1 outline-blue_custom rounded-md py-0.5 px-3"
          style={{ fontWeight: "600" }}
        >
          {detail.quantity}
        </span>
      </div>

      <div>
        <span className="CuadroVentaCliente-text flex justify-end text-sm" style={{ fontWeight: "600" }}>
          {detail.price} Bs
        </span>
      </div>
    </div>
  );
};

export default ProductDetail;
