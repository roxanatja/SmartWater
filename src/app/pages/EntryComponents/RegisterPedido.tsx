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
import { District, Zone } from "../../../Class/types.data";
import GetApiMethod from "../../../Class/api.class";
import GoogleMapWithSelection from "./GoogleInputMap";
import Input from "./Inputs";

const RegisterPedidoForm = ({ isNoClient }: { isNoClient?: boolean }) => {
  const { selectedClient } = useContext(ClientesContext);
  const Cantidad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const [products, setProducts] = useState<Product[]>([]);
  const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(true);
  const [mapview, setMapview] = useState(false);
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const [addedProducts, setAddedProducts] = useState<
    { product: string; quantity: string }[]
  >([]);
  const [city, setCity] = useState<Zone[]>([]);
  const [disti, setDisti] = useState<District[]>([]);

  const getProduct = useCallback(async () => {
    const api = new ApiMethodSales();
    const res = await api.GetProducts();
    setProducts(res);
  }, []);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  useEffect(() => {
    if (!isNoClient && selectedClient._id === "") {
      navigate("/Clientes");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClient]);

  const handleOpcionesClick = () => {
    setOpcionesVisibles(!opcionesVisibles);
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<OrdenBody>({
    defaultValues: {
      detail: [{ product: "", quantity: "0" }],
      deliverDate: "",
    },
  });

  const { append } = useFieldArray({
    control,
    name: "detail",
  });

  const getCitys = useCallback(async () => {
    const api = new GetApiMethod();
    const data = await api.getZone();
    setCity(data);
    let d = data[0];
    setDisti(d.districts);
    if (isNoClient) {
      setValue("clientNotRegistered.zone", d._id);
      setValue("clientNotRegistered.district", d.districts[0]._id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue]);

  useEffect(() => {
    getCitys();
  }, [getCitys]);

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
    if (isNoClient) {
      const values: OrdenBody = {
        ...data,
        detail: addedProducts.map((item) => ({
          product:
            products?.find((p) => p.description === item.product)?._id || "",
          quantity: item.quantity,
        })),
        user: `${process.env.REACT_APP_USER_API}`,
        deliverDate: data.deliverDate.replace(/\//g, "-"),
      };
      try {
        await api.saveOrder(values);
        toast.success("Pedido registrado");
      } catch (error) {
        toast.error("Upss error al registrar pedido");
        console.error(error);
      } 
      setActive(false);
      return;
    }
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
        {!isNoClient && (
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
        )}
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

          {isNoClient && (
            <>
              <div className="grid grid-cols-3 max-sm:grid-cols-1 w-full gap-2">
                <div className="relative w-full flex items-center">
                  <i
                    className={`fa-solid fa-user text-2xl text-blue_custom absolute ${
                      errors?.clientNotRegistered?.fullName && "text-red-500"
                    }`}
                  ></i>
                  <input
                    {...register("clientNotRegistered.fullName", {
                      required: true,
                    })}
                    name="clientNotRegistered.fullName"
                    placeholder="Nombre Completo"
                    className={`placeholder:text-blue_custom outline-0 border-b-2 rounded-none border-blue_custom focus:outline-0 placeholder:text-md placeholder:font-semibold w-full py-2 ps-8 ${
                      errors?.clientNotRegistered?.fullName &&
                      "placeholder:text-red-500 border-red-500"
                    }`}
                  />
                </div>

                <div className="relative w-full flex items-center">
                  <i
                    className={`fa-solid fa-phone text-2xl text-blue_custom absolute ${
                      errors?.clientNotRegistered?.phoneNumber && "text-red-500"
                    }`}
                  ></i>
                  <input
                    {...register("clientNotRegistered.phoneNumber", {
                      required: true,
                    })}
                    name="clientNotRegistered.phoneNumber"
                    placeholder="Numero de Telefono"
                    className={`placeholder:text-blue_custom outline-0 border-b-2 rounded-none border-blue_custom focus:outline-0 placeholder:text-md placeholder:font-semibold w-full py-2 ps-8 ${
                      errors?.clientNotRegistered?.phoneNumber &&
                      "placeholder:text-red-500 border-red-500"
                    }`}
                  />
                </div>

                <div className="relative w-full flex items-center">
                  <i
                    className={`fa-solid fa-location-dot text-2xl text-blue_custom absolute ${
                      errors?.clientNotRegistered?.address && "text-red-500"
                    }`}
                  ></i>
                  <input
                    {...register("clientNotRegistered.address", {
                      required: true,
                    })}
                    name="clientNotRegistered.address"
                    placeholder="Dirrecion"
                    className={`placeholder:text-blue_custom outline-0 border-b-2 rounded-none border-blue_custom focus:outline-0 placeholder:text-md placeholder:font-semibold w-full py-2 ps-8 ${
                      errors?.clientNotRegistered?.address &&
                      "placeholder:text-red-500 border-red-500"
                    }`}
                  />
                </div>
              </div>
            </>
          )}

          {isNoClient && (
            <>
              <div className="flex flex-row gap-4 w-full justify-start items-center">
                <div className="relative flex items-center">
                  <i
                    className={`fa-solid fa-location-crosshairs text-2xl pl-2 text-blue_custom absolute `}
                  ></i>
                  <select
                    {...register("clientNotRegistered.zone", {
                      required: "se requiere una zona",
                      onChange: (e) => {
                        const da = city.find((x) => x._id === e.target.value);
                        if (da && da.districts.length > 0) {
                          setDisti(da.districts);
                          setValue(
                            "clientNotRegistered.district",
                            da.districts?.[0]?._id || ""
                          );
                        } else {
                          setDisti([]);
                        }
                      },
                    })}
                    className="p-2 px-6 ps-10 py-2.5 rounded-md font-pricedown focus:outline-4 bg-transparent outline outline-2 outline-blue_custom font-medium  text-blue_custom"
                  >
                    {city.length > 0 &&
                      city.map((city, index) => (
                        <option value={city._id} key={index}>
                          {city.name}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="relative flex items-center">
                  <i
                    className={`fa-solid fa-location-dot text-2xl pl-2 text-blue_custom absolute ${
                      errors?.clientNotRegistered?.district && "text-red-500"
                    }`}
                  ></i>
                  <select
                    {...register("clientNotRegistered.district")}
                    className="p-2 px-6 ps-10 py-2.5 rounded-md font-pricedown focus:outline-4 bg-transparent outline outline-2 outline-blue_custom font-medium  text-blue_custom"
                  >
                    {disti && disti.length > 0 ? (
                      disti.map((row, index) => (
                        <option value={row._id} key={index}>
                          {row.name}
                        </option>
                      ))
                    ) : (
                      <option value={"null"}>Sin resultados</option>
                    )}
                  </select>
                </div>
              </div>
            </>
          )}

          {isNoClient && (
            <>
              <div
                className="RegistrarPedido-AgregarProductoTitulo border-b-2 border-blue_custom pb-2 cursor-pointer"
                onClick={() => {
                  setMapview(!mapview);
                }}
              >
                <div className="text-md text-blue_custom flex gap-2 items-center">
                  <i className="fa-solid text-xl fa-location-dot text-blue_custom"></i>
                  <p className="text-base">Agregar ubicacion</p>
                </div>
                <button
                  type="button"
                  className={
                    mapview
                      ? "RegistrarPedido-btnAgregarProducto AgregarProductoactive-btn"
                      : "RegistrarPedido-btnAgregarProducto"
                  }
                >
                  <span className="material-symbols-outlined">expand_more</span>
                </button>
              </div>

              {mapview && (
                <div className="w-full col-span-2 max-sm:col-span-1">
                  <div className="flex flex-col w-full gap-2">
                    <Input
                      label="Enlace de ubicación"
                      name="linkAddress"
                      placeholder="(Opcional)"
                      register={register}
                      icon={<i className="fa-solid fa-location-dot"></i>}
                    />
                    <h1 className="text-sm font-medium">
                      Selecciona una ubicación en el mapa
                    </h1>
                    <GoogleMapWithSelection
                      visible={isNoClient}
                      linkAddress={watch("linkAddress")}
                      latitude={Number(
                        watch("clientNotRegistered.location.latitude")
                      )}
                      longitude={Number(
                        watch("clientNotRegistered.location.longitude")
                      )}
                      onChange={(coordinates: { lat: number; lng: number }) => {
                        setValue(
                          "clientNotRegistered.location.latitude",
                          `${coordinates.lat}`
                        );
                        setValue(
                          "clientNotRegistered.location.longitude",
                          `${coordinates.lng}`
                        );
                      }}
                    />
                  </div>
                </div>
              )}
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
