import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import ImageUploadField from "./ImageUploadField";
import { Client } from "../../../type/Cliente/Client";
import { UserData } from "../../../type/UserData";
import { ILoanBody } from "../../../api/types/loans";
import { AuthService } from "../../../api/services/AuthService";
import { ItemsApiConector, LoansApiConector } from "../../../api/classes";
import { Item } from "../../../type/Item";
import { useNavigate } from "react-router-dom";
import Input from "./Inputs";
import { Loans } from "../../../type/Loans/Loans";
import { useGlobalContext } from "../../SmartwaterContext";
import moment from "moment";
import { NumericOptionScrooll } from "../components/OptionScrooll/NumericOptionScroll";
import { SelectableOptionScrooll } from "../components/OptionScrooll/SelectableOptionScrooll";

const RegisterPrestaForm = ({ selectedClient, selectedLoan }: { selectedClient: Client; selectedLoan?: Loans }) => {
  const [products, setProducts] = useState<Item[] | null>(null);
  const [active, setActive] = useState(false);
  const navigate = useNavigate()
  const { setLoading } = useGlobalContext()

  const [addedProducts, setAddedProducts] = useState<ILoanBody['data']['detail']>([]);
  const [editar, setEditar] = useState<{
    quantity: number;
    item: number;
    index: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ILoanBody['data']>({
    defaultValues: {
      detail: [{ item: "", quantity: 0 }],
      contract: {
        link: null,
        validUntil: "",
      },
    },
    mode: "all"
  });

  const onSubmit: SubmitHandler<ILoanBody['data']> = async (data) => {
    if (addedProducts.length === 0) {
      toast.error("Por favor agrega un producto.");
      return;
    }
    setActive(true);
    const userData: UserData | null = AuthService.getUser();

    const values: ILoanBody['data'] = {
      ...data,
      detail: addedProducts.map((item) => ({
        item: products?.find((p) => p.name === item.item)?._id || "",
        quantity: item.quantity,
      })),
      user: userData?._id || "",
      client: selectedClient._id,
    };

    let res = null

    if (selectedLoan) {
      res = await LoansApiConector.update({ data: values, loanId: selectedLoan._id });
    } else {
      res = await LoansApiConector.create({ data: values });
    }

    if (res) {
      toast.success(`Prestamo ${selectedLoan ? "editado" : "registrado"}`);
      reset();
      setAddedProducts([]);

      navigate("/Prestamos", { replace: true })
      window.location.reload()
    } else {
      toast.error("Upss error al registrar prestamo");
    }

    setActive(false);
  };

  const getProduct = useCallback(async () => {
    const res = (await ItemsApiConector.get({ pagination: { page: 1, pageSize: 3000 } }))?.data || [];
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
    }
  };

  const handleOptionChange = useCallback(
    (selectedOption: string, type: "quantity" | "item") => {
      const currentProduct = watch("detail")[0].item;
      const currentQuantity = watch("detail")[0].quantity;

      if (type === "quantity" && currentQuantity !== parseInt(selectedOption)) {
        setValue("detail.0.quantity", parseInt(selectedOption));
      } else if (type === "item" && currentProduct !== selectedOption) {
        setValue("detail.0.item", selectedOption);
      }
    },
    [setValue, watch]
  );

  const handleDeleteProduct = (index: number) => {
    setAddedProducts(addedProducts.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (selectedLoan) {
      setLoading(true)
    }
  }, [selectedLoan, setLoading])

  useEffect(() => {
    if (selectedLoan && products) {
      setAddedProducts(selectedLoan.detail.map(i => ({
        item: products?.find((p) => p._id === i.item)?.name || "Item no encontrado",
        quantity: i.quantity,
      })))

      if (selectedLoan.contract.link && selectedLoan.contract.validUntil) {
        setValue('contract.link', selectedLoan.contract.link)
        setValue('contract.validUntil', new Date(selectedLoan.contract.validUntil || "").toISOString().split("T")[0])
      }

      if (selectedLoan.comment) {
        setValue('comment', selectedLoan.comment)
      }
      setLoading(false)
    }
  }, [selectedLoan, products, setValue, setLoading])

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
        <div className="flex justify-between w-full items-center border-b border-zinc-300 pb-4 cursor-pointer">
          <p className="text-md font-semibold">Agregar Productos</p>
          <i
            className={`fa-solid fa-chevron-up transition-all`}
          ></i>
        </div>

        {/* Product Options */}
        <div className="w-full sm:w-3/4 lg:w-2/3 flex flex-col gap-10">
          <div className="grid grid-cols-2 gap-10 w-full text-md font-medium text-center -mb-8">
            <p>Cantidad</p>
            <p>Item</p>
          </div>
          <div className="bg-gradient-to-b from-transparentLight via-customLightBlue to-customBlue grid grid-cols-2 rounded-b-2xl w-full py-20 gap-10">
            <NumericOptionScrooll
              numeric={{
                isDecimal: false,
                min: 1,
                max: 100
              }}
              value={editar?.quantity}
              className="text-md"
              onOptionChange={(selectedOption) =>
                handleOptionChange(selectedOption, "quantity")
              }
            />
            <SelectableOptionScrooll
              options={products ? products.map((product) => product.name) : []}
              className="text-md text-nowrap"
              value={editar?.item}
              onOptionChange={(selectedOption) => {
                handleOptionChange(selectedOption, "item")
              }}
            />
          </div>

          <div className="text-2xl rounded-2xl w-full flex flex-col items-center gap-2 pr-2.5 shadow-md border p-2 shadow-zinc-300/30">
            <i
              className={`fa-solid  ${editar !== null
                ? "fa-pen py-3 hover:animate-pulse"
                : "fa-plus hover:rotate-90"
                } rounded-full shadow-md shadow-zinc-400/25 px-3 py-2.5 bg-blue_custom text-white  transition-all cursor-pointer`}
              onClick={handleAddProduct}
            ></i>
            <p className="text-base font-semibold">
              {editar !== null ? "Editar" : "Agregar"} Producto
            </p>
          </div>


          {/* Display Added Products */}
          <div className={`w-full`}>
            <div className="max-h-[300px] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {addedProducts.map((product, index) => (
                <motion.div
                  key={index}
                  className={`mb-2 flex justify-between items-center bg-blocks shadow-md border dark:border-blocks shadow-zinc-300/25 rounded-2xl p-2 ${index === editar?.index && "border-2 border-blue_custom"
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
                    <div className="flex gap-4 items-center">
                      <p className="text-sm">Cantidad: {product.quantity}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center flex-col pr-4">
                    <button
                      type="button"
                      className="text-blue_custom hover:text-blue-600"
                      onClick={() => {
                        setValue(`detail.0.item`, product.item);
                        setValue(`detail.0.quantity`, product.quantity);
                        const indepro = products
                          ? products.findIndex(
                            (x) => x.name === product.item
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

          <Input
            min={moment().format("YYYY-MM-DD")}
            type="date"
            label="Valido hasta"
            labelClassName="text-blue_custom text-md font-semibold"
            iconContainerClassName="!border-0 !ps-1"
            name="contract.validUntil"
            register={register}
            errors={errors.contract?.validUntil}
            className="full-selector bg-transparent text-blue_custom font-medium !outline-0 border-b-2 rounded-none border-blue_custom focus:outline-0 w-full"
            icon={<img className="w-6 h-6" src="/valid.svg" alt="" />}
          />

          <div className="relative w-full flex items-start">
            <i className="fa-solid fa-message text-2xl text-blue_custom absolute pt-2"></i>
            <textarea
              {...register("comment")}
              rows={3}
              name="comment"
              placeholder="Agregar Comentario"
              className="placeholder:text-blue_custom outline-0 border-b-2 rounded-none border-blue_custom focus:outline-0 placeholder:text-md placeholder:font-semibold w-full py-2 ps-8 bg-transparent"
            />
          </div>

          <ImageUploadField
            value={watch('contract.link')}
            fieldName={"contract.link"}
            label={"Porfavor, adjunta la imagen del contrato"}
            register={register}
            setValue={setValue}
            errors={errors.contract?.link}
            required={!!watch('contract.validUntil')}
          />
        </div>

        <button
          type="submit"
          disabled={addedProducts.length === 0 || ((!!watch('contract.validUntil') && !watch('contract.link')))}
          className="disabled:bg-gray-400 bg-blue-500 py-2  text-xl px-6 rounded-full text-white font-medium shadow-xl hover:bg-blue-600 fixed bottom-5 right-5 z-50 p-10 w-2/12"
        >
          {
            active ? (
              <i className="fa-solid fa-spinner animate-spin" ></i>
            ) : (
              <span>{selectedLoan ? "Editar" : "Registrar"} Prestamo</span>
            )}
        </button>
      </div >
    </form >
  );
};

export default RegisterPrestaForm;
