import React, { useContext, useState } from 'react'
import { CategoryProduct } from '../../../../../type/Products/Category';
import { ProductosContext } from './ProductosContext';
import { SubmitHandler, useForm } from 'react-hook-form';
import { IProductBody } from '../../../../../api/types/products';
import { ProductsApiConector } from '../../../../../api/classes';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Input from '../../../EntryComponents/Inputs';
import ImageUploadField from '../../../EntryComponents/ImageUploadField';
import { UnitMeasure } from '../../../../../type/Products/UnitMeasure';

interface Props {
    isOpen: boolean;
    onCancel?: () => void;
    categories: CategoryProduct[];
    units: UnitMeasure[];
}


const ProductForm = ({ categories, units, isOpen, onCancel }: Props) => {
    const { selectedProduct } = useContext(ProductosContext);
    const [active, setActive] = useState(false);

    const {
        register,
        watch,
        setValue,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<IProductBody['data']>({
        defaultValues: selectedProduct._id === "" ? {} : {
            name: selectedProduct.name, description: selectedProduct.description, category: (selectedProduct.category as CategoryProduct)._id,
            unitMeasure: (selectedProduct.unitMeasure as UnitMeasure)._id, imageUrl: selectedProduct.imageUrl, price: selectedProduct.price, priceBusiness: selectedProduct.priceBusiness,
            canSellAndLend: false
        },
        mode: 'all'
    });

    const onSubmit: SubmitHandler<IProductBody['data']> = async (data) => {
        setActive(true)

        let res = null
        if (selectedProduct._id !== "") {
            res = await ProductsApiConector.update({
                productId: selectedProduct._id, data
            })

        } else {
            res = await ProductsApiConector.create({ data })
        }

        if (res) {
            toast.success(`Producto ${selectedProduct._id === "" ? "creado" : "editado"} correctamente`, { position: "bottom-center" });
            window.location.reload();
            if (onCancel) onCancel()
        } else {
            toast.error("Upps error al editar el producto", { position: "bottom-center" });
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
                <Input
                    sufix={<>Bs.</>}
                    numericalOnly
                    label="Precio"
                    name="priceBusiness"
                    register={register}
                    errors={errors.priceBusiness}
                    required
                />
                <Input
                    sufix={<>Bs.</>}
                    numericalOnly
                    label="Precio Clientes"
                    name="price"
                    register={register}
                    errors={errors.price}
                    required
                />
            </div>

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

            {
                selectedProduct._id === "" &&
                <div className="flex gap-2 items-center w-full">
                    <input type="checkbox" id="lendAndSell" className='accent-blue_custom' checked={watch('canSellAndLend')} onChange={() => {
                        setValue('canSellAndLend', !watch('canSellAndLend'), { shouldValidate: true })
                    }} />
                    <label htmlFor="lendAndSell">Crear también como item</label>
                </div>
            }

            <ImageUploadField
                value={watch('imageUrl')}
                fieldName={"imageUrl"}
                label={"Imagen de producto"}
                register={register}
                setValue={setValue}
                errors={errors.imageUrl}
                required={selectedProduct._id === ""}
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
                        disabled={(!isValid || !watch('imageUrl')) || active}
                        className="disabled:bg-gray-400 w-full bg-blue-500 py-2 rounded-full text-white font-black shadow-xl truncate"
                    >
                        {active ? (
                            <i className="fa-solid fa-spinner animate-spin"></i>
                        ) : (
                            <>
                                {selectedProduct._id !== "" ? "Editar" : "Registrar"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default ProductForm