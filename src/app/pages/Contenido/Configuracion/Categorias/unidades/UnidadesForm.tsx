import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { UnitMeasureApiConector } from "../../../../../../api/classes";
import toast from "react-hot-toast";
import Input from "../../../../EntryComponents/Inputs";
import { UnidadesContext } from "./UnidadesContext";
import { IUnitBody } from "../../../../../../api/types/unit-measure";

interface Props {
    isOpen: boolean;
    onCancel?: () => void
}

const UnidadesForm = ({ isOpen, onCancel }: Props) => {
    const { selectedItem } = useContext(UnidadesContext);
    const [active, setActive] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<IUnitBody['data']>({
        defaultValues: selectedItem._id === "" ? {} : { description: selectedItem.description, name: selectedItem.name },
        mode: 'all'
    });

    const onSubmit: SubmitHandler<IUnitBody['data']> = async (data) => {
        let res = null
        setActive(true)

        if (selectedItem._id !== "") {
            res = await UnitMeasureApiConector.update({ unitId: selectedItem._id, data })
        } else {
            res = await UnitMeasureApiConector.create({ data })
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
            <Input
                textarea
                label="Descripción"
                name="description"
                register={register}
                errors={errors.description}
                required
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

export default UnidadesForm