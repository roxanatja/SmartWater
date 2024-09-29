import React, { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { OptionScrooll } from "../components/OptionScrooll/OptionScrooll";
import ApiMethodSales from "../../../Class/api.sales";
import Product from "../../../type/Products/Products";
import { SaleBody } from "../../../type/Sale/Sale";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Client } from "../../../type/Cliente/Client";
import { UserData } from "../../../type/UserData";
import AuthenticationService from "../../../services/AuthenService";

const RegisterSalesForm = ({ selectedClient }: { selectedClient: Client }) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const [addedProducts, setAddedProducts] = useState<
    { product: string; quantity: string; price: string }[]
  >([]);
  const [editar, setEditar] = useState<{
    quantity: number;
    item: number;
    index: number;
  } | null>(null);

  const { register, handleSubmit, watch, setValue, control } =
    useForm<SaleBody>({
      defaultValues: {
        detail: [{ product: "", quantity: "0", price: "0" }],
        creditSale: false,
        hasInvoice: false,
        paymentMethodCurrentAccount: false,
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

  const onSubmit: SubmitHandler<SaleBody> = async (data) => {
    if (addedProducts.length === 0) {
      toast.error("Por favor agrega un producto.");
      return;
    }
    setActive(true);
    const api = new ApiMethodSales();
    const auth = AuthenticationService;
    const userData: UserData = auth.getUser();
    const values: SaleBody = {
      ...data,
      detail: addedProducts.map((item) => ({
        product:
          products?.find((p) => p.description === item.product)?._id || "",
        quantity: item.quantity,
        price: `${parseInt(item.price)}`,
      })),
      user: userData._id,
      client: selectedClient._id,
    };
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
    if (editar !== null) {
      const updatedProducts = [...addedProducts];
      updatedProducts[editar.index] = { product, quantity, price };
      setAddedProducts(updatedProducts);
      setEditar(null);
    } else {
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
                checked={watch("hasInvoice")}
                onChange={() => {
                  setValue("hasInvoice", !watch("hasInvoice"));
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
                checked={watch("creditSale")}
                onChange={() => {
                  setValue("creditSale", !watch("creditSale"));
                  setValue("paymentMethodCurrentAccount", false);
                }}
              />
              <label
                htmlFor="checkbox2"
                className="text-check cursor-pointer text-md"
              >
                Credito
              </label>
            </div>
            <div className="RegistrarVenta-grupo-check">
              <input
                className="input-check cursor-pointer"
                type="checkbox"
                id="checkbox1"
                checked={watch("paymentMethodCurrentAccount")}
                onChange={() => {
                  setValue(
                    "paymentMethodCurrentAccount",
                    !watch("paymentMethodCurrentAccount")
                  );
                  setValue("creditSale", false);
                }}
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
            options={["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]}
            value={editar?.quantity}
            className="text-md"
            onOptionChange={(selectedOption) =>
              setValue(`detail.0.quantity`, selectedOption)
            }
          />
          <OptionScrooll
            options={products ? products.map((product) => product.name) : []}
            className="text-md text-nowrap"
            value={editar?.item}
            onOptionChange={(selectedOption) => {
              if (products) {
                const selectedProduct = products.find(
                  (product) => product.name === selectedOption
                );
                setValue(`detail.0.product`, selectedProduct?.name || "");
                if (selectedProduct) {
                  setValue(`detail.0.price`, selectedProduct.price.toString());
                }
              }
            }}
          />
          <OptionScrooll
            options={
              products && watch(`detail.0.product`)
                ? products
                    .filter((x) => x.name === watch(`detail.0.product`))
                    .map((product) => product.price.toString())
                : []
            }
            className="text-md"
            onOptionChange={(selectedOption) => {
              const priceValue = parseFloat(selectedOption);
              setValue(`detail.0.price`, priceValue.toString());
            }}
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
                    <strong>{product.product}</strong>
                  </p>
                  <div className="flex gap-4 items-center">
                    <p className="text-sm">Cantidad: {product.quantity}</p>
                    <p className="text-sm">Precio: {product.price}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-blue_custom hover:text-blue-600 -translate-y-6"
                    onClick={() => {
                      setValue(`detail.0.product`, product.product);
                      setValue(`detail.0.price`, product.price);
                      setValue(`detail.0.quantity`, product.quantity);
                      const indepro = products
                        ? products.findIndex(
                            (x) => x.description === product.product
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
