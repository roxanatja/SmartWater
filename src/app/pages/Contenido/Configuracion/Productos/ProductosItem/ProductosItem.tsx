import { FC, useContext, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "./ProductosItem.css";
import { Option } from "../../../../components/Option/Option";
import Product from "../../../../../../type/Products/Products";
import { ProductosContext } from "../ProductosContext";
import toast from "react-hot-toast";
import { ProductsApiConector } from "../../../../../../api/classes";
import { CategoryProduct } from "../../../../../../type/Products/Category";
import { UnitMeasure } from "../../../../../../type/Products/UnitMeasure";

interface Props {
    product: Product;
}

const ProductosItem: FC<Props> = ({ product }) => {

    const [showOptions, setShowOptions] = useState<boolean>(false);
    const { setSelectedProduct } = useContext(ProductosContext);

    const optionsRef = useRef<HTMLDivElement>(null);

    const Opciones = () => {
        setShowOptions(!showOptions);
    };

    const Edit = () => {
        setSelectedProduct(product);
        setShowOptions(false);
    };

    const Delete = async () => {
        toast.error(
            (t) => (
                <div>
                    <p className="mb-4 text-center text-[#888]">
                        Se <b>eliminará</b> este producto, <br /> pulsa <b>Proceder</b> para continuar
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
                                const response = await ProductsApiConector.delete({ productId: product?._id || '' }) as any;
                                if (!!response) {
                                    if (response.mensaje) {
                                        toast.success(response.mensaje, {
                                            position: "top-center",
                                            duration: 2000
                                        });
                                        window.location.reload();
                                    } else if (response.error) {
                                        toast.error(response.error, {
                                            position: "top-center",
                                            duration: 2000
                                        });
                                    }
                                } else {
                                    toast.error("Error al eliminar barrio", {
                                        position: "top-center",
                                        duration: 2000
                                    });
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
        setShowOptions(false);
    };


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                optionsRef.current &&
                !optionsRef.current.contains(event.target as Node)
            ) {
                setShowOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <>
            <motion.div
                className={`mb-2 flex justify-between bg-blocks dark:border-blocks shadow-md border shadow-zinc-300/25 rounded-2xl px-4 pt-2 pb-6 gap-4`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex flex-col gap-4 p-1 w-full">
                    <div className="flex justify-between w-full gap-3">
                        <strong>Nombre:</strong><span>{product.name}</span>
                    </div>
                    <div className="flex justify-between w-full gap-3">
                        <strong>Precio empresa:</strong><span>{product.priceBusiness} Bs.</span>
                    </div>
                    <div className="flex justify-between w-full gap-3">
                        <strong>Precio clientes:</strong><span>{product.price} Bs.</span>
                    </div>
                    <div className="flex justify-between w-full gap-3">
                        <strong>Categoría:</strong><span>{(product.category as CategoryProduct).name}</span>
                    </div>
                    <div className="flex justify-between w-full gap-3">
                        <strong>Unidad de medida:</strong><span>{(product.unitMeasure as UnitMeasure).name}</span>
                    </div>
                    <div className="flex flex-col w-full gap-3">
                        <strong>Imagen:</strong>
                        <img src={product.imageUrl} alt="Product" className="w-[150px] h-auto object-cover mx-auto" />
                    </div>
                </div>
                <div className="flex gap-2 items-start flex-col pt-2 relative" ref={optionsRef}>
                    <button type="button" className="invert-0 dark:invert" onClick={() => Opciones()}>
                        <img src="/opcion-icon.svg" alt="" />
                    </button>
                    <Option
                        editAction={Edit}
                        visible={showOptions}
                        editar={true}
                        eliminar={true}
                        deleteAction={Delete}
                    />
                </div>
            </motion.div>
        </>
    )
}

export { ProductosItem }