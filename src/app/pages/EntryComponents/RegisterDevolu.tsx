import React, { useCallback, useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ClientesContext } from "../Contenido/Clientes/ClientesContext";
import { OptionScrooll } from "../components/OptionScrooll/OptionScrooll";
import ApiMethodSales from "../../../Class/api.sales";
import Product from "../../../type/Products/Products";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { DevolutionBody } from "../../../type/Devolution/devolution";
import ApiMethodDevolu from "../../../Class/api.devolu";
import { Loans, LoansBody } from "../../../type/Loans/Loans";
import ApiMethodLoans from "../../../Class/api.loans";

const RegisterDevoluForm = () => {
  const { selectedClient } = useContext(ClientesContext);
  const [products, setProducts] = useState<
    { item: string; quantity: string; name: string }[] | null
  >(null);
  const [active, setActive] = useState(false);
  const navigate = useNavigate();
  const [loans, setLoans] = useState<Array<Loans>>([]);
  const [loan, setLoan] = useState<Loans | null>(null);
  const [addedProducts, setAddedProducts] = useState<
    { item: string; quantity: string }[]
  >([]);
  const [option, setOption] = useState(false);
  const [views, setWiews] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<DevolutionBody>({
    defaultValues: {
      detail: [{ item: "", quantity: "0" }],
    },
  });

  //   useEffect(() => {
  //     if (selectedClient._id === "") {
  //       navigate("/Clientes");
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, [selectedClient]);

  const { append } = useFieldArray({
    control,
    name: "detail",
  });

  const onSubmit: SubmitHandler<DevolutionBody> = async (data) => {
    if (addedProducts.length === 0) {
      toast.error("Por favor agrega un producto.");
      return;
    }
    setActive(true);
    const api = new ApiMethodDevolu();
    const values: DevolutionBody = {
      ...data,
      detail: addedProducts.map((item) => ({
        item: item.item,
        quantity: item.quantity,
      })),
      user: `${process.env.REACT_APP_USER_API}`,
      client: selectedClient._id,
    };
    console.log(values);
    try {
      await api.registerDevolutions(values);
      toast.success("Prestamo registrado");
    } catch (error) {
      toast.error("Upss error al registrar prestamo");
      console.error(error);
    }
    setActive(false);
  };

  const getProduct = useCallback(async () => {
    if (selectedClient._id) {
      const api = new ApiMethodLoans();
      const res = await api.GetLoansByClientId(selectedClient._id);
      const apis = new ApiMethodSales();
      const products = await apis.GetProducts();

      const loansWithProductNames = res.map((loan) => {
        return {
          ...loan,
          detail: loan.detail.map((detailItem) => {
            const product = products.find((x) => x._id === detailItem.item);
            return {
              ...detailItem,
              name: product ? product.name : "Unknown product",
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
    const product = watch("detail")[0].item;
    const quantity = watch("detail")[0].quantity;
    if (product && quantity) {
      setAddedProducts([...addedProducts, { item: product, quantity }]);
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
      <div className="flex flex-col gap-6 justify-center items-center w-full px-6 pb-0 ">
        <div className="flex justify-start items-center w-full gap-2 pt-2">
          <img
            src={selectedClient?.storeImage || ""}
            className="w-8 h-8 rounded-full"
            alt="storeImage"
          />
          <p className="text-sm">{selectedClient?.fullName || "N/A"}</p>
        </div>
        <div className="text-xl rounded-full w-full grid grid-cols-2 gap-2 text-black shadow-md border shadow-zinc-300">
          <button
            type="button"
            onClick={() => setOption(!option)}
            className={`${
              option && "bg-blue-500  font-medium text-white outline-0"
            } p-2 rounded-l-full transition-all`}
          >
            Parcial
          </button>
          <button
            type="button"
            onClick={() => setOption(!option)}
            className={`${
              !option && "bg-blue-500  font-medium text-white"
            } p-2 rounded-r-full transition-all`}
          >
            Total
          </button>
        </div>

        <div className="flex flex-col w-full gap-2">
          {loans.map((row, index) => (
            <div
              className="flex justify-between items-center w-full text-black pr-2.5 shadow-md border p-4 shadow-zinc-300 rounded-2xl cursor-pointer hover:scale-105 transition-all"
              key={index}
              onClick={() => {
                setLoan(row);
                setProducts(
                  row.detail as unknown as {
                    item: string;
                    quantity: string;
                    name: string;
                  }[]
                );
              }}
            >
              <div key={index} className="w-8/12">
                {row.detail.map((item: any, index) => (
                  <div
                    key={index}
                    className="flex w-full justify-between items-center"
                  >
                    <p className="font-medium"> {item.name}</p>
                    <p>{item.quantity} Unidades</p>
                  </div>
                ))}
              </div>

              <div>
                <div
                  className={`cursor-pointer border-2 p-0.5 border-blue-500 rounded-full`}
                >
                  <div
                    className={`p-2.5 rounded-full ${
                      loan && loan._id === row._id && "bg-blue-500"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          className="flex justify-between w-full items-center border-b border-zinc-300 pb-4 cursor-pointer outline-0"
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
                options={
                  products ? products.map((product) => product.quantity) : []
                }
                onOptionChange={(selectedOption) =>
                  handleOptionChange(selectedOption, "quantity")
                }
              />
              <OptionScrooll
                options={
                  products ? products.map((product) => product.name) : []
                }
                onOptionChange={(selectedOption) =>
                  handleOptionChange(selectedOption, "item")
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
                        <strong>{product.item}</strong>
                      </p>
                      <p className="text-sm">Cantidad: {product.quantity}</p>
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

        <button
          type="submit"
          className=" outline outline-2 outline-blue-500 bg-blue-500 py-2  text-xl px-6 rounded-full text-white font-medium shadow-xl hover:bg-blue-600 fixed bottom-5 right-5 z-50 p-10 w-2/12"
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
