import { useContext, useEffect, useState } from "react";
import "./CuadroVentaCliente.css";
import { Option } from "../../../components/Option/Option";
import { VentasContext } from "../VentasContext";
import { Sale } from "../../../../../type/Sale/Sale";
import { Client } from "../../../../../type/Cliente/Client";
import { GetProducts } from "../../../../../services/ProductsService";
import Product from "../../../../../type/Products/Products";
import { formatDateTime } from "../../../../../utils/helpers";
import ApiMethodClient from "../../../../../Class/api.client";
import { toast } from "react-hot-toast";
import ApiMethodSales from "../../../../../Class/api.sales";

const CuadroVentaCliente = (sale: Sale) => {
  const { setShowModal, setSelectedClient } = useContext(VentasContext);

  const [products, setProducts] = useState<Array<Product>>([]);
  const [client, setClient] = useState<Client>();
  const [date, setDate] = useState<string>();

  useEffect(() => {
    getClient();
    getProducts();
    console.log(sale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getClient = async () => {
    const api = new ApiMethodClient();
    try {
      const re = await api.getClientById(sale.client);
      var date = formatDateTime(sale.created, "numeric", "numeric", "numeric");
      setClient(re as unknown as Client);
      setDate(date);
    } catch (e) {
      console.error(e);
    }
  };

  const getProducts = async () => {
    try {
      await GetProducts().then((resp) => {
        setProducts(resp.data);
      });
    } catch (e) {
      console.error(e);
    }
  };

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

  const Delete = () => {
    setShowOptions(false);
    toast.error(
      (t) => (
        <span>
          Se <b>eliminara</b> esta venta <br /> <b>pulsa</b> para continuar
          <button
            className="bg-red-500 px-2 py-1 rounded-lg ml-2"
            onClick={async () => {
              toast.dismiss(t.id);
              const api = new ApiMethodSales();
              try {
                await api.DeleteSale(sale._id);
                toast.success("Venta eliminada", {
                  position: "top-center",
                });
                window.location.reload();
              } catch (error) {
                console.error(error);
              }
            }}
          >
            <i className="fa-solid fa-xmark text-white"></i>
          </button>
        </span>
      ),
      {
        position: "top-center",
      }
    );
  };

  return (
    <div className="CuadroVentaCliente-container relative">
      <div className="p-4">
        <div className="flex flex-col gap-3 pb-4">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div className="CuadroVentaCliente-header">
              <img
                src={
                  client?.storeImage ||
                  "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg"
                }
                alt=""
                className="PedidosCurso-profileImage"
              />

              {/* Muestra la imagen del cliente */}
              <span>{client?.fullName || "N/A"}</span>
            </div>
            <div className="flex gap-2">
              <div style={{ display: "flex", alignItems: "center" }}>
                <button type="button" className="btn" onClick={handleOpen}>
                  <img src="./Opciones-icon.svg" alt="" />
                </button>
              </div>
              <div className="infoClientes-ultimaventa">
                <span>{date}</span>
              </div>
            </div>
          </div>
          <div className="CuadroVentaCliente-text">
            <span>
              No. Cliente:{" "}
              <span style={{ color: "#1A3D7D" }}>{client?.code}</span>
            </span>
          </div>
        </div>
        <div className="CuadroVentaCliente-productos">
          <div className="w-full min-h-24 max-h-28 overflow-y-scroll">
            <div className="flex flex-row w-full gap-4 truncate">
              <p className="w-6/12">Productos</p>
              <p>Cantidad</p>
              <p>Precio</p>
            </div>
            <div className="flex w-full gap-2 justify-center items-center">
              <div className="flex flex-col justify-center items-start gap-4 w-full">
                {sale.detail.map((detail, index) => {
                  let product = products.find(
                    (product) => product._id === detail.product
                  );
                  const defaultProduct = {
                    name: "Producto desconocido",
                    icon: "./default-icon.svg",
                  };

                  return (
                    <ProductDetail
                      key={index}
                      product={product || defaultProduct}
                      detail={detail}
                      sale={client}
                    />
                  );
                })}
              </div>
              <div>
                <button
                  type="button"
                  className="btn"
                  onClick={() => Opciones()}
                >
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
          </div>
        </div>
      </div>
      <div className="relative bottom-0">
        <div
          style={{
            width: "98%",
            height: "1px",
            background: "#52A5F5",
            marginLeft: "3px",
          }}
        ></div>
        <div
          style={{
            width: "100%",
            textAlign: "right",
            padding: "9px 43px 20px 0px",
          }}
        >
          <span
            className="CuadroVentaCliente-text"
            style={{ fontWeight: "600", fontSize: "14px", marginRight: "17px" }}
          >
            Total:
          </span>
          <span
            className="CuadroVentaCliente-text"
            style={{ fontWeight: "600", fontSize: "18px", color: "#1A3D7D" }}
          >
            {sale.total}
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
    icon?: string;
  };
  detail: {
    quantity: number;
    price: number;
  };
  sale: any;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, detail }) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex items-center justify-start gap-2 w-7/12">
        <img src={product.icon || "./Botella-icon.svg"} alt={product.name} />
        <span className="CuadroVentaCliente-text truncate">{product.name}</span>
      </div>

      <div className="flex items-center justify-center -translate-x-2">
        <span
          className="CuadroVentaCliente-text outline outline-1 outline-blue-500 rounded-md py-0.5 px-3"
          style={{ fontWeight: "600" }}
        >
          {detail.quantity}
        </span>
      </div>

      <div>
        <span className="CuadroVentaCliente-text" style={{ fontWeight: "600" }}>
          {detail.price} Bs
        </span>
      </div>
    </div>
  );
};

export default ProductDetail;
