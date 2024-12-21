import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { OptionScrooll } from "../components/OptionScrooll/OptionScrooll";
import ApiMethodSales from "../../../Class/api.sales";
import Product from "../../../type/Products/Products";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ApiMethodLoans from "../../../Class/api.loans";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ImageUploadField from "./ImageUploadField";
import { Client } from "../../../type/Cliente/Client";
import { UserData } from "../../../type/UserData";
import AuthenticationService from "../../../services/AuthenService";

const RegisterPrestaForm = ({ selectedClient }: { selectedClient: Client }) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const [addedProducts, setAddedProducts] = useState<
    { item: string; quantity: string }[]
  >([]);
  const [editar, setEditar] = useState<{
    quantity: number;
    item: number;
    index: number;
  } | null>(null);
  const [views, setWiews] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      detail: [{ item: "", quantity: "0" }],
      contract: {
        link: null,
        validUntil: "",
      },
    },
  });

  useEffect(() => {
    if (selectedClient._id === "") {
      navigate("/Clientes");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClient]);

  const { append } = useFieldArray({
    control,
    name: "detail",
  });

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (addedProducts.length === 0) {
      toast.error("Por favor agrega un producto.");
      return;
    }
    setActive(true);
    const api = new ApiMethodLoans();
    const auth = AuthenticationService;
    const userData: UserData = auth.getUser();
    const values: any = {
      ...data,
      detail: addedProducts.map((item) => ({
        item: products?.find((p) => p.description === item.item)?._id || "",
        quantity: item.quantity,
      })),
      user: userData._id,
      client: selectedClient._id,
    };
    try {
      await api.saveLoans(values);
      reset();
      setAddedProducts([]);
      toast.success("Prestamo registrado");
    } catch (error) {
      toast.error("Upss error al registrar prestamo");
      console.error(error);
    }
    setActive(false);
  };

  const getProduct = useCallback(async () => {
    const api = new ApiMethodSales();
    const res = await api.GetProducts();
    setProducts(res);
  }, []);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  const handleAddProduct = () => {
    const item = watch("detail")[0].item;
    const quantity = watch("detail")[0].quantity;
    if (editar !== null) {
      const updatedProducts = [...addedProducts];
      updatedProducts[editar.index] = { item, quantity };
      setAddedProducts(updatedProducts);
      setEditar(null);
    } else {
      setAddedProducts([...addedProducts, { item, quantity }]);
      append({ item: "", quantity: "1" });
    }
  };

  const handleOptionChange = useCallback(
    (selectedOption: string, type: "quantity" | "item") => {
      const currentProduct = watch("detail")[0].item;
      const currentQuantity = watch("detail")[0].quantity;

      if (type === "quantity" && currentQuantity !== selectedOption) {
        setValue("detail.0.quantity", selectedOption);
      } else if (type === "item" && currentProduct !== selectedOption) {
        setValue("detail.0.item", selectedOption);
      }
    },
    [setValue, watch]
  );

  const handleDeleteProduct = (index: number) => {
    setAddedProducts(addedProducts.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 justify-center items-center w-full"
    >
      <div className="flex flex-col gap-6 justify-center items-center w-full px-6 pb-0">
        {/* Client Information */}
        <div className="flex justify-start items-center w-full gap-2 pt-2">
          <img
            src={selectedClient?.storeImage || ""}
            className="w-8 h-8 rounded-full"
            alt="storeImage"
          />
          <p className="text-sm">{selectedClient?.fullName || "N/A"}</p>
        </div>
        <div
          className="flex justify-between w-full items-center border-b border-zinc-300 pb-4 cursor-pointer"
          onClick={() => setWiews(!views)}
        >
          <p className="text-md font-semibold">Agregar Productos</p>
          <i
            className={`fa-solid fa-chevron-up ${
              !views && "rotate-180"
            } transition-all`}
          ></i>
        </div>

        {views && (
          <>
            {/* Product Options */}
            <div className="flex justify-between w-full px-80 text-md font-medium -translate-x-3">
              <p>Cantidad</p>
              <p>Producto</p>
            </div>
            <div className="bg-gradient-to-b from-transparentLight via-customLightBlue to-customBlue grid grid-cols-2 rounded-b-2xl w-full py-20 gap-10">
              <OptionScrooll
                options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
                value={editar?.quantity}
                onOptionChange={(selectedOption) =>
                  handleOptionChange(selectedOption, "quantity")
                }
              />
              <OptionScrooll
                options={
                  products ? products.map((product) => product.name) : []
                }
                value={editar?.item}
                onOptionChange={(selectedOption) =>
                  handleOptionChange(selectedOption, "item")
                }
              />
            </div>

            <div className="text-2xl rounded-2xl w-full flex flex-col items-center gap-2 text-black pr-2.5 shadow-md border p-2 shadow-zinc-300">
              <i
                className={`fa-solid  ${
                  editar !== null
                    ? "fa-pen py-3 hover:animate-pulse"
                    : "fa-plus hover:rotate-90"
                } rounded-full shadow-md shadow-zinc-400 px-3 py-2.5 bg-blue_custom text-white  transition-all cursor-pointer`}
                onClick={handleAddProduct}
              ></i>
              <p className="text-base font-semibold">
                {editar !== null ? "Editar" : "Agregar"} Producto
              </p>
            </div>

            {/* Display Added Products */}
            <div className={`${addedProducts.length > 0 && "mt-4"} w-full`}>
              <ul className="list-disc max-h-72 overflow-y-scroll">
                {addedProducts.map((product, index) => (
                  <motion.li
                    key={index}
                    className={`mb-2 flex justify-between items-center bg-white shadow-md border shadow-zinc-300 rounded-2xl p-2 ${
                      index === editar?.index && "border-2 border-blue_custom"
                    }`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col gap-4 p-1">
                      <p>
                        <strong>{product.item}</strong>
                      </p>
                      <p className="text-sm">Cantidad:{product.quantity}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="text-blue_custom hover:text-blue-600 -translate-y-6"
                        onClick={() => {
                          handleOptionChange(product.item, "item");
                          handleOptionChange(product.quantity, "quantity");
                          const indepro = products
                            ? products.findIndex(
                                (x) => x.description === product.item
                              )
                            : 0;
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
                        className="text-red-700 hover:text-red-500 -translate-y-6"
                        onClick={() => handleDeleteProduct(index)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </>
        )}

        <div className="relative w-full flex items-center">
          <i className="fa-solid fa-calendar-days text-2xl text-blue_custom absolute cursor-pointer"></i>
          <div className="absolute cursor-pointer">
            <DatePicker
              minDate={new Date()}
              id="FechaPedido"
              selected={
                watch("contract.validUntil")
                  ? new Date(watch("contract.validUntil") as string)
                  : new Date()
              }
              className="opacity-0 w-2/12 cursor-pointer"
              onChange={(date: Date | null) => {
                if (date) {
                  const today = new Date().setHours(0, 0, 0, 0);
                  const selectedDate = new Date(date).setHours(0, 0, 0, 0);

                  if (selectedDate === today) {
                    toast.error("No puedes seleccionar la fecha de hoy");
                    setValue("contract.validUntil", "");
                    return;
                  }

                  const formattedDate = date
                    .toISOString()
                    .split("T")[0]
                    .replace(/-/g, "-");
                  setValue("contract.validUntil", formattedDate as string);
                }
              }}
              dateFormat={"yyyy-MM-dd"}
              dropdownMode="select"
            />
          </div>
          <input
            {...register("contract.validUntil")}
            name="deliverDate"
            type={"text"}
            placeholder="Valido hasta"
            readOnly
            className="placeholder:text-blue_custom text-blue_custom font-medium outline-0 border-b-2 rounded-none border-blue_custom focus:outline-0 placeholder:text-md placeholder:font-semibold w-full py-2 ps-8"
          />
        </div>

        <div className="relative w-full flex items-center">
          <i className="fa-solid fa-message text-2xl text-blue_custom absolute"></i>
          <input
            {...register("comment")}
            name="comment"
            placeholder="Agregar Comentario"
            className="placeholder:text-blue_custom outline-0 border-b-2 rounded-none border-blue_custom focus:outline-0 placeholder:text-md placeholder:font-semibold w-full py-2 ps-8"
          />
        </div>

        <ImageUploadField
          watchField={watch}
          fieldName={"contract.link"}
          label={"Porfavor, adjunta la imagen del contrato"}
          register={register}
          setValue={setValue}
          errors={errors}
          required={false}
        />
        <button
          type="submit"
          className=" outline outline-2 outline-blue-500 bg-blue-500 py-2  text-xl px-6 rounded-full text-white font-medium shadow-xl hover:bg-blue-600 fixed bottom-5 right-5 z-50 p-10 w-2/12"
        >
          {active ? (
            <i className="fa-solid fa-spinner animate-spin"></i>
          ) : (
            "Registrar Prestamo"
          )}
        </button>
      </div>
    </form>
  );
};

export default RegisterPrestaForm;
