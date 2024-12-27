import { useState, useCallback, useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Product from "../../../type/Products/Products";
import { OptionScrooll } from "../components/OptionScrooll/OptionScrooll";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import GoogleMapWithSelection from "./GoogleInputMap";
import Input from "./Inputs";
import { Client } from "../../../type/Cliente/Client";
import { UserData } from "../../../type/UserData";
import { OrdersApiConector, ProductsApiConector, ZonesApiConector } from "../../../api/classes";
import { District, Zone } from "../../../type/City";
import { IOrderBody } from "../../../api/types/orders";
import { AuthService } from "../../../api/services/AuthService";
import { formatIncompletePhoneNumber } from "libphonenumber-js";

const RegisterPedidoForm = ({
  isNoClient,
  selectedClient,
}: {
  isNoClient?: boolean;
  selectedClient: Client;
}) => {
  const Cantidad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const [products, setProducts] = useState<Product[]>([]);
  const [mapview, setMapview] = useState(false);
  const [active, setActive] = useState(false);
  const [editar, setEditar] = useState<{
    quantity: number;
    item: number;
    index: number;
  } | null>(null);

  const [addedProducts, setAddedProducts] = useState<IOrderBody['data']['detail']>([]);

  const [city, setCity] = useState<Zone[]>([]);
  const [disti, setDisti] = useState<District[]>([]);

  const datePickerref = useRef<DatePicker>(null);

  const getProduct = useCallback(async () => {
    const res = (await ProductsApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || [];
    setProducts(res);
  }, []);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  const {
    register,
    handleSubmit,
    watch, reset,
    setValue,
  } = useForm<IOrderBody['data']>({
    defaultValues: {
      detail: [{ product: "", quantity: 0 }],
      deliverDate: "",
    },
  });

  const getCitys = useCallback(async () => {
    const data = (await ZonesApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || [];
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
    if (isNoClient) {
      getCitys();
    }
  }, [getCitys, isNoClient]);

  const handleAddProduct = () => {
    const product = watch("detail")[0].product;
    const quantity = watch("detail")[0].quantity;

    if (editar !== null) {
      const updatedProducts = [...addedProducts];
      updatedProducts[editar.index] = { product, quantity };
      setAddedProducts(updatedProducts);
      setEditar(null);
    } else {
      if (product && quantity) {
        setAddedProducts([...addedProducts, { product, quantity }]);
      }
    }
  };

  const handleDeleteProduct = (index: number) => {
    setAddedProducts(addedProducts.filter((_, i) => i !== index));
  };

  const handleOptionChange = useCallback(
    (selectedOption: string, type: "quantity" | "product") => {
      const currentProduct = watch("detail")[0].product;
      const currentQuantity = watch("detail")[0].quantity;

      if (type === "quantity" && currentQuantity !== parseInt(selectedOption)) {
        setValue("detail.0.quantity", parseInt(selectedOption));
      } else if (type === "product" && currentProduct !== selectedOption) {
        setValue("detail.0.product", selectedOption);
      }
    },
    [setValue, watch]
  );

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (addedProducts.length === 0) {
      toast.error("Por favor agrega un producto.");
      return;
    }

    setActive(true);
    const userData: UserData | null = AuthService.getUser();
    let values: IOrderBody['data']

    if (isNoClient) {
      values = {
        ...data,
        detail: addedProducts.map((item) => ({
          product: products?.find((p) => p.name === item.product)?._id || "",
          quantity: item.quantity,
        })),
        user: userData?._id || "",
        deliverDate: data.deliverDate.replace(/\//g, "-"),
        clientNotRegistered: {
          ...data.clientNotRegistered,
          cityId: userData?.city.id || "",
        },
      };
    } else {
      values = {
        ...data,
        detail: addedProducts.map((item) => ({
          product:
            products?.find((p) => p.name === item.product)?._id || "",
          quantity: item.quantity,
        })),
        user: userData?._id || "",
        client: selectedClient._id,
        deliverDate: data.deliverDate.replace(/\//g, "-"),
        // clientNotRegistered: {
        //   address: cl.address,
        //   district: cl.district,
        //   fullName: cl.fullName,
        //   location: cl.location,
        //   phoneNumber: cl.phoneNumber,
        //   zone: cl.zone,
        //   cityId: userData?.city?.id || '',
        // },
      };
    }

    const res = await OrdersApiConector.create({ data: values })

    if (res) {
      toast.success("Pedido registrado");
      reset();
      setAddedProducts([]);
    } else {
      toast.error("Upss error al registrar pedido");
    }

    setActive(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="pb-24">
        {!isNoClient && (
          <div className="RegistrarPedido-NombreCliente">
            <div className="RegistrarPedido-Nombre">
              {
                selectedClient.storeImage ?
                  <img
                    src={selectedClient?.storeImage || ""}
                    className="w-8 h-8 rounded-full"
                    alt="storeImage"
                  /> :
                  <div className="bg-blue_custom text-white px-3.5 py-1.5 rounded-full flex justify-center items-center">
                    <div className="opacity-0">.</div>
                    <p className="absolute font-extrabold whitespace-nowrap">
                      {selectedClient.fullName?.[0] || "S"}
                    </p>
                  </div>
              }
              <span className="text-font-color">{selectedClient.fullName}</span>
            </div>
            <div
              className="RegistrarPedido-Nombre"
              style={{ gap: "10px", fontWeight: "400" }}
            >
              <i className="fa-brands fa-whatsapp text-xl text-green-500"></i>
              <span className="text-font-color">{formatIncompletePhoneNumber(selectedClient.phoneNumber, "BO")}</span>
            </div>
          </div>
        )}
        <div className="RegistrarPedido-AgregarProducto flex flex-col gap-6 justify-center items-center w-full pb-0">
          <div className="flex justify-between w-full items-center border-b border-zinc-300 pb-4">
            <p className="text-md font-semibold">Agregar Productos</p>
            <i className="fa-solid fa-chevron-up"></i>
          </div>

          <div className="w-full sm:w-3/4 lg:w-2/3 flex flex-col gap-10">
            <div className="grid grid-cols-2 gap-10 w-full text-md font-medium text-center -mb-8">
              <p>Cantidad</p>
              <p>Producto</p>
            </div>
            <div className="bg-gradient-to-b from-transparentLight via-customLightBlue to-customBlue grid grid-cols-2 rounded-b-2xl w-full py-20 gap-10">
              <OptionScrooll
                value={editar?.quantity}
                options={Cantidad}
                onOptionChange={(selectedOption) =>
                  handleOptionChange(selectedOption, "quantity")
                }
              />
              <OptionScrooll
                value={editar?.item}
                options={products.map((product) => product.name)}
                onOptionChange={(selectedOption) =>
                  handleOptionChange(selectedOption, "product")
                }
              />
            </div>

            <div className="text-2xl rounded-2xl w-full flex flex-col items-center gap-2 text-black pr-2.5 shadow-md border p-2 shadow-zinc-300/25">
              <i
                className={`fa-solid  ${editar !== null
                  ? "fa-pen py-3 hover:animate-pulse"
                  : "fa-plus hover:rotate-90"
                  } rounded-full shadow-md shadow-zinc-400/25 px-3 py-2.5 bg-blue_custom text-white transition-all cursor-pointer`}
                onClick={handleAddProduct}
              ></i>
              <p className="text-base font-semibold text-font-color">
                {editar !== null ? "Editar" : "Agregar"} Producto
              </p>
            </div>

            <div className={`w-full`}>
              <div className="max-h-[300px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {addedProducts.map((product, index) => (
                  <motion.div
                    key={index}
                    className={`mb-2 flex justify-between items-center bg-blocks dark:border-blocks shadow-md border shadow-zinc-300/25 rounded-2xl p-2 ${index === editar?.index && "border-2 border-blue_custom"
                      }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col gap-4 p-1">
                      <p>
                        <strong>{product.product}</strong>
                      </p>
                      <div className="flex gap-4 items-center">
                        <p className="text-sm">Cantidad: {product.quantity}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center flex-col pr-4">
                      <button
                        type="button"
                        className="text-blue_custom hover:text-blue-600"
                        onClick={() => {
                          setValue(`detail.0.product`, product.product);
                          setValue(`detail.0.quantity`, product.quantity);
                          const indepro = products
                            ? products.findIndex(
                              (x) => x.name === product.product
                            )
                            : 0;

                          console.log(indepro)
                          setEditar({
                            quantity: Number(product.quantity) - 1,
                            item: indepro,
                            index,
                          });
                        }}
                      >
                        <i className="fa-solid fa-pen"></i>
                      </button>
                      <button
                        type="button"
                        className="text-red-700 hover:text-red-500"
                        onClick={() => handleDeleteProduct(index)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {isNoClient && (
              <>
                <div className="grid grid-cols-3 max-sm:grid-cols-1 w-full gap-2">
                  <div className="relative w-full flex items-center">
                    {/* <i
                    className={`fa-solid fa-user text-2xl text-blue_custom absolute ${
                      errors?.clientNotRegistered?.fullName && "text-red-500"
                    }`}
                  ></i> */}
                    {/* <input
                    {...register("clientNotRegistered.fullName", {
                      required: true,
                    })}
                    name="clientNotRegistered.fullName"
                    placeholder="Nombre Completo"
                    className={`placeholder:text-blue_custom outline-0 border-b-2 rounded-none border-blue_custom focus:outline-0 placeholder:text-md placeholder:font-semibold w-full py-2 ps-8 ${
                      errors?.clientNotRegistered?.fullName &&
                      "placeholder:text-red-500 border-red-500"
                    }`}
                  /> */}
                  </div>

                  <div className="relative w-full flex items-center">
                    {/* <i
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
                  /> */}
                  </div>

                  <div className="relative w-full flex items-center">
                    {/* <i
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
                  /> */}
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
                    {/* <i
                    className={`fa-solid fa-location-dot text-2xl pl-2 text-blue_custom absolute ${
                      errors?.clientNotRegistered?.district && "text-red-500"
                    }`}
                  ></i> */}
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

            <div className="relative w-full flex items-start">
              <i className="fa-solid fa-message text-2xl text-blue_custom absolute pt-2"></i>
              <textarea
                rows={3}
                {...register("comment")}
                name="comment"
                placeholder="Agregar Comentario"
                className="placeholder:text-blue_custom outline-0 border-b-2 rounded-none border-blue_custom focus:outline-0 placeholder:text-md placeholder:font-semibold w-full py-2 ps-8 bg-transparent"
              />
            </div>

            <div className="relative w-full flex items-center">
              <i className="fa-solid fa-calendar-days text-2xl text-blue_custom absolute cursor-pointer"></i>
              <div className="absolute cursor-pointer"
                onClick={() => {
                  if (datePickerref.current) {
                    datePickerref.current.setOpen(true)
                  }
                }}>
                <DatePicker
                  ref={datePickerref}
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
                  calendarClassName="bg-blocks dark:border-blocks"
                  dateFormat={"yyyy/MM/dd"}
                  dropdownMode="select"
                />
              </div>
              <input
                onClick={() => {
                  if (datePickerref.current) {
                    datePickerref.current.setOpen(true)
                  }
                }}
                {...register("deliverDate")}
                name="deliverDate"
                type={"text"}
                placeholder="Fecha de entrega"
                readOnly
                className="bg-transparent placeholder:text-blue_custom text-blue_custom font-medium outline-0 border-b-2 rounded-none border-blue_custom focus:outline-0 placeholder:text-md placeholder:font-semibold w-full py-2 ps-8"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!watch('deliverDate') || addedProducts.length === 0}
            className="disabled:bg-gray-400 outline outline-2 bg-blue-500 py-2  text-xl px-6 rounded-full text-white font-medium shadow-xl hover:bg-blue-600 fixed bottom-5 right-5 z-50 p-10 w-2/12"
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
