import { useContext } from "react";
import { ZonasContext } from "./ZonasContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { IZoneBody } from "../../../../../api/types/zones";
import { ZonesApiConector } from "../../../../../api/classes";
import toast from "react-hot-toast";
import Input from "../../../EntryComponents/Inputs";

interface Props {
    isOpen: boolean;
    onCancel?: () => void
}

const ZonasForm = ({ isOpen, onCancel }: Props) => {
    const { selectedZone } = useContext(ZonasContext);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<IZoneBody['data']>({
        defaultValues: selectedZone._id === "" ? {} : { description: selectedZone.description, districts: [], name: selectedZone.name },
        mode: 'all'
    });

    const onSubmit: SubmitHandler<IZoneBody['data']> = async (data) => {
        let res = null

        if (selectedZone._id !== "") {
            res = await ZonesApiConector.update({
                zoneId: selectedZone._id,
                data: {
                    ...data,
                    districts: selectedZone.districts.map(d => d._id)
                }
            })
        } else {
            res = await ZonesApiConector.create({ data })
        }

        if (res) {
            toast.success(`Zona ${selectedZone._id === "" ? "registrada" : "editada"} correctamente`, { position: "bottom-center" });
            window.location.reload();
        } else {
            toast.error("Upps error al crear la zona", { position: "bottom-center" });
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
                        disabled={(!watch('name') || watch('name').trim() === "")}
                        className="disabled:bg-gray-400 w-full bg-blue-500 py-2 rounded-full text-white font-black shadow-xl truncate"
                    >
                        {selectedZone._id !== "" ? "Editar" : "Registrar"} zona
                    </button>
                </div>
            </div>
        </form>
    )
}

export default ZonasForm