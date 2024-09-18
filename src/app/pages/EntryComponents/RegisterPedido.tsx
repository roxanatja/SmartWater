import React, { useState, useContext, useCallback, useEffect } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import ApiMethodSales from "../../../Class/api.sales";
import { OrdenBody } from "../../../type/Order/Order";
import Product from "../../../type/Products/Products";
import { OptionScrooll } from "../components/OptionScrooll/OptionScrooll";
import { ClientesContext } from "../Contenido/Clientes/ClientesContext";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import ApiMethodOrder from "../../../Class/api.order";

const RegisterPedidoForm = () => {
  const { selectedClient } = useContext(ClientesContext);
  const Cantidad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const [products, setProducts] = useState<Product[]>([]);
  const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(true);
  const [active, setActive] = useState(false);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [addedProducts, setAddedProducts] = useState<
    { product: string; quantity: string }[]
  >([]);

  const getProduct = useCallback(async () => {
    const api = new ApiMethodSales();
    const res = await api.GetProducts();
    setProducts(res);
  }, []);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  const handleOpcionesClick = () => {
    setOpcionesVisibles(!opcionesVisibles);
  };

  const { register, handleSubmit, watch, setValue, control } =
    useForm<OrdenBody>({
      defaultValues: {
        detail: [{ product: "", quantity: "0" }],
      },
    });

  const { append } = useFieldArray({
    control,
    name: "detail",
  });

  const toggleCalendario = () => {
    setValue("deliverDate", "");
    setMostrarCalendario(!mostrarCalendario);
  };

  const handleAddProduct = () => {
    const product = watch("detail")[0].product;
    const quantity = watch("detail")[0].quantity;

    if (product && quantity) {
      setAddedProducts([...addedProducts, { product, quantity }]);
      append({ product: "", quantity: "1" });
    }
  };

  const handleDeleteProduct = (index: number) => {
    setAddedProducts(addedProducts.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<OrdenBody> = async (data) => {
    if (addedProducts.length === 0) {
      toast.error("Por favor agrega un producto.");
      return;
    }
    setActive(true);
    const api = new ApiMethodOrder();
    const values: OrdenBody = {
      ...data,
      detail: addedProducts.map((item) => ({
        product:
          products?.find((p) => p.description === item.product)?._id || "",
        quantity: item.quantity,
      })),
      user: selectedClient.code,
      client: selectedClient._id,
    };
    console.log(values);
    try {
      await api.saveOrder(values);
      toast.success("Pedido registrado");
    } catch (error) {
      toast.error("Upss error al registrar pedido");
      console.error(error);
    }
    setActive(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="">
        <div className="RegistrarPedido-NombreCliente">
          <div className="RegistrarPedido-Nombre">
            <img
              src={selectedClient.storeImage || ""}
              alt=""
              className="imagen-pequena"
            />
            <span>{selectedClient.fullName}</span>
          </div>
          <div
            className="RegistrarPedido-Nombre"
            style={{ gap: "10px", fontWeight: "400" }}
          >
            <i className="fa-brands fa-whatsapp text-xl text-green-500"></i>
            <span>{selectedClient.phoneNumber}</span>
          </div>
        </div>
        <div className="RegistrarPedido-AgregarProducto">
          <div className="RegistrarPedido-AgregarProductoTitulo">
            <span>Agregar producto</span>
            <button
              type="button"
              onClick={handleOpcionesClick}
              className={
                opcionesVisibles
                  ? "RegistrarPedido-btnAgregarProducto AgregarProductoactive-btn"
                  : "RegistrarPedido-btnAgregarProducto"
              }
            >
              <span className="material-symbols-outlined">expand_more</span>
            </button>
          </div>
          <div className="lineagris"></div>
          {opcionesVisibles && (
            <>
              <div className="flex justify-between w-full px-80 text-md font-medium -translate-x-3">
                <p>Cantidad</p>
                <p>Producto</p>
              </div>
              <div className="bg-gradient-to-b from-transparentLight via-customLightBlue to-customBlue grid grid-cols-2 rounded-b-2xl w-full py-20 gap-10">
                <OptionScrooll
                  options={Cantidad}
                  onOptionChange={(selectedOption) =>
                    setValue(`detail.0.quantity`, selectedOption)
                  }
                />
                <OptionScrooll
                  options={products.map((product) => product.name)}
                  onOptionChange={(selectedOption) => {
                    if (products) {
                      const selectedProduct = products.find(
                        (product) => product.name === selectedOption
                      );
                      setValue(`detail.0.product`, selectedProduct?.name || "");
                    }
                  }}
                />
              </div>

              <div className="text-2xl rounded-2xl w-full flex flex-col items-center gap-2 text-black pr-2.5 shadow-md border p-2 shadow-zinc-300">
                <i
                  className="fa-solid fa-plus rounded-full shadow-md shadow-zinc-400 px-3 py-2.5 bg-blue_custom text-white hover:rotate-90 transition-all cursor-pointer"
                  onClick={handleAddProduct}
                ></i>
                <p className="text-base font-semibold"> Agregar Producto</p>
              </div>
            </>
          )}

          <div className="relative w-full flex items-center">
            <i className="fa-solid fa-message text-2xl text-blue_custom absolute"></i>
            <input
              {...register("comment")}
              name="comment"
              placeholder="Agregar Comentario"
              className="placeholder:text-blue_custom outline-0 border-b-2 rounded-none border-blue_custom focus:outline-0 placeholder:text-md placeholder:font-semibold w-full py-2 ps-8"
            />
          </div>
          <DatePicker
                  minDate={new Date()}
                  id="FechaPedido"
                  selected={watch('deliverDate')}
                  onChange={handleFechaChange}
                  dateFormat={"dd-mm-yyyy"}
                  dropdownMode="select"
                  onClickOutside={() => setMostrarCalendario(false)}
                />
              </div>
              <span>
                {fecha === null
                  ? "Fecha de entrega"
                  : moment(fecha).format("DD/MM/YYYY")}
              </span>

          <div className={`${addedProducts.length > 0 && "mt-4"} w-full`}>
            <ul className="list-disc max-h-72 overflow-y-scroll">
              {addedProducts.map((product, index) => (
                <motion.li
                  key={index}
                  className="mb-2 flex justify-between items-center bg-white shadow-md border shadow-zinc-300 rounded-2xl p-2"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col gap-4 p-1">
                    <p>
                      <strong>{product.product}</strong>
                    </p>
                    <p className="text-sm">Cantidad:{product.quantity}</p>
                  </div>
                  <button
                    type="button"
                    className="text-red-700 hover:text-red-500 -translate-y-6"
                    onClick={() => handleDeleteProduct(index)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
          <button
            type="submit"
            className=" outline outline-2 outline-blue-500 bg-blue-500 py-2  text-xl px-6 rounded-full text-white font-medium shadow-xl hover:bg-blue-600 fixed bottom-5 right-5 z-50 p-10 w-2/12"
          >
            {active ? (
              <i className="fa-solid fa-spinner animate-spin"></i>
            ) : (
              "Vender"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterPedidoForm;
