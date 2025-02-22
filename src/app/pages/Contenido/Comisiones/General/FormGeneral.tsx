import { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../../../EntryComponents/Inputs";
import moment from "moment";
import toast from "react-hot-toast";
import { ComissionsApiConector } from "../../../../../api/classes/comissions";
import { Comission } from "../../../../../type/Comission";

interface Props {
    onCancel?: () => void;
    selectedInventario: Comission<'general'> | Comission<'byuser'>
}

type FormType = {
    initialDate: string;
    finalDate: string;
    percent: number;
}

const FormGeneral = ({ onCancel, selectedInventario }: Props) => {
    const [active, setActive] = useState(false);

    const { register, formState: { errors, isValid }, handleSubmit, watch } = useForm<FormType>({
        defaultValues: selectedInventario._id !== "" ? {
            finalDate: moment.utc(selectedInventario.endDate).format("YYYY-MM-DDTHH:mm"),
            initialDate: moment.utc(selectedInventario.initialDate).format("YYYY-MM-DDTHH:mm"),
            percent: selectedInventario.percentage
        } : {},
        mode: 'all'
    })

    const onSubmit = async (data: FormType) => {
        let res = null
        setActive(true)

        if (selectedInventario._id !== "") {
            res = await ComissionsApiConector.updateByUser({ comissionId: selectedInventario._id, data: { percentage: data.percent } })
        } else {
            res = await ComissionsApiConector.createGeneral({
                data: {
                    endDate: data.finalDate,
                    initialDate: data.initialDate,
                    percentage: data.percent
                }
            });
        }

        if (res) {
            toast.success(`Comisión ${selectedInventario._id === "" ? "registrada" : "editada"} correctamente`, { position: "bottom-center" });
            window.location.reload();
        } else {
            toast.error("Upps error al registrar la comisión", { position: "bottom-center" });
            setActive(false)
        }
    }

    const validateHours = (val: string, type: 'init' | 'end'): string | boolean => {
        if (type === 'init') {
            const hasEnd = watch('initialDate')
            const init = moment(val)
            const end = hasEnd ? moment(watch('finalDate')) : moment()

            if (init.isSameOrAfter(end)) {
                return `La fecha de apertura debe ser menor que la fecha y hora ${hasEnd ? "de cierre" : "actual"}`
            }

            return true
        }

        if (type === 'end') {
            const hasStart = watch('initialDate')
            const check = moment(val)
            const init = hasStart ? moment(watch('initialDate')) : undefined
            const end = moment()

            if (check.isAfter(end)) {
                return `La fecha de cierre debe ser menor que la fecha y hora actual`
            }
            if (init && check.isSameOrBefore(init)) {
                return `La fecha de cierre debe ser mayor que la fecha y hora de apertura`
            }

            return true
        }

        return true
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 justify-center items-center w-full p-6"
        >
            <div className="flex gap-4 justify-between text-sm flex-wrap w-full">
                <Input
                    label="Fecha y hora inicial"
                    name="initialDate"
                    type="datetime-local"
                    errors={errors.initialDate}
                    register={register}
                    required
                    className="full-selector disabled:opacity-40"
                    disabled={selectedInventario._id !== ""}
                    max={watch('finalDate') ? moment(watch('finalDate')!.toString()).format("YYYY-MM-DDTHH:mm") : moment().format("YYYY-MM-DDTHH:mm")}
                    validateAmount={(val) => validateHours(val, 'init')}
                />
                <Input
                    label="Fecha y hora final"
                    name="finalDate"
                    type="datetime-local"
                    errors={errors.finalDate}
                    register={register}
                    className="full-selector disabled:opacity-40"
                    disabled={selectedInventario._id !== ""}
                    min={watch('initialDate') ? moment(watch('initialDate')!.toString()).format("YYYY-MM-DDTHH:mm") : undefined}
                    max={moment().format("YYYY-MM-DDTHH:mm")}
                    validateAmount={(val) => validateHours(val, 'end')}
                />

                <Input
                    containerClassName="flex-1"
                    label="Porcentaje"
                    name="percent"
                    numericalOnly
                    required
                    register={register}
                    validateAmount={(val: number) => (val <= 0 || val > 100) ? "Ingrese un valor entre 1 y 100" : true}
                    errors={errors.percent}
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
                        disabled={!isValid || active}
                        className="disabled:bg-gray-400 w-full bg-blue-500 py-2 rounded-full text-white font-black shadow-xl truncate"
                    >
                        {active ? (
                            <i className="fa-solid fa-spinner animate-spin"></i>
                        ) : (
                            <>
                                {selectedInventario._id !== "" ? "Editar" : "Generar"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default FormGeneral