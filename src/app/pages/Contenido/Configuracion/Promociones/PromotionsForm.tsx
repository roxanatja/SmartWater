import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { PromotionApiConector } from "../../../../../api/classes";
import toast from "react-hot-toast";
import { PromocionesContext } from "./PromocionesContext";
import { IPromotionBody } from "../../../../../api/types/promotion";
import ImageUploadField from "../../../EntryComponents/ImageUploadField";

interface Props {
    isOpen: boolean;
    onCancel?: () => void
}

const PromotionsForm = ({ isOpen, onCancel }: Props) => {
    const { selectedItem } = useContext(PromocionesContext);
    const [active, setActive] = useState(false);

    const {
        register, watch, setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<IPromotionBody['data']>({
        defaultValues: selectedItem._id === "" ? {} : { imageUrl: selectedItem.imageUrl },
        mode: 'all'
    });

    const onSubmit: SubmitHandler<IPromotionBody['data']> = async (data) => {
        let res = null
        setActive(true)

        if (selectedItem._id !== "") {
            res = await PromotionApiConector.updatePromotion({ promotionId: selectedItem._id, data })
        } else {
            res = await PromotionApiConector.createPromotion({ data })
        }

        if (res) {
            toast.success(`Promoción ${selectedItem._id === "" ? "registrada" : "editada"} correctamente`, { position: "bottom-center" });
            window.location.reload();
        } else {
            toast.error("Upps error al crear la promoción", { position: "bottom-center" });
            setActive(false)
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 justify-center items-center w-full p-6"
        >
            <div className="w-full">
                <label className="block mb-2">Imagen de la promoción</label>
                <ImageUploadField
                    value={watch('imageUrl')}
                    fieldName={"imageUrl"}
                    label={"Por favor, adjunta imagen de la promoción"}
                    register={register}
                    setValue={setValue}
                    errors={errors.imageUrl}
                    required={true}
                />
            </div>

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
                        disabled={!watch('imageUrl') || active}
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

export default PromotionsForm