import { useContext, useState } from "react"
import { InventariosOtrosContext } from "../InventariosOtrosProvider"
import { useForm } from "react-hook-form"
import { IMockInOuts } from "../../mock-data"
import Product from "../../../../../../type/Products/Products";
import { Item } from "../../../../../../type/Item";
import Input from "../../../../EntryComponents/Inputs";
import { motion } from "framer-motion"
import moment from "moment";

interface Props {
    onCancel?: () => void;
    products: Product[];
    items: Item[];
}

const OtrasSalidasForm = ({ items, products, onCancel }: Props) => {
    const { selectedInventario } = useContext(InventariosOtrosContext)
    const [active, setActive] = useState(false);

    const { register, formState: { errors, isValid }, handleSubmit } = useForm<IMockInOuts>({
        defaultValues: {
            ...selectedInventario,
            initialDate: moment(selectedInventario.initialDate).format("YYYY-MM-DD")
        },
        mode: 'all'
    })

    const onSubmit = (data: IMockInOuts) => {
        console.log(selectedInventario._id !== "" ? "Editing" : "Adding")
        console.log(data)

        // let res = null
        // setActive(true)

        // if (selectedItem._id !== "") {
        //     res = await ItemsApiConector.update({ productId: selectedItem._id, data })
        // } else {
        //     res = await ItemsApiConector.create({ data })
        // }

        // if (res) {
        //     toast.success(`Item ${selectedItem._id === "" ? "registrado" : "editado"} correctamente`, { position: "bottom-center" });
        //     window.location.reload();
        // } else {
        //     toast.error("Upps error al crear el item", { position: "bottom-center" });
        //     setActive(false)
        // }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 justify-center items-center w-full p-6"
        >
            <Input
                required
                max={moment().format("YYYY-MM-DD")}
                type="date"
                label="Fecha"
                labelClassName="text-blue_custom text-md font-semibold"
                iconContainerClassName="!border-0 !ps-1"
                name="initialDate"
                register={register}
                errors={errors.initialDate}
                className="full-selector bg-transparent w-full"
                icon={<img src="/desde.svg" alt="" className="w-[20px] h-[20px] absolute bottom-3 left-4 invert-0 dark:invert" />}
            />

            <div className="flex gap-6 items-start w-full flex-col md:flex-row">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full md:w-1/3 flex flex-col gap-2"
                >
                    <label>Tipo de ingreso</label>
                    <select
                        {...register("type", {
                            required: "Debes seleccionar un tipo"
                        })}
                        className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black dark:disabled:bg-zinc-700 disabled:bg-zinc-300"
                    >
                        <option value="production">Salida a producción</option>
                        <option value="fixing">Salida por ajuste</option>
                    </select>
                    {errors.type && (
                        <span className="text-red-500 font-normal text-sm font-pricedown">
                            <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                            {errors.type.message}
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
                    <label>Producto o item</label>
                    <select
                        {...register("item", {
                            required: "Debes seleccionar uno"
                        })}
                        className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black dark:disabled:bg-zinc-700 disabled:bg-zinc-300"
                    >
                        <option value="">Selccione uno</option>
                        <optgroup label="Productos">
                            {
                                products.map((row, index) => (
                                    <option value={row._id} key={index}>
                                        {row.name}
                                    </option>
                                ))
                            }
                        </optgroup>
                        <optgroup label="Items">
                            {
                                items.map((row, index) => (
                                    <option value={row._id} key={index}>
                                        {row.name}
                                    </option>
                                ))
                            }
                        </optgroup>
                    </select>
                    {errors.item && (
                        <span className="text-red-500 font-normal text-sm font-pricedown">
                            <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                            {errors.item.message}
                        </span>
                    )}
                </motion.div>
                <Input
                    type="number"
                    className="no-spinner"
                    min={0}
                    label="Cantidad"
                    name="quantity"
                    register={register}
                    errors={errors.quantity}
                    validateAmount={(val: number) => val <= 0 ? "Indica un valor" : true}
                />
            </div>

            <Input
                rows={3}
                textarea
                label="Comentario"
                name="comment"
                register={register}
                errors={errors.comment}
            />

            <div className="w-full  sticky bottom-0 bg-main-background h-full z-50">
                <div className="py-4 flex flex-row gap-4 items-center justify-center px-6">
                    <button
                        onClick={onCancel}
                        className="w-full outline outline-2 outline-blue-500 py-2 rounded-full text-blue-600 font-black shadow-xl"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={!isValid || active}
                        className="disabled:bg-gray-400 w-full bg-blue-500 py-2 rounded-full text-white font-black shadow-xl truncate"
                    >
                        {active ? (
                            <i className="fa-solid fa-spinner animate-spin"></i>
                        ) : (
                            <>
                                {selectedInventario._id !== "" ? "Editar" : "Registrar"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default OtrasSalidasForm