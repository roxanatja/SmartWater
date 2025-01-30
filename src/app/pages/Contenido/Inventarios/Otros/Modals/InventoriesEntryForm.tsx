import { useState } from "react";
import { EntryItemBody, MatchedElement } from "../../../../../../type/Kardex";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Input from "../../../../EntryComponents/Inputs";

interface Props {
    updateDetails: (val: EntryItemBody, index?: number) => void;
    handleDeleteElement: (index: number) => void;
    elements: MatchedElement[];
    inventories: EntryItemBody[]
}

const InventoriesEntryForm = ({ elements, updateDetails, handleDeleteElement, inventories }: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const [edit, setEdit] = useState<number>(-1)

    const { register, setValue, formState: { errors, isValid }, getValues, reset } = useForm<EntryItemBody & { element: string }>({
        mode: 'all'
    })

    const setEditElement = (index: number) => {
        setEdit(index)

        const inv = inventories[index]
        if (inv.item) {
            setValue('element', inv.item, { shouldValidate: true })
        }
        if (inv.product) {
            setValue('element', inv.product, { shouldValidate: true })
        }

        // setValue('unitPrice', inv.unitPrice, { shouldValidate: true })
        setValue('quantity', inv.quantity, { shouldValidate: true })
    }

    const onSubmit = () => {
        const res: EntryItemBody = {
            // unitPrice: parseFloat(String(getValues('unitPrice'))),
            quantity: parseFloat(String(getValues('quantity'))),
            inputType: getValues('inputType')
        }

        const elem = getValues('element')
        const el = elements.find(e => e._id === elem)

        if (el?.isProduct) {
            res.product = elem
        } else {
            res.item = elem
        }

        updateDetails(res, edit)
        if (edit !== -1) { setEdit(-1) }
        // reset({ element: "", unitPrice: 0, quantity: 0, inputType: "production_received" })
        reset({ element: "", quantity: 0, inputType: "production_received" })
    }

    return (
        <div className="w-full rounded-[15px] shadow dark:shadow-gray-300 p-4">
            <div className={`w-full flex justify-between cursor-pointer ${isOpen ? "border-b-2 pb-4 mb-4" : ""}`} onClick={() => setIsOpen(!isOpen)}>
                <h4 className="text-sm font-semibold">Agregar productos e items</h4>
                <i className={`fa-solid fa-angle-down transition-all ${isOpen && "rotate-180"}`}></i>
            </div>

            {
                isOpen &&
                <div className="flex flex-col gap-4 text-sm">
                    <div className="flex flex-col gap-4 text-sm">
                        <div className="flex gap-4 justify-between text-sm">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 0.3 }}
                                className="w-full md:w-1/3 flex flex-col gap-2"
                            >
                                <label>Tipo de ingreso</label>
                                <select
                                    {...register("inputType", {
                                        required: "Debes seleccionar un tipo"
                                    })}
                                    className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black dark:disabled:bg-zinc-700 disabled:bg-zinc-300"
                                >
                                    <option value="production_received">Ingreso de producción</option>
                                    <option value="adjustment_entry">Ingreso por ajuste</option>
                                </select>
                                {errors.inputType && (
                                    <span className="text-red-500 font-normal text-sm font-pricedown">
                                        <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                                        {errors.inputType.message}
                                    </span>
                                )}
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ delay: 0.3 }}
                                className="w-full md:w-1/3 flex flex-col gap-2"
                            >
                                <label>Item o producto</label>
                                <select
                                    {...register("element", {
                                        required: "Debes seleccionar un elemento"
                                    })}
                                    className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black"
                                >
                                    <option value={""}>Selccione uno</option>
                                    {
                                        elements.map((row, index) => (
                                            <option value={row._id} key={index}>
                                                {row.name}
                                            </option>
                                        ))
                                    }
                                </select>
                                {errors.element && (
                                    <span className="text-red-500 font-normal text-sm font-pricedown">
                                        <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                                        {errors.element.message}
                                    </span>
                                )}
                            </motion.div>
                            <Input
                                label="Cantidad"
                                name="quantity"
                                register={register}
                                type="number"
                                min={0}
                                className="no-spinner"
                                errors={errors.quantity}
                                required
                                containerClassName='flex-1'
                                validateAmount={(value) => {
                                    const val = parseFloat(value)
                                    return val > 0 ? Number.isInteger(val) ? true : "La cantidad debe ser un número entero" : "La cantidad debe ser mayor que 0"
                                }}
                            />
                        </div>
                        {/* <div className="flex gap-4 justify-between text-sm flex-wrap"> */}

                        {/* <Input
                                label="Costo unitario"
                                name="unitPrice"
                                register={register}
                                type="number"
                                min={0}
                                step={0.01}
                                className="no-spinner"
                                sufix={<span>Bs</span>}
                                errors={errors.unitPrice}
                                required
                                containerClassName='flex-1'
                                validateAmount={(val: number) => val > 0 ? true : "El costo debe ser mayor que 0"}
                            /> */}
                        {/* </div> */}
                        <button
                            type="button"
                            onClick={() => onSubmit()}
                            disabled={!isValid}
                            className="disabled:bg-gray-400 bg-blue-500 py-2  text-sm px-6 rounded-full text-white font-medium shadow-xl hover:bg-blue-600"
                        >
                            {
                                edit !== -1 ? "Editar" : "Agregar"
                            }
                        </button>
                    </div>

                    {
                        inventories.length > 0 &&
                        <>
                            <div className="max-h-[300px] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                {inventories.map((product, index) => (
                                    <motion.div
                                        key={index}
                                        className={`mb-2 flex justify-between items-center bg-blocks dark:border-blocks shadow-md border shadow-zinc-300/25 rounded-2xl p-2 ${index === edit && "border-2 border-blue_custom"}`}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex flex-col gap-4 p-1">
                                            <p className="font-semibold">
                                                {
                                                    elements.find(e => (product.item ? product.item : product.product) === e._id)?.name || "Producto desconocido"
                                                }
                                            </p>
                                            <div className="flex gap-1 items-start flex-col">
                                                <p className="text-xs">Cantidad: {product.quantity}</p>
                                                {/* <p className="text-xs">Precio unitario: {product.unitPrice.toLocaleString()}</p> */}
                                                <p className="text-xs">{product.inputType === 'production_received' ? "Ingreso de producción" : "Ingreso por ajuste"}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center flex-col pr-4 pt-2 h-full">
                                            <button
                                                type="button"
                                                className="text-blue_custom hover:text-blue-600"
                                                onClick={() => setEditElement(index)} >
                                                <i className="fa-solid fa-pen"></i>
                                            </button>
                                            <button
                                                type="button"
                                                className="text-red-700 hover:text-red-500"
                                                onClick={() => handleDeleteElement(index)}
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    }
                </div>
            }
        </div >
    )
}

export default InventoriesEntryForm