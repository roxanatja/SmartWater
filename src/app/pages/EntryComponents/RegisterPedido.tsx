import React, { useState, useContext, useCallback, useEffect } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import ApiMethodSales from "../../../Class/api.sales";
import { OrdenBody } from "../../../type/Order/Order";
import Product from "../../../type/Products/Products";
import { OptionScrooll } from "../components/OptionScrooll/OptionScrooll";
import { ClientesContext } from "../Contenido/Clientes/ClientesContext";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import { toast } from "react-hot-toast";
import ApiMethodOrder from "../../../Class/api.order";
import { useNavigate } from "react-router-dom";

const RegisterPedidoForm = () => {
  const { selectedClient } = useContext(ClientesContext);
  const Cantidad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const [products, setProducts] = useState<Product[]>([]);
  const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(true);
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
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

  useEffect(() => {
    if (selectedClient._id === "") {
      navigate("/Clientes");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClient]);

  const handleOpcionesClick = () => {
    setOpcionesVisibles(!opcionesVisibles);
  };

  const { register, handleSubmit, watch, setValue, control } =
    useForm<OrdenBody>({
      defaultValues: {
        detail: [{ product: "", quantity: "0" }],
        deliverDate: "",
      },
    });

  const { append } = useFieldArray({
    control,
    name: "detail",
  });

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

  const handleOptionChange = useCallback(
    (selectedOption: string, type: "quantity" | "product") => {
      const currentProduct = watch("detail")[0].product;
      const currentQuantity = watch("detail")[0].quantity;

      if (type === "quantity" && currentQuantity !== selectedOption) {
        setValue("detail.0.quantity", selectedOption);
      } else if (type === "product" && currentProduct !== selectedOption) {
        setValue("detail.0.product", selectedOption);
      }
    },
    [setValue, watch]
  );

  const onSubmit: SubmitHandler<OrdenBody> = async (data) => {
    if (addedProducts.length === 0) {
      toast.error("Por favor agrega un producto.");
      return;
    }
    setActive(true);
    const api = new ApiMethodOrder();
    const cl = selectedClient;
    const values: OrdenBody = {
      ...data,
      detail: addedProducts.map((item) => ({
        product:
          products?.find((p) => p.description === item.product)?._id || "",
        quantity: item.quantity,
      })),
      user: `${process.env.REACT_APP_USER_API}`,
      client: selectedClient._id,
      deliverDate: data.deliverDate.replace(/\//g, "-"),
      clientNotRegistered: {
        address: cl.address,
        district: cl.district,
        fullName: cl.fullName,
        location: cl.location,
        phoneNumber: cl.phoneNumber,
        zone: cl.zone,
      },
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
                    handleOptionChange(selectedOption, "quantity")
                  }
                />
                <OptionScrooll
                  options={products.map((product) => product.name)}
                  onOptionChange={(selectedOption) =>
                    handleOptionChange(selectedOption, "product")
                  }
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
          <div className="relative w-full flex items-center">
            <i className="fa-solid fa-calendar-days text-2xl text-blue_custom absolute cursor-pointer"></i>
            <div className="absolute cursor-pointer">
              <DatePicker
                minDate={new Date()}
                id="FechaPedido"
                selected={
                  watch("deliverDate")
                    ? new Date(watch("deliverDate") as string)
                    : new Date()
                }
                className="opacity-0 w-2/12 cursor-pointer"
                onChange={(date: Date | null) => {
                  if (date) {
                    const formattedDate = date
                      .toISOString()
                      .split("T")[0]
                      .replace(/-/g, "/");
                    setValue("deliverDate", formattedDate as string);
                  }
                }}
                dateFormat={"yyyy/MM/dd"}
                dropdownMode="select"
              />
            </div>
            <input
              {...register("deliverDate")}
              name="deliverDate"
              type={"text"}
              placeholder="Fecha de entrega"
              readOnly
              className="placeholder:text-blue_custom text-blue_custom font-medium outline-0 border-b-2 rounded-none border-blue_custom focus:outline-0 placeholder:text-md placeholder:font-semibold w-full py-2 ps-8"
            />
          </div>

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
              "Realizar Pedido"
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterPedidoForm;
