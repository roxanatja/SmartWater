import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../../../EntryComponents/Inputs";
import moment from "moment";
import { ComisionesGeneralContext } from "./ComisionesGeneralProvider";

interface Props {
    onCancel?: () => void;
}

type FormType = {
    initialDate: string;
    finalDate: string;
    percent: number;
}

const FormGeneral = ({ onCancel }: Props) => {
    const [active, setActive] = useState(false);
    const { selectedInventario } = useContext(ComisionesGeneralContext)

    const { register, formState: { errors, isValid }, handleSubmit, watch } = useForm<FormType>({
        defaultValues: selectedInventario._id !== "" ? {
            finalDate: selectedInventario.finalDate,
            initialDate: selectedInventario.initialDate,
            percent: selectedInventario.percent
        } : {},
        mode: 'all'
    })

    const onSubmit = async (data: FormType) => {
        alert(JSON.stringify(data, null, 2))
        let res = null
        setActive(true)

        // if (selectedItem._id !== "") {
        //     res = await ItemsApiConector.update({ productId: selectedItem._id, data })
        // } else {
        // res = await KardexApiConector.registerEntryMore({ data: requestBody });
        // }

        // if (res) {
        //     // toast.success(`Item ${selectedItem._id === "" ? "registrado" : "editado"} correctamente`, { position: "bottom-center" });
        //     toast.success(`Ingreso registrado correctamente`, { position: "bottom-center" });
        //     window.location.reload();
        // } else {
        //     toast.error("Upps error al registrar el ingreso", { position: "bottom-center" });
        setActive(false)
        // }
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
                    className="full-selector"
                    max={watch('finalDate') ? moment(watch('finalDate')!.toString()).format("YYYY-MM-DDTHH:mm") : moment().format("YYYY-MM-DDTHH:mm")}
                    validateAmount={(val) => validateHours(val, 'init')}
                />
                <Input
                    label="Fecha y hora final"
                    name="finalDate"
                    type="datetime-local"
                    errors={errors.finalDate}
                    register={register}
                    className="full-selector"
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