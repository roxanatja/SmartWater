import { FC, useContext, useEffect, useRef, useState } from "react";
import "./ItemsItem.css";
import { Option } from "../../../../components/Option/Option";
import { Item } from "../../../../../../type/Item";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ItemsContext } from "../ItemsContext";
import { ItemsApiConector } from "../../../../../../api/classes";
import { CategoryProduct } from "../../../../../../type/Products/Category";
import { UnitMeasure } from "../../../../../../type/Products/UnitMeasure";

interface Props {
    item: Item
}

const ItemsItem: FC<Props> = ({ item }) => {
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const { setSelectedItem } = useContext(ItemsContext);

    const optionsRef = useRef<HTMLDivElement>(null);

    const Opciones = () => {
        setShowOptions(!showOptions);
    };

    const Edit = () => {
        setSelectedItem(item);
        setShowOptions(false);
    };

    const Delete = async () => {
        toast.error(
            (t) => (
                <div>
                    <p className="mb-4 text-center text-[#888]">
                        Se <b>eliminará</b> este item, <br /> pulsa <b>Proceder</b> para continuar
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
                                const response = await ItemsApiConector.delete({ productId: item?._id || '' }) as any;
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
                                    toast.error("Error al eliminar cliente", {
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
                className={`mb-2 flex justify-between bg-blocks dark:border-blocks shadow-md border shadow-zinc-300/25 rounded-2xl p-2`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex flex-col gap-4 p-1 w-[calc(100%_-_30px)]">
                    <p>
                        <strong>{item.name}</strong>
                    </p>

                    <div className="flex justify-between w-full gap-3">
                        <strong>Categoría:</strong><span>{(item.category as CategoryProduct)?.name || "N/A"}</span>
                    </div>
                    <div className="flex justify-between w-full gap-3">
                        <strong>Unidad de medida:</strong><span>{(item.unitMeasure as UnitMeasure)?.name || "N/A"}</span>
                    </div>
                    <div className="flex flex-col w-full gap-3">
                        {
                            item.imageUrl && <>
                                <strong>Imagen:</strong>
                                <img src={item.imageUrl} alt="Product" className="w-[150px] h-auto object-cover mx-auto" />
                            </>
                        }
                    </div>
                </div >
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
            </motion.div >
        </>
    )
}

export { ItemsItem }