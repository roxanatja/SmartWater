import { useState, useCallback, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Product from "../../../type/Products/Products";
import { OptionScrooll } from "../components/OptionScrooll/OptionScrooll";
import { motion } from "framer-motion";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-hot-toast";
import GoogleMapWithSelection from "./GoogleInputMap";
import Input from "./Inputs";
import { Client } from "../../../type/Cliente/Client";
import { UserData } from "../../../type/UserData";
import { OrdersApiConector, ProductsApiConector, UsersApiConector, ZonesApiConector } from "../../../api/classes";
import { District, Zone } from "../../../type/City";
import { IOrderBody, IUpdateOrderBody } from "../../../api/types/orders";
import { AuthService } from "../../../api/services/AuthService";
import { formatIncompletePhoneNumber, isValidPhoneNumber } from "libphonenumber-js";
import { useNavigate } from "react-router-dom";
import { User } from "../../../type/User";
import { Order } from "../../../type/Order/Order";
import { useGlobalContext } from "../../SmartwaterContext";
import { spawn } from "child_process";

const RegisterPedidoForm = ({
  isNoClient,
  selectedClient,
  selectedOrder
}: {
  isNoClient?: boolean;
  selectedClient: Client;
  selectedOrder?: Order;
}) => {
  const Cantidad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const [products, setProducts] = useState<Product[]>([]);
  const [mapview, setMapview] = useState(true);
  const [active, setActive] = useState(false);
  const [editar, setEditar] = useState<{
    quantity: number;
    item: number;
    index: number;
  } | null>(null);

  const navigate = useNavigate()
  const { setLoading } = useGlobalContext()

  const [addedProducts, setAddedProducts] = useState<IOrderBody['data']['detail']>([]);

  const [city, setCity] = useState<Zone[]>([]);
  const [disti, setDisti] = useState<District[]>([]);
  const [dist, setDist] = useState<User[]>([]);

  const getProduct = useCallback(async () => {
    const res = (await ProductsApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || [];
    setProducts(res);

    setDist((await UsersApiConector.get({ pagination: { page: 1, pageSize: 3000 }, filters: { role: "user" } }))?.data || []);
  }, []);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  const {
    register,
    handleSubmit,
    watch, reset,
    setValue, formState: { isValid, errors }
  } = useForm<IOrderBody['data']>({
    defaultValues: {
      detail: [{ product: "", quantity: 0 }],
      deliverDate: "",
    },
    mode: 'all'
  });

  const getCitys = useCallback(async () => {
    const data = (await ZonesApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || [];
    setCity(data);
    let d = data[0];
    setDisti(d.districts);

    if (isNoClient) {
      setValue('clientNotRegistered.district', selectedClient.district, { shouldValidate: true });
      setValue('clientNotRegistered.zone', selectedClient.zone, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue]);

  useEffect(() => {
    if (isNoClient) {
      getCitys();
    }
  }, [getCitys, isNoClient]);

  useEffect(() => {
    if (isNoClient && selectedClient) {
      setValue('clientNotRegistered.address', selectedClient.address, { shouldValidate: true });
      setValue('clientNotRegistered.fullName', selectedClient.fullName, { shouldValidate: true });
      setValue('clientNotRegistered.location.longitude', selectedClient.location?.longitude, { shouldValidate: true });
      setValue('clientNotRegistered.location.latitude', selectedClient.location?.latitude, { shouldValidate: true });
      setValue('clientNotRegistered.phoneNumber', selectedClient.phoneNumber, { shouldValidate: true });
    }
  }, [isNoClient, selectedClient, setValue])

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

    if (data.distributorRedirectId && data.distributorRedirectId === "null") {
      delete data.distributorRedirectId
    }

    setActive(true);
    let res = null

    if (!selectedOrder) {
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
          deliverDate: data.deliverDate.replace(/\//g, "-")
        };
      }

      res = await OrdersApiConector.create({ data: values })
    } else {
      let values: IUpdateOrderBody['data']

      if (isNoClient) {
        values = {
          ...data,
          detail: addedProducts.map((item) => ({
            product: products?.find((p) => p.name === item.product)?._id || "",
            quantity: item.quantity,
          })),
          deliverDate: data.deliverDate.replace(/\//g, "-"),
          clientNotRegistered: {
            address: data.clientNotRegistered.address,
            district: data.clientNotRegistered.district,
            fullName: data.clientNotRegistered.fullName,
            location: data.clientNotRegistered.location,
            phoneNumber: data.clientNotRegistered.phoneNumber,
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
          deliverDate: data.deliverDate.replace(/\//g, "-")
        };

      }

      res = await OrdersApiConector.update({ data: values, orderId: selectedOrder._id })
    }

    if (res) {
      toast.success("Pedido registrado");
      reset();
      setAddedProducts([]);

      navigate("/Pedidos");
    } else {
      toast.error("Upss error al registrar pedido");
    }

    setActive(false);
  };

  useEffect(() => {
    if (selectedOrder) {
      setLoading(true)
    }
  }, [selectedOrder, setLoading])

  useEffect(() => {
    if (selectedOrder && products) {
      setAddedProducts(selectedOrder.detail.map(i => ({
        product: products?.find((p) => p._id === i.product)?.name || "Producto no encontrado",
        quantity: i.quantity,
      })))

      if (selectedOrder.comment) {
        setValue('comment', selectedOrder.comment)
      }
      if (selectedOrder.deliverDate) {
        setValue('deliverDate', new Date(selectedOrder.deliverDate).toISOString().split("T")[0])
      }
      if (selectedOrder.deliverDate) {
        setValue('deliverDate', new Date(selectedOrder.deliverDate).toISOString().split("T")[0])
      }
      if (selectedOrder.distributorRedirectId) {
        setValue('distributorRedirectId', selectedOrder.distributorRedirectId)
      }
      setLoading(false)
    }
  }, [selectedOrder, products, setValue, setLoading])


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="pb-24">
        {!isNoClient && (
          <div className="RegistrarPedido-NombreCliente">
            <div className="RegistrarPedido-Nombre">
              {
                selectedClient.clientImage ?
                  <img
                    src={selectedClient?.clientImage || ""}
                    className="w-8 h-8 rounded-full"
                    alt="storeImage"
                  /> :
                  <div className="bg-blue_custom text-white px-3.5 py-1.5 rounded-full flex justify-center items-center relative">
                    <div className="opacity-0">.</div>
                    <p className="absolute font-extrabold whitespace-nowrap">
                      {selectedClient.fullName?.[0] || "S"}
                    </p>
                  </div>
              }
              <span className="text-font-color">{selectedClient.fullName || "Sin nombre"}</span>
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
            {isNoClient &&
              <>
                <div className="flex flex-col md:flex-row gap-6 w-full">
                  <Input
                    label="Nombre completo"
                    name="clientNotRegistered.fullName"
                    icon={<i className={`fa-solid fa-user text-2xl ${errors?.clientNotRegistered?.fullName && "text-red-500"}`}></i>}
                    register={register}
                    errors={errors.clientNotRegistered?.fullName}
                    required
                  />
                  <Input
                    label="Teléfono"
                    name="clientNotRegistered.phoneNumber"
                    icon={<i className={`fa-solid fa-phone text-2xl ${errors?.clientNotRegistered?.phoneNumber && "text-red-500"}`}></i>}
                    register={register}
                    errors={errors.clientNotRegistered?.phoneNumber}
                    required
                    validateAmount={(value: string) => { if (value && !isValidPhoneNumber(value, "BO")) { return "Número de teléfono incorrecto" } return true }}
                  />
                </div>

                <Input
                  label="Dirección"
                  name="clientNotRegistered.address"
                  icon={<i className={`fa-solid fa-location-dot text-2xl ${errors?.clientNotRegistered?.address && "text-red-500"}`}></i>}
                  register={register}
                  errors={errors.clientNotRegistered?.address}
                />

                <div className="w-full col-span-2 max-sm:col-span-1 relative">
                  <h1 className="text-sm font-medium">
                    Selecciona una ubicación en el mapa
                  </h1>
                  <GoogleMapWithSelection
                    visible={isNoClient}
                    disable={mapview}
                    linkAddress={watch("linkAddress")}
                    latitude={Number(watch("clientNotRegistered.location.latitude"))}
                    longitude={Number(watch("clientNotRegistered.location.longitude"))}
                    onChange={(coordinates: { lat: number; lng: number }) => {
                      setValue("clientNotRegistered.location.latitude", `${coordinates.lat}`);
                      setValue("clientNotRegistered.location.longitude", `${coordinates.lng}`);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setMapview(!mapview)}
                    className="absolute bg-blue-500 text-white py-2 px-8 top-7 rounded-md translate-y-0.5 z-[10] right-14"
                  >
                    {mapview ? "Editar" : "Bloquear"}
                  </button>
                </div>
              </>
            }

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

            <Input
              min={new Date().toISOString().split("T")[0]}
              type="date"
              label="Fecha de entrega"
              labelClassName="text-blue_custom text-md font-semibold"
              iconContainerClassName="!border-0 !ps-1"
              name="deliverDate"
              register={register}
              errors={errors.deliverDate}
              className="full-selector bg-transparent text-blue_custom font-medium !outline-0 border-b-2 rounded-none border-blue_custom focus:outline-0 w-full"
              icon={<img className="w-6 h-6" src="/valid.svg" alt="" />}
            />

            <div className="relative w-full flex items-start">
              <img className="absolute cursor-pointer w-6 h-6 top-2/3 -translate-y-1/2 left-0" src="/distribuidor.svg" alt="" />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.3 }}
                className="w-full flex flex-col gap-2"
              >
                <label className="text-blue_custom font-semibold">Distribuidor</label>
                <select
                  {...register("distributorRedirectId")}
                  className="pl-8 py-2.5 rounded-none font-pricedown bg-main-background text-blue_custom font-medium outline-0 border-b-2 border-blue_custom focus:outline-0"
                >
                  <option className="text-font-color" value={"null"}>Seleccione un distribuidor</option>
                  {dist.length > 0 &&
                    dist.map((city, index) => (
                      <option value={city._id} key={index} className="text-font-color">
                        {city.fullName || "Sin nombre"}
                      </option>
                    ))}
                </select>
                {errors.distributorRedirectId && (
                  <span className="text-red-500 font-normal text-sm font-pricedown">
                    <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                    {errors.distributorRedirectId.message}
                  </span>
                )}
              </motion.div>
            </div>
          </div>

          <button
            type="submit"
            disabled={(!isValid || !watch('deliverDate')) || addedProducts.length === 0}
            className="disabled:bg-gray-400 bg-blue-500 py-2  text-xl px-6 rounded-full text-white font-medium shadow-xl hover:bg-blue-600 fixed bottom-5 right-5 z-50 p-10 w-2/12"
          >
            {active ? (
              <i className="fa-solid fa-spinner animate-spin"></i>
            ) : (
              <span>{selectedOrder ? "Editar" : "Realizar"} Pedido</span>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterPedidoForm;
