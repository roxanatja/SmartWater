import { FC, useContext, useEffect, useRef, useState } from "react";
import "./ItemsItem.css";
import { Option } from "../../../../components/Option/Option";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { PromocionesContext } from "../PromocionesContext";
import { PromotionApiConector } from "../../../../../../api/classes";
import { Promotion } from "../../../../../../type/Promotion";

interface Props {
    promotion: Promotion
}

const PromotionsItem: FC<Props> = ({ promotion }) => {
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const { setSelectedItem } = useContext(PromocionesContext);

    const optionsRef = useRef<HTMLDivElement>(null);

    const Opciones = () => {
        setShowOptions(!showOptions);
    };

    const Edit = () => {
        setSelectedItem(promotion);
        setShowOptions(false);
    };

    const Delete = async () => {
        toast.error(
            (t) => (
                <div>
                    <p className="mb-4 text-center text-[#888]">
                        Se <b>eliminará</b> esta promocióm, <br /> pulsa <b>Proceder</b> para continuar
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
                                const response = await PromotionApiConector.deletePromotion({ promotionId: promotion?._id || '' });
                                if (!!response) {
                                    if (response.message) {
                                        toast.success("Promoción eliminada correctamente", {
                                            position: "top-center",
                                            duration: 2000
                                        });
                                        window.location.reload();
                                    }
                                } else {
                                    toast.error("Error al eliminar promoción", {
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
                className={`mb-2 flex justify-between bg-blocks dark:border-blocks shadow-md border shadow-zinc-300/25 rounded-2xl p-2 overflow-hidden relative`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
            >
                <div className="flex flex-col gap-4 p-1 h-44 w-80">
                </div>

                <img
                    src={promotion.imageUrl || ''}
                    className="w-full h-full object-cover absolute top-0 left-0 rounded-md flex-1"
                    alt={promotion.imageUrl}
                />

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

export { PromotionsItem }