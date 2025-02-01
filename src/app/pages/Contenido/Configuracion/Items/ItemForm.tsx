import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ItemsApiConector } from "../../../../../api/classes";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Input from "../../../EntryComponents/Inputs";
import { ItemsContext } from "./ItemsContext";
import { IItemBody } from "../../../../../api/types/items";
import ImageUploadField from "../../../EntryComponents/ImageUploadField";
import { CategoryProduct } from "../../../../../type/Products/Category";
import { UnitMeasure } from "../../../../../type/Products/UnitMeasure";

interface Props {
    isOpen: boolean;
    onCancel?: () => void;
    categories: CategoryProduct[];
    units: UnitMeasure[];
}

const ItemForm = ({ isOpen, onCancel, categories, units }: Props) => {
    const { selectedItem } = useContext(ItemsContext);
    const [active, setActive] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid }, watch, setValue
    } = useForm<IItemBody['data']>({
        defaultValues: selectedItem._id === "" ? {} : {
            description: selectedItem.description,
            name: selectedItem.name,
            category: selectedItem.category?._id || undefined,
            unitMeasure: selectedItem.unitMeasure?._id || undefined,
            imageUrl: selectedItem.imageUrl
        },
        mode: 'all'
    });

    const onSubmit: SubmitHandler<IItemBody['data']> = async (data) => {
        let res = null
        setActive(true)

        if (selectedItem._id !== "") {
            res = await ItemsApiConector.update({ productId: selectedItem._id, data })
        } else {
            res = await ItemsApiConector.create({ data })
        }

        if (res) {
            toast.success(`Item ${selectedItem._id === "" ? "registrado" : "editado"} correctamente`, { position: "bottom-center" });
            window.location.reload();
        } else {
            toast.error("Upps error al crear el item", { position: "bottom-center" });
            setActive(false)
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 justify-center items-center w-full p-6"
        >
            <Input
                label="Nombre"
                name="name"
                register={register}
                errors={errors.name}
                required
            />

            <div className="flex gap-6 items-center w-full flex-col sm:flex-row">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full sm:w-1/2 flex flex-col gap-2"
                >
                    <label>Categoría</label>
                    <select
                        {...register("category", {
                            required: "Debes seleccionar una categoría"
                        })}
                        className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black dark:disabled:bg-zinc-700 disabled:bg-zinc-300"
                    >
                        <option value={"null"}>Seleccione una categoría</option>
                        {
                            categories.map((row, index) => (
                                <option value={row._id} key={index}>
                                    {row.name}
                                </option>
                            ))
                        }
                    </select>
                    {errors.category && (
                        <span className="text-red-500 font-normal text-sm font-pricedown">
                            <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                            {errors.category.message}
                        </span>
                    )}
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full sm:w-1/2 flex flex-col gap-2"
                >
                    <label>Unidad</label>
                    <select
                        {...register("unitMeasure", {
                            required: "Debes seleccionar una unidad"
                        })}
                        className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black"
                    >
                        <option value={"null"}>Seleccione una unidad</option>
                        {
                            units.map((row, index) => (
                                <option value={row._id} key={index}>
                                    {row.name}
                                </option>
                            ))
                        }
                    </select>
                    {errors.unitMeasure && (
                        <span className="text-red-500 font-normal text-sm font-pricedown">
                            <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                            {errors.unitMeasure.message}
                        </span>
                    )}
                </motion.div>
            </div>

            <ImageUploadField
                value={watch('imageUrl')}
                fieldName={"imageUrl"}
                label={"Imagen de item"}
                register={register}
                setValue={setValue}
                errors={errors.imageUrl}
                required={selectedItem._id === ""}
            />

            <Input
                textarea
                label="Descripción"
                name="description"
                register={register}
                errors={errors.description}
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
                                {selectedItem._id !== "" ? "Editar" : "Registrar"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default ItemForm