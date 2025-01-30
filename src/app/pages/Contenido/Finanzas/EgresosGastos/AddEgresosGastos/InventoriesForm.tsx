import { useState } from "react";
import { IExpenseDetailsBody } from "../../../../../../api/types/expenses"
import { MatchedElement } from "../../../../../../type/Kardex";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import Input from "../../../../EntryComponents/Inputs";

interface Props {
    updateDetails: (val: IExpenseDetailsBody['data']['details'][0], index?: number) => void;
    handleDeleteElement: (index: number) => void;
    elements: MatchedElement[];
    inventories: IExpenseDetailsBody['data']['details']
}

const InventoriesForm = ({ elements, updateDetails, handleDeleteElement, inventories }: Props) => {
    const [isOpen, setIsOpen] = useState<boolean>(true)
    const [edit, setEdit] = useState<number>(-1)

    const { register, setValue, formState: { errors, isValid }, getValues, reset } = useForm<IExpenseDetailsBody['data']['details'][0] & { element: string }>({
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

        setValue('inputImport', inv.inputImport, { shouldValidate: true })
        setValue('quantity', inv.quantity, { shouldValidate: true })
    }

    const onSubmit = () => {
        const res: IExpenseDetailsBody['data']['details'][0] = {
            inputImport: parseFloat(String(getValues('inputImport'))),
            quantity: parseFloat(String(getValues('quantity')))
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
        reset({ element: "", inputImport: 0, quantity: 0 })
    }

    return (
        <div className="w-full rounded-[15px] shadow dark:shadow-gray-300 p-4">
            <div className={`w-full flex justify-between cursor-pointer ${isOpen ? "border-b-2 pb-4 mb-4" : ""}`} onClick={() => setIsOpen(!isOpen)}>
                <h4 className="text-sm font-semibold">Agregar inventarios</h4>
                <i className={`fa-solid fa-angle-down transition-all ${isOpen && "rotate-180"}`}></i>
            </div>

            {
                isOpen &&
                <div className="flex flex-col gap-4 text-sm">
                    <div className="flex flex-col gap-4 text-sm">
                        <div className="flex gap-4 justify-between text-sm flex-wrap">
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

                            <Input
                                label="Costo unitario"
                                name="inputImport"
                                register={register}
                                sufix={<span>Bs</span>}
                                errors={errors.inputImport}
                                required
                                numericalOnly
                                containerClassName='flex-1'
                                validateAmount={(val: number) => val > 0 ? true : "El costo debe ser mayor que 0"}
                            />
                        </div>
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
                            <h4 className="text-sm font-semibold">Lista de inventarios</h4>
                            <div className="max-h-[300px] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                <p className="text-xs">Costo unitario: {product.inputImport.toLocaleString()}</p>
                                                <p className="text-xs">Subtotal: {(product.inputImport * product.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 items-center flex-col pr-4">
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
                            <div className="w-full text-end border-t pt-2"><span className="font-semibold">Total:</span> {inventories.reduce<number>((acc, curr) => acc += curr.inputImport * curr.quantity, 0)}</div>
                        </>
                    }
                </div>
            }
        </div >
    )
}

export default InventoriesForm