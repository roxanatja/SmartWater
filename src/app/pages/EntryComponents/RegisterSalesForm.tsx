import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Product from "../../../type/Products/Products";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Client } from "../../../type/Cliente/Client";
import { UserData } from "../../../type/UserData";
import { ISaleBody } from "../../../api/types/sales";
import { ProductsApiConector, SalesApiConector } from "../../../api/classes";
import { AuthService } from "../../../api/services/AuthService";
import { useNavigate } from "react-router-dom";
import { Sale } from "../../../type/Sale/Sale";
import { useGlobalContext } from "../../SmartwaterContext";
import DecimalOptionScroll from "../components/OptionScrooll/DecimalOptionScroll";
import { NumericOptionScrooll } from "../components/OptionScrooll/NumericOptionScroll";
import { SelectableOptionScrooll } from "../components/OptionScrooll/SelectableOptionScrooll";

const RegisterSalesForm = ({ selectedClient, selectedSale }: {
  selectedClient: Client;
  selectedSale?: Sale;
}) => {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [active, setActive] = useState(false);

  const [addedProducts, setAddedProducts] = useState<ISaleBody['data']['detail']>([]);
  const navigate = useNavigate()
  const { setLoading } = useGlobalContext()

  const [editar, setEditar] = useState<{
    quantity: number;
    item: number;
    price: number;
    index: number;
  } | null>(null);

  const { register, handleSubmit, watch, setValue, reset } =
    useForm<ISaleBody['data']>({
      defaultValues: {
        detail: [],
        creditSale: false,
        hasInvoice: false,
        paymentMethodCurrentAccount: false,
        forceOut: false
      },
    });

  const onSubmit: SubmitHandler<ISaleBody['data']> = async (data) => {
    if (addedProducts.length === 0) {
      toast.error("Por favor agrega un producto.");
      return;
    }

    setActive(true);
    const userData: UserData | null = AuthService.getUser();

    const values: ISaleBody['data'] = {
      ...data,
      detail: addedProducts.map((item) => ({
        product:
          products?.find((p) => p.name === item.product)?._id || "",
        quantity: item.quantity,
        price: `${parseFloat(item.price)}`,
      })),
      user: userData?._id || "",
      zone: selectedClient.zone,
      client: selectedClient._id,
    };
    let res = null

    if (selectedSale) {
      res = await SalesApiConector.update({ data: values, saleId: selectedSale._id });
    } else {
      res = await SalesApiConector.create({ data: values });
    }

    if (res) {
      if ('error' in res) {
        toast.error(
          (t) => (
            <div>
              <p className="mb-4 text-center text-[#888]">
                No hay saldos suficiente en invenatario para hacer este movimiento, <br /> pulsa <b>Proceder</b> para forzar su registro
              </p>
              <div className="flex justify-center">
                <button
                  className="bg-red-500 px-3 py-1 rounded-lg ml-2 text-white"
                  onClick={() => {
                    toast.dismiss(t.id);
                    toast.error("Venta no registrada");
                    reset();
                    setAddedProducts([]);
                    navigate("/Ventas", { replace: true })
                  }}
                >
                  Cancelar
                </button>
                <button
                  className="bg-blue_custom px-3 py-1 rounded-lg ml-2 text-white"
                  onClick={async () => {
                    toast.dismiss(t.id);
                    let resp2 = null

                    if (selectedSale) {
                      resp2 = await SalesApiConector.update({ data: { ...values, forceOut: true }, saleId: selectedSale._id });
                    } else {
                      resp2 = await SalesApiConector.create({ data: { ...values, forceOut: true } });
                    }

                    if (resp2) {
                      toast.success(`Venta ${selectedSale ? "editada" : "registrada"}`);
                      reset();
                      setAddedProducts([]);

                      navigate("/Ventas", { replace: true })
                      // window.location.reload()
                    } else {
                      toast.error("Upss error al registrar venta");
                    }
                  }}
                >
                  Proceder
                </button>
              </div>
            </div>
          ),
          {
            className: "shadow-md dark:shadow-slate-400 border border-slate-100 bg-main-background",
            icon: null,
            position: "top-center"
          }
        );
      } else {
        toast.success(`Venta ${selectedSale ? "editada" : "registrada"}`);
        reset();
        setAddedProducts([]);

        navigate("/Ventas", { replace: true })
      }
    } else {
      toast.error("Upss error al registrar venta");
    }

    setActive(false);
  };

  const getProduct = useCallback(async () => {
    const res = (await ProductsApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || [];
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
    }
  };

  const handleDeleteProduct = (index: number) => {
    setAddedProducts(addedProducts.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (selectedSale) {
      setLoading(true)
    }
  }, [selectedSale, setLoading])

  useEffect(() => {
    if (selectedSale && products) {
      setAddedProducts(selectedSale.detail.map(i => {
        const prod = products?.find((p) => p._id === i.product)
        return {
          product: prod?.name || "Producto no encontrado",
          quantity: i.quantity,
          price: prod?.price ? String(prod.price) : "0"
        }
      }))

      if (selectedSale.comment) {
        setValue('comment', selectedSale.comment)
      }
      if (selectedSale.hasInvoice) {
        setValue('hasInvoice', selectedSale.hasInvoice, { shouldValidate: true })
      }
      if ('creditSale' in selectedSale) {
        setValue('creditSale', selectedSale.creditSale, { shouldValidate: true })
      }
      if ('paymentMethodCurrentAccount' in selectedSale) {
        setValue('paymentMethodCurrentAccount', !!selectedSale.paymentMethodCurrentAccount, { shouldValidate: true })
      }
      setLoading(false)
    }
  }, [selectedSale, products, setLoading, setValue])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 justify-center items-center w-full pb-24"
    >
      <div className="flex flex-col gap-6 justify-center items-center w-full px-6 pb-0">
        {/* Client Information */}
        <div className="flex justify-start items-center w-full gap-2 pt-2">
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
          <p className="text-sm">{selectedClient?.fullName || "Sin nombre"}</p>
        </div>
        <div className="flex justify-between w-full items-center border-b border-zinc-300 pb-4">
          <p className="text-md font-semibold">Agregar Productos</p>
          <i className="fa-solid fa-chevron-up"></i>
        </div>
        {/* Credit/Invoice Options */}
        <div className="RegistrarVenta-opciones flex justify-center items-start w-full flex-col">
          <p className="text-md text-font-color">Seleccione una opción</p>
          <div className="RegistrarVenta-grupo-checbox">
            <div className="RegistrarVenta-grupo-check text-font-color">
              <input
                className="input-check cursor-pointer accent-blue-600"
                type="checkbox"
                id="checkbox1"
                checked={watch("hasInvoice")}
                onChange={() => {
                  setValue("hasInvoice", !watch("hasInvoice"));
                }}
              />
              <label
                htmlFor="checkbox1"
                className="text-check text-inherit cursor-pointer text-md"
              >
                Factura
              </label>
            </div>
            <div className="RegistrarVenta-grupo-check text-font-color">
              <input
                className="input-check cursor-pointer accent-blue-600"
                type="checkbox"
                id="checkbox2"
                checked={watch("creditSale")}
                onChange={() => {
                  const credit = watch("creditSale")
                  setValue("creditSale", !credit);
                  setValue("paymentMethodCurrentAccount", false);
                }}
              />
              <label
                htmlFor="checkbox2"
                className="text-check text-inherit cursor-pointer text-md"
              >
                Credito
              </label>
            </div>
            <div className="RegistrarVenta-grupo-check text-font-color">
              <input
                className="input-check cursor-pointer accent-blue-600"
                type="checkbox"
                id="checkbox3"
                checked={watch("paymentMethodCurrentAccount")}
                onChange={() => {
                  const val = watch("paymentMethodCurrentAccount")
                  setValue("paymentMethodCurrentAccount", !val);
                  setValue("creditSale", false);
                }}
              />
              <label
                htmlFor="checkbox3"
                className="text-check text-inherit cursor-pointer text-md"
              >
                Cta. Cte
              </label>
            </div>
          </div>
        </div>

        {/* Product Options */}
        <div className="w-full sm:w-3/4 lg:w-2/3 flex flex-col gap-10">
          <div className="grid grid-cols-3 gap-10 w-full text-md font-medium text-center -mb-8">
            <p>Cantidad</p>
            <p>Producto</p>
            <p>Precio</p>
          </div>
          <div className="bg-gradient-to-b from-transparentLight via-customLightBlue to-customBlue grid grid-cols-3 rounded-b-2xl w-full py-20 gap-10">
            <NumericOptionScrooll
              numeric={{
                isDecimal: false,
                min: 1,
                max: 100
              }}
              value={editar?.quantity}
              className="text-md"
              onOptionChange={(selectedOption) =>
                setValue(`detail.0.quantity`, parseInt(selectedOption))
              }
            />
            <SelectableOptionScrooll
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
            <DecimalOptionScroll
              value={editar?.price || ((products && watch(`detail.0.product`)) ? (!!products.find((x) => x.name === watch(`detail.0.product`)) ? Number(products.find((x) => x.name === watch(`detail.0.product`))!.price) : 0) : 0)}
              className="text-md"
              max={10000}
              min={0}
              onOptionChange={(selectedOption) => {
                setValue(`detail.0.price`, selectedOption);
              }}
            />
          </div>

          <div className="text-2xl rounded-2xl w-full flex flex-col items-center gap-2 text-black pr-2.5 shadow-md border p-2 shadow-zinc-300/25">
            <i
              className={`fa-solid  ${editar !== null
                ? "fa-pen py-3 hover:animate-pulse"
                : "fa-plus hover:rotate-90"
                } rounded-full shadow-md shadow-zinc-400 px-3 py-2.5 bg-blue_custom text-white  transition-all cursor-pointer`}
              onClick={handleAddProduct}
            ></i>
            <p className="text-base font-semibold text-font-color">
              {editar !== null ? "Editar" : "Agregar"} Producto
            </p>
          </div>

          {/* Display Added Products */}
          {
            addedProducts.length > 0 &&
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
                        <p className="text-sm">Precio: {product.price}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center flex-col pr-4">
                      <button
                        type="button"
                        className="text-blue_custom hover:text-blue-600"
                        onClick={() => {
                          setValue(`detail.0.product`, product.product);
                          setValue(`detail.0.price`, product.price);
                          setValue(`detail.0.quantity`, product.quantity);
                          const indepro = products
                            ? products.findIndex(
                              (x) => x.name === product.product
                            )
                            : 0;

                          console.log(indepro)
                          setEditar({
                            price: Number(product.price),
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

              <div className="mt-2 flex justify-end gap-2 items-center bg-blocks dark:border-blocks shadow-md border shadow-zinc-300/25 rounded-2xl py-2 px-6">
                Total: <span className="text-blue_custom">{addedProducts.reduce((acc, p) => acc += (parseFloat(p.price) * p.quantity), 0).toFixed(2)} Bs</span>
              </div>
            </div>
          }

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
        </div>

        <button
          disabled={addedProducts.length === 0}
          type="submit"
          className="disabled:bg-gray-400 bg-blue-500 py-2  text-xl px-6 rounded-full text-white font-medium shadow-xl hover:bg-blue-600 fixed bottom-5 right-5 z-50 p-10 w-2/12"
        >
          {active ? (
            <i className="fa-solid fa-spinner animate-spin"></i>
          ) : (
            <span>{selectedSale ? "Editar venta" : "Vender"}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default RegisterSalesForm;
