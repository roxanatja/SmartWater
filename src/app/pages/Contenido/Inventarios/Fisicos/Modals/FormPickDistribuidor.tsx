import { useState } from 'react'
import { useForm } from 'react-hook-form';
import moment from 'moment';
import momentTz from 'moment-timezone';
import { motion } from 'framer-motion'
import { User } from '../../../../../../type/User';
import Input from '../../../../EntryComponents/Inputs';
import { PhysicalInventoryApiConector } from '../../../../../../api/classes/physical-inventory';

interface Props {
    onCancel?: () => void;
    distribuidores: User[]
}

type FormType = {
    initialDate: string;
    finalDate: string;
    users: string
}

const FormPickDistribuidor = ({ onCancel, distribuidores }: Props) => {
    const [active, setActive] = useState(false);

    const { register, formState: { errors, isValid }, handleSubmit, watch } = useForm<FormType>({
        mode: 'all'
    })

    const onSubmit = async (data: FormType) => {
        setActive(true)

        const res = await PhysicalInventoryApiConector.get({
            type: 'prev-report',
            filters: {
                endDate: momentTz(data.finalDate).tz("America/La_Paz").format("YYYY-MM-DDTHH:mm:ss"),
                initialDate: momentTz(data.initialDate).tz("America/La_Paz").format("YYYY-MM-DDTHH:mm:ss"),
                user: data.users
            }
        });

        console.log(res)
        setActive(false)

        // if (res) {
        //     // toast.success(`Item ${selectedItem._id === "" ? "registrado" : "editado"} correctamente`, { position: "bottom-center" });
        //     toast.success(`Comisión registrada correctamente`, { position: "bottom-center" });
        //     window.location.reload();
        // } else {
        //     toast.error("Upps error al registrar la comisión", { position: "bottom-center" });
        //     setActive(false)
        // }
    }

    const validateHours = (val: string, type: 'init' | 'end'): string | boolean => {
        if (type === 'init') {
            const hasEnd = watch('initialDate')
            const init = moment(val)
            const end = moment(watch('finalDate'))

            if (hasEnd && init.isSameOrAfter(end)) {
                return `La fecha de apertura debe ser menor que la fecha y hora ${hasEnd ? "de cierre" : "actual"}`
            }

            return true
        }

        if (type === 'end') {
            const hasStart = watch('initialDate')
            const check = moment(val)
            const init = hasStart ? moment(watch('initialDate')) : undefined

            if (init && check.isSameOrBefore(init)) {
                return `La fecha de cierre debe ser mayor que la fecha y hora de apertura`
            }

            if (check.isAfter(moment())) {
                return `La fecha de cierre debe ser menor o igual a la fecha y hora actual`
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
                    required
                    className="full-selector"
                    min={watch('initialDate') ? moment(watch('initialDate')!.toString()).format("YYYY-MM-DDTHH:mm") : undefined}
                    max={moment().format("YYYY-MM-DDTHH:mm")}
                    validateAmount={(val) => validateHours(val, 'end')}
                />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full flex flex-col gap-2"
                >
                    <label htmlFor='user'>Distribuidores</label>
                    <select id='user' {...register('users', { required: "Selecciona uno" })} className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black">
                        <option value="">Sin selección</option>
                        {
                            distribuidores.map(d =>
                                <option key={d._id} value={d._id}>{d.fullName || "Sin nombre"} {d.role === 'admin' ? "(Administrador)" : ""}</option>
                            )
                        }
                    </select>
                    {errors.users?.root && (
                        <span className="text-red-500 font-normal text-sm font-pricedown">
                            <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                            {errors.users.root.message}
                        </span>
                    )}
                </motion.div>
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
                            <span>Generar</span>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default FormPickDistribuidor