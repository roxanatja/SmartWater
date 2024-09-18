import React, { useCallback, useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ClientesContext } from "../Contenido/Clientes/ClientesContext";
import { OptionScrooll } from "../components/OptionScrooll/OptionScrooll";
import ApiMethodSales from "../../../Class/api.sales";
import Product from "../../../type/Products/Products";
import { Sale } from "../../../type/Sale/Sale";
import { motion } from "framer-motion";
import Input from "./Inputs";

const RegisterSalesForm = () => {
  const { selectedClient, setRegisterSale } = useContext(ClientesContext);
  const [products, setProducts] = useState<Product[] | null>(null);
  const [addedProducts, setAddedProducts] = useState<
    { product: string; quantity: number; price: number }[]
  >([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<Sale>({
    defaultValues: {
      detail: [{ product: "", quantity: 1, price: 0, _id: "" }],
      creditSale: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detail",
  });

  const onSubmit: SubmitHandler<Sale> = async (data) => {
    console.log(data);
    // setRegisterSale(false);
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
      append({ product: "", quantity: 1, price: 0, _id: "" });
    }
  };

  const handleDeleteProduct = (index: number) => {
    setAddedProducts(addedProducts.filter((_, i) => i !== index));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 justify-center items-center w-full"
    >
      <div className="flex flex-col gap-6 justify-center items-center w-full p-6">
        {/* Client Information */}
        <div className="flex justify-start items-center w-full gap-2 pt-2">
          <img
            src={selectedClient?.storeImage || ""}
            className="w-8 h-8 rounded-full"
            alt="storeImage"
          />
          <p className="text-sm">{selectedClient?.fullName || "N/A"}</p>
        </div>

        {/* Credit/Invoice Options */}
        <div className="RegistrarVenta-opciones flex justify-center items-start w-full flex-col">
          <span>Seleccione una opción</span>
          <div className="RegistrarVenta-grupo-checbox">
            <div className="RegistrarVenta-grupo-check">
              <input
                className="input-check cursor-pointer"
                type="checkbox"
                id="checkbox1"
                checked={!watch("creditSale")}
                onChange={() => setValue("creditSale", !watch("creditSale"))}
              />
              <label htmlFor="checkbox1" className="text-check cursor-pointer">
                Factura
              </label>
            </div>
            <div className="RegistrarVenta-grupo-check">
              <input
                className="input-check cursor-pointer"
                type="checkbox"
                id="checkbox2"
                checked={watch("creditSale")}
                onChange={() => setValue("creditSale", !watch("creditSale"))}
              />
              <label htmlFor="checkbox2" className="text-check cursor-pointer">
                Contado
              </label>
            </div>
          </div>
        </div>

        {/* Product Options */}
        <div className="flex justify-between w-full px-12 text-sm font-medium">
          <p>Cantidad</p>
          <p>Producto</p>
          <p>Precio</p>
        </div>
        <div className="bg-gradient-to-b from-transparentLight via-customLightBlue to-customBlue grid grid-cols-3 rounded-b-2xl w-full py-4 gap-10">
          <OptionScrooll
            options={["1", "2", "3", "4", "5"]}
            className="text-base"
            onOptionChange={(selectedOption) =>
              setValue(`detail.0.quantity`, parseInt(selectedOption))
            }
          />
          <OptionScrooll
            options={products ? products.map((product) => product.name) : []}
            className="text-base text-nowrap"
            onOptionChange={(selectedOption) => {
              if (products) {
                const selectedProduct = products.find(
                  (product) => product.name === selectedOption
                );
                setValue(`detail.0.product`, selectedProduct?.name || "");
                setValue(`detail.0._id`, selectedProduct?._id || "");
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
            className="text-base"
            onOptionChange={(selectedOption) =>
              setValue(
                `detail.0.price`,
                parseFloat(selectedOption.replace(/[^0-9.-]/g, ""))
              )
            }
          />
        </div>

        <button
          type="button"
          className="border border-blue_custom text-2xl rounded-full flex items-center gap-2 text-black pr-2.5 group hover:bg-blue_custom/10"
          onClick={handleAddProduct}
        >
          <i className="fa-solid fa-plus rounded-full shadow-2xl shadow-white px-3 py-2.5 bg-blue_custom text-white group-hover:rotate-90 transition-all"></i>
          <p className="text-base"> Agregar Producto</p>
        </button>

        <Input register={register} name="comment" errors={errors.comment} />

        {/* Display Added Products */}
        <div className={`${addedProducts.length > 0 && "mt-4"} w-full`}>
          {addedProducts.length > 0 && (
            <h3 className="text-lg font-bold">Productos Agregados:</h3>
          )}
          <ul className="list-disc pl-5">
            {addedProducts.map((product, index) => (
              <motion.li
                key={index}
                className="mb-2 flex justify-between items-center bg-white border-zinc-300 border shadow-md rounded-xl p-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div>
                  <p>
                    <strong>Producto:</strong> {product.product}
                  </p>
                  <p>
                    <strong>Cantidad:</strong> {product.quantity}
                  </p>
                  <p>
                    <strong>Precio:</strong>{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(product.price)}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteProduct(index)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </form>
  );
};

export default RegisterSalesForm;
