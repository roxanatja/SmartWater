import { useCallback, useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { OptionScrooll } from "../components/OptionScrooll/OptionScrooll";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { Loans } from "../../../type/Loans/Loans";
import { Client } from "../../../type/Cliente/Client";
import { UserData } from "../../../type/UserData";
import { IDevolutionBody } from "../../../api/types/devolutions";
import { AuthService } from "../../../api/services/AuthService";
import { DevolutionsApiConector, ItemsApiConector, LoansApiConector, ProductsApiConector } from "../../../api/classes";
import { Contador } from "../components/Contador/Contador";

const RegisterDevoluForm = ({ selectedClient }: { selectedClient: Client }) => {
  const [products, setProducts] = useState<Loans['detail']>([]);
  const [active, setActive] = useState(false);

  const [loans, setLoans] = useState<Array<Loans>>([]);
  const [loan, setLoan] = useState<Loans | null>(null);

  const [addedProducts, setAddedProducts] = useState<IDevolutionBody['data']['detail']>([]);

  const { parcial } = useParams();

  const [option, setOption] = useState(false);

  const { register, handleSubmit, watch, setValue, reset } = useForm<IDevolutionBody['data']>({
    defaultValues: {
      detail: [],
    },
  });

  useEffect(() => {
    if (parcial === "total") {
      setOption(true);
    }
  }, [parcial]);

  const onSubmit: SubmitHandler<any> = async (data) => {
    const userData: UserData | null = AuthService.getUser();

    if (option && loan) {
      setActive(true);
      toast(
        (t) => (
          <div>
            <p className="mb-4 text-center text-[#888]">
              Se <b>devolverá</b> todo <br /> pulsa <b>Proceder</b> para continuar
            </p>
            <div className="flex justify-center">
              <button
                className="bg-red-500 px-3 py-1 rounded-lg ml-2 text-white"
                onClick={() => { toast.dismiss(t.id); }}
              >
                Cancelar
              </button>
              <button
                className="bg-blue_custom px-3 py-1 rounded-lg ml-2 text-white"
                onClick={async () => {
                  toast.dismiss(t.id);
                  const values: IDevolutionBody['data'] = {
                    ...data,
                    detail: loan.detail.map((item) => ({
                      item: item.item,
                      quantity: `${item.quantity}`,
                    })),
                    user: userData?._id || "",
                    client: selectedClient._id,
                    loan: loan?._id
                  };

                  const res = await DevolutionsApiConector.create({ data: values });

                  if (res) {
                    toast.success("Devolucion registrada");
                    reset();
                    setProducts([]);
                    setLoan(null);
                    getProduct();
                    setAddedProducts([]);
                  } else {
                    toast.error("Upss error al registrar devolucion");
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
          position: "top-center",
        }
      );
      setActive(false);
      return;
    }
    if (loan) {
      if (addedProducts.length === 0) {
        toast.error("Por favor agrega un producto.");
        return;
      }
      setActive(true);

      for (let i = 0; i < loan.detail.length; i++) {
        const addedProduct = addedProducts.find(
          (added) => loan.detail[i].name === added.item
        );
        if (
          addedProduct &&
          Number(addedProduct.quantity) > Number(loan.detail[i].quantity)
        ) {
          return toast.error(
            `La cantidad que se va a devolver (${addedProduct.quantity}) no puede ser mayor a la cantidad disponible (${loan.detail[i].quantity}) en ${addedProduct.item}`
          );
        }
      }

      const values: IDevolutionBody['data'] = {
        ...data,
        detail: addedProducts.map((item) => ({
          item: products?.find((p) => p.name === item.item)?.item || "",
          quantity: item.quantity,
        })),
        user: userData?._id || "",
        client: selectedClient._id,
        loan: loan?._id
      };

      const res = await DevolutionsApiConector.create({ data: values });

      if (res) {
        toast.success("Devolucion registrada");
        reset();
        setProducts([]);
        setLoan(null);
        getProduct();
        setAddedProducts([]);
      } else {
        toast.error("Upss error al registrar devolucion");
      }

      setActive(false);
    }
  };

  const getProduct = useCallback(async () => {
    if (selectedClient._id) {
      const res = (await LoansApiConector.get({ pagination: { page: 1, pageSize: 3000 }, filters: { client: selectedClient._id } }))?.data || []
      const products = (await ProductsApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || [];
      const items = (await ItemsApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || [];

      const loansWithProductNames = res.map((loan) => {
        return {
          ...loan,
          detail: loan.detail.map((detailItem) => {
            const product = products.find((x) => x._id === detailItem.item);
            const item = items.find((x) => x._id === detailItem.item);

            return {
              ...detailItem,
              name: product
                ? product.name
                : item
                  ? item.name
                  : "Unknown product",
            };
          }),
        };
      });

      setLoans(loansWithProductNames);
    }
  }, [selectedClient._id]);

  useEffect(() => {
    getProduct();
  }, [getProduct]);

  const handleAddProduct = () => {
    const item = watch("detail")[0].item;
    const quantity = watch("detail")[0].quantity;

    if (item && quantity) {
      const idx = addedProducts.findIndex(a => a.item === item)
      if (idx !== -1) {
        setAddedProducts((prev => prev.map(a => {
          if (a.item === item) {
            return { ...a, quantity: a.quantity + quantity }
          } else {
            return a
          }
        })))
      } else {
        setAddedProducts([...addedProducts, { item, quantity }]);
      }

      setValue("detail.0.quantity", 1);
    }
  };

  const handleOptionChange = useCallback(
    (selectedOption: string, type: "quantity" | "item") => {
      const currentProduct = watch("detail")[0]?.item;
      const currentQuantity = watch("detail")[0]?.quantity;

      if (type === "quantity" && currentQuantity !== parseInt(selectedOption)) {
        setValue("detail.0.quantity", parseInt(selectedOption));
      } else if (type === "item" && currentProduct !== selectedOption) {
        setValue("detail.0.item", selectedOption);
        setValue("detail.0.quantity", 1);
      }
    },
    [setValue, watch]
  );

  const handleDeleteProduct = (index: number) => {
    setAddedProducts(addedProducts.filter((_, i) => i !== index));
  };

  const onChangeAmount = (itemName: string, quantity: number) => {
    if (itemName && quantity) {
      const idx = addedProducts.findIndex(a => a.item === itemName)
      if (idx !== -1) {
        setAddedProducts((prev => prev.map(a => {
          if (a.item === itemName) {
            return { ...a, quantity: quantity }
          } else {
            return a
          }
        })))
      }

      setValue("detail.0.quantity", 1);
    }
  }

  const currentItem = watch("detail")[0]?.item
  const quantityOptions: string[] = useMemo(() => {
    if (addedProducts && products && products.length > 0 && currentItem) {
      const currentProductTotal = products.filter(p => p.name === currentItem).reduce((sum, current) => { return sum += current.quantity }, 0) || 0
      const addedProductTotal = addedProducts.filter(p => p.item === currentItem).reduce((sum, current) => { return sum += current.quantity }, 0) || 0

      const diff = currentProductTotal - addedProductTotal

      return (new Array(diff).fill("1")).map((_, index) => `${index + 1}`)
    } else {
      return []
    }
  }, [products, addedProducts, currentItem])

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 justify-center items-center w-full pb-32"
    >
      <div className="flex flex-col gap-6 justify-center items-center w-full px-6 pb-0 ">
        <div className="flex justify-start items-center w-full gap-2 pt-2">
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
          <p className="text-sm">{selectedClient?.fullName || "Sin nombre"}</p>
        </div>
        <div className="text-md rounded-full w-full grid grid-cols-2 gap-2 shadow-md border shadow-zinc-300/25">
          <button
            type="button"
            onClick={() => setOption(!option)}
            className={`${!option && "bg-blue-500 font-medium text-white outline-0"
              } p-2 rounded-l-full transition-all`}
          >
            Parcial
          </button>
          <button
            type="button"
            onClick={() => {
              setOption(!option);
            }}
            className={`${option && "bg-blue-500 font-medium text-white"
              } p-2 rounded-r-full transition-all`}
          >
            Total
          </button>
        </div>

        {loans.length === 0 && (
          <div className="flex justify-between items-center w-full pr-2.5 shadow-md border p-4 shadow-zinc-300 rounded-2xl cursor-pointer group transition-all">
            No tienes Préstamos activos
          </div>
        )}

        <div className={`w-full max-h-[300px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 px-1 py-2`}>
          {loans.map((row: Loans, index: number) => (
            <div
              className="flex gap-2 justify-between items-center w-full pr-2.5 shadow-md border p-4 shadow-zinc-300/25 rounded-2xl cursor-pointer group transition-all"
              key={index}
              onClick={() => {
                setLoan(row);
                setProducts(row.detail);
                handleOptionChange(
                  "1",
                  "quantity"
                );
                handleOptionChange(row.detail[0].name, "item");
                setAddedProducts([]);
              }}
            >
              <div key={index} className="flex-[6]">
                {row.detail.map((item: Loans['detail'][0], index: number) => (
                  <div
                    key={index}
                    className="flex w-full justify-between items-start gap-2"
                  >
                    <p className="font-medium"> {item.name}</p>
                    <p className="whitespace-nowrap">{item.quantity} Unidades</p>
                  </div>
                ))}
              </div>
              <div className="flex-1 flex justify-center">
                <div className="w-[20px]">
                  <div className={`w-auto cursor-pointer border-2 p-0.5 border-blue-500 rounded-full`}                >
                    <div
                      className={`p-1.5 rounded-full  ${loan && loan._id === row._id
                        ? "bg-blue-500"
                        : "group-hover:bg-zinc-300"
                        }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!option && (
          <>
            <div className="flex justify-between w-full items-center border-b border-zinc-300 pb-4 cursor-pointer outline-0"            >
              <p className="text-md font-semibold">Agregar Productos</p>
              <i className={`fa-solid fa-chevron-up transition-all`}></i>
            </div>

            <div className="w-full sm:w-3/4 lg:w-2/3 flex flex-col gap-10">
              {/* Product Options */}
              <div className="grid grid-cols-2 gap-10 w-full text-md font-medium text-center -mb-8">
                <p>Cantidad</p>
                <p>Producto</p>
              </div>
              <div className="bg-gradient-to-b from-transparentLight via-customLightBlue to-customBlue grid grid-cols-2 rounded-b-2xl w-full py-20 gap-10">
                <OptionScrooll
                  value={(watch('detail')[0]?.quantity || 0) - 1}
                  options={quantityOptions}
                  onOptionChange={(selectedOption) =>
                    handleOptionChange(selectedOption, "quantity")
                  }
                />
                <OptionScrooll
                  value={products.findIndex(p => p.name === watch('detail')[0]?.item)}
                  options={
                    products ? products.map((product) => product.name) : []
                  }
                  onOptionChange={(selectedOption) =>
                    handleOptionChange(selectedOption, "item")
                  }
                />
              </div>
              <div className="text-2xl rounded-2xl w-full flex flex-col items-center gap-2 pr-2.5 shadow-md border p-2 shadow-zinc-300/25">
                <i
                  className="fa-solid fa-plus rounded-full shadow-md shadow-zinc-400/25 px-3 py-2.5 bg-blue_custom text-white hover:rotate-90 transition-all cursor-pointer"
                  onClick={handleAddProduct}
                ></i>
                <p className="text-base font-semibold"> Agregar Producto</p>
              </div>

              {/* Display Added Products */}
              <div className={`w-full`}>
                <div className="max-h-[300px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {addedProducts.map((product, index) => (
                    <motion.div
                      key={index}
                      className={`mb-2 flex justify-between items-center bg-blocks dark:border-blocks shadow-md border shadow-zinc-300/25 rounded-2xl p-2`}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex flex-col gap-4 p-1">
                        <p>
                          <strong>{product.item}</strong>
                        </p>
                        <div className="flex gap-4 items-center">
                          <p className="text-sm">Cantidad:</p>
                          <div className="flex-[3]">
                            <Contador
                              min={1}
                              initialValue={product.quantity}
                              max={products.filter(p => p.name === product.item).reduce((sum, current) => { return sum += current.quantity }, 0) || 0}
                              onIncrementar={(count) => onChangeAmount(product.item, count)}
                              onDecrementar={(count) => onChangeAmount(product.item, count)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center flex-col pr-4">
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
            </div>
          </>
        )}

        <div className={`${!option ? "w-full sm:w-3/4 lg:w-2/3 flex flex-col gap-10" : "w-full"}`}>
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
          type="submit"
          disabled={!option ? (addedProducts.length <= 0) : !loan}
          className="disabled:bg-gray-400 bg-blue-500 py-2  text-xl px-6 rounded-full text-white font-medium shadow-xl hover:bg-blue-600 fixed bottom-5 right-5 z-50 p-10 w-2/12"
        >
          {active ? (
            <i className="fa-solid fa-spinner animate-spin"></i>
          ) : (
            "Registrar Devolucion"
          )}
        </button>
      </div>
    </form>
  );
};

export default RegisterDevoluForm;
