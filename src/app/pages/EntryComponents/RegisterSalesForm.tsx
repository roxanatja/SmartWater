import React, { useCallback, useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ClientesContext } from "../Contenido/Clientes/ClientesContext";
import { OptionScrooll } from "../components/OptionScrooll/OptionScrooll";
import ApiMethodSales from "../../../Class/api.sales";
import Product from "../../../type/Products/Products";
import { SaleBody } from "../../../type/Sale/Sale";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const RegisterSalesForm = () => {
  const { selectedClient } = useContext(ClientesContext);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [active, setActive] = useState(false);
  const [addedProducts, setAddedProducts] = useState<
    { product: string; quantity: string; price: string }[]
  >([]);

  const { register, handleSubmit, watch, setValue, control } =
    useForm<SaleBody>({
      defaultValues: {
        detail: [{ product: "", quantity: "0", price: "0" }],
        creditSale: false,
      },
    });

  const { append } = useFieldArray({
    control,
    name: "detail",
  });

  const onSubmit: SubmitHandler<SaleBody> = async (data) => {
    if (addedProducts.length === 0) {
      toast.error("Por favor agrega un producto.");
      return;
    }
    setActive(true);
    const api = new ApiMethodSales();
    const values: SaleBody = {
      ...data,
      detail: addedProducts,
      user: selectedClient.code,
      client: selectedClient._id,
      paymentMethodCurrentAccount: false,
    };
    console.log(values);
    try {
      await api.saveSale(values);
      toast.success("Venta registrada");
    } catch (error) {
      toast.error("Upss error al registrar venta");
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
    const product = watch("detail")[0].product;
    const quantity = watch("detail")[0].quantity;
    const price = watch("detail")[0].price;

    if (product && quantity && price) {
      setAddedProducts([...addedProducts, { product, quantity, price }]);
      append({ product: "", quantity: "1", price: "0" });
    }
  };

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
        <div className="flex justify-between w-full items-center border-b border-zinc-300 pb-4">
          <p className="text-md font-semibold">Agregar Productos</p>
          <i className="fa-solid fa-chevron-up"></i>
        </div>
        {/* Credit/Invoice Options */}
        <div className="RegistrarVenta-opciones flex justify-center items-start w-full flex-col">
          <p className="text-md">Seleccione una opción</p>
          <div className="RegistrarVenta-grupo-checbox">
            <div className="RegistrarVenta-grupo-check">
              <input
                className="input-check cursor-pointer"
                type="checkbox"
                id="checkbox1"
                checked={!watch("hasInvoice")}
                onChange={() => {
                  setValue("hasInvoice", false);
                }}
              />
              <label
                htmlFor="checkbox1"
                className="text-check cursor-pointer text-md"
              >
                Factura
              </label>
            </div>
            <div className="RegistrarVenta-grupo-check">
              <input
                className="input-check cursor-pointer"
                type="checkbox"
                id="checkbox2"
                checked={watch("hasInvoice")}
                onChange={() => {
                  setValue("hasInvoice", true);
                }}
              />
              <label
                htmlFor="checkbox2"
                className="text-check cursor-pointer text-md"
              >
                Contado
              </label>
            </div>
            <div className="RegistrarVenta-grupo-check">
              <input
                className="input-check cursor-pointer"
                type="checkbox"
                id="checkbox1"
                checked={watch("creditSale")}
                onChange={() => setValue("creditSale", !watch("creditSale"))}
              />
              <label
                htmlFor="checkbox1"
                className="text-check cursor-pointer text-md"
              >
                Cta. Cte
              </label>
            </div>
          </div>
        </div>

        {/* Product Options */}
        <div className="flex justify-between w-full px-52 text-md font-medium -translate-x-3">
          <p>Cantidad</p>
          <p>Producto</p>
          <p>Precio</p>
        </div>
        <div className="bg-gradient-to-b from-transparentLight via-customLightBlue to-customBlue grid grid-cols-3 rounded-b-2xl w-full py-20 gap-10">
          <OptionScrooll
            options={["1", "2", "3", "4", "5"]}
            className="text-md"
            onOptionChange={(selectedOption) =>
              setValue(`detail.0.quantity`, selectedOption)
            }
          />
          <OptionScrooll
            options={products ? products.map((product) => product.name) : []}
            className="text-md text-nowrap"
            onOptionChange={(selectedOption) => {
              if (products) {
                const selectedProduct = products.find(
                  (product) => product.name === selectedOption
                );
                setValue(`detail.0.product`, selectedProduct?.name || "");
              }
            }}
          />
          <OptionScrooll
            options={["5000", "10000", "300", "4000", "20000"].map((price) => {
              const number = parseFloat(price);
              return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(number);
            })}
            className="text-md"
            onOptionChange={(selectedOption) =>
              setValue(
                `detail.0.price`,
                selectedOption.replace(/[^0-9.-]/g, "")
              )
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

        <div className="relative w-full flex items-center">
          <i className="fa-solid fa-message text-2xl text-blue_custom absolute"></i>
          <input
            {...register("comment")}
            name="comment"
            placeholder="Agregar Comentario"
            className="placeholder:text-blue_custom outline-0 border-b-2 rounded-none border-blue_custom focus:outline-0 placeholder:text-md placeholder:font-semibold w-full py-2 ps-8"
          />
        </div>

        {/* Display Added Products */}
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
    </form>
  );
};

export default RegisterSalesForm;
