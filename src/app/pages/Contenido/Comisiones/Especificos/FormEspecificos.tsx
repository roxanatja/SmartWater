import React, { useContext, useState } from 'react'
import { User } from '../../../../../type/User';
import Product from '../../../../../type/Products/Products';
import moment from 'moment';
import momentTz from 'moment-timezone';
import { useFieldArray, useForm } from 'react-hook-form';
import { ComisionesEspecificosContext } from './ComisionesEspecificosProvider';
import Input from '../../../EntryComponents/Inputs';
import { motion } from 'framer-motion'
import toast from 'react-hot-toast';
import { ComissionsApiConector } from '../../../../../api/classes/comissions';

interface Props {
    onCancel?: () => void;
    distribuidores: User[]
    products: Product[]
}

type FormType = {
    initialDate: string;
    finalDate: string;
    users: {
        user_id: string;
        percent: {
            product: string;
            value: number | null;
        }[];
    }[]
}

const FormEspecificos = ({ distribuidores, products, onCancel }: Props) => {
    const [active, setActive] = useState(false);
    const { selectedInventario } = useContext(ComisionesEspecificosContext)

    const { control, register, formState: { errors, isValid }, handleSubmit, watch } = useForm<FormType>({
        defaultValues: selectedInventario._id !== "" ? {
            finalDate: moment.utc(selectedInventario.endDate).format("YYYY-MM-DDTHH:mm"),
            initialDate: moment.utc(selectedInventario.initialDate).format("YYYY-MM-DDTHH:mm"),
            users: [{
                user_id: selectedInventario.user._id,
                percent: products.map(p => ({
                    product: p._id,
                    value: selectedInventario.details.filter(d => !!d).find(i => i.product === p._id)?.percentageElem || null
                }))
            }]
        } : {},
        mode: 'all'
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'users',
        rules: {
            required: "Debes agregar al menos un distribuidor",
            validate: (val) => {
                return val.every(v => v.percent.some(p => {
                    return p.value && Number(String(p.value)) > 0
                }))
            }
        }
    });

    const onSubmit = async (data: FormType) => {
        let res = null
        setActive(true)

        if (selectedInventario._id !== "") {
            res = await ComissionsApiConector.updateSpecific({
                comissionId: selectedInventario._id,
                data: {
                    elements: data.users[0].percent.filter(p => p.value && p.value > 0).map(p => ({
                        product: p.product,
                        percentageElem: Number(String(p.value!))
                    }))
                }
            })
        } else {
            res = await ComissionsApiConector.createSpecific({
                data: {
                    users: data.users.map(u => ({
                        endDate: momentTz(data.finalDate).tz("America/La_Paz").format(),
                        initialDate: momentTz(data.initialDate).tz("America/La_Paz").format(),
                        user: u.user_id,
                        elements: u.percent.filter(p => p.value && p.value > 0).map(p => ({
                            product: p.product,
                            percentage: Number(String(p.value!))
                        }))
                    }))
                }
            });
        }

        if (res) {
            toast.success(`Comisión ${selectedInventario._id === "" ? "registrada" : "editada"} correctamente`, { position: "bottom-center" });
            // toast.success(`Ingreso registrado correctamente`, { position: "bottom-center" });
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
                <div className="flex gap-4 flex-wrap w-full">
                    <Input
                        containerClassName='flex-1 w-full'
                        label="Fecha y hora inicial"
                        name="initialDate"
                        type="datetime-local"
                        errors={errors.initialDate}
                        register={register}
                        required
                        className="full-selector opacity-40"
                        disabled={selectedInventario._id !== ""}
                        max={watch('finalDate') ? moment(watch('finalDate')!.toString()).format("YYYY-MM-DDTHH:mm") : moment().format("YYYY-MM-DDTHH:mm")}
                        validateAmount={(val) => validateHours(val, 'init')}
                    />
                    <Input
                        containerClassName='flex-1 w-full'
                        label="Fecha y hora final"
                        name="finalDate"
                        type="datetime-local"
                        errors={errors.finalDate}
                        register={register}
                        required
                        className="full-selector opacity-40"
                        disabled={selectedInventario._id !== ""}
                        min={watch('initialDate') ? moment(watch('initialDate')!.toString()).format("YYYY-MM-DDTHH:mm") : undefined}
                        validateAmount={(val) => validateHours(val, 'end')}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full flex flex-col gap-2"
                >
                    <label htmlFor='user'>Distribuidores</label>
                    <select id='user'
                        disabled={selectedInventario._id !== ""}
                        onChange={e => {
                            append({ user_id: e.target.value, percent: products.map(p => ({ product: p._id, value: null })) })
                        }} className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black disabled:opacity-40">
                        <option value="">Sin selección</option>
                        {
                            distribuidores
                                .filter(d => !(watch('users') || []).some(u => u.user_id === d._id))
                                .map(d =>
                                    <option key={d._id} value={d._id}>{d.fullName || "Sin nombre"} {d.role === 'admin' ? "(Administrador)" : ""}</option>
                                )
                        }
                    </select>
                    {(errors.users?.root && errors.users.root.type === 'required') && (
                        <span className="text-red-500 font-normal text-sm font-pricedown">
                            <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                            {errors.users.root.message}
                        </span>
                    )}
                </motion.div>

                <div className="flex flex-row flex-nowrap overflow-x-auto relative w-full border rounded-[20px] py-4">
                    <div className="flex flex-col gap-3 sticky left-0 flex-1 bg-main-background z-10">
                        <div className='pt-1 pb-5 pl-6 border-b font-semibold'>Productos</div>
                        {
                            products.map(p => <div className='pl-6 py-2 whitespace-nowrap max-h-[40px] h-[40px] flex items-center' key={p._id}>{p.name}</div>)
                        }
                    </div>

                    {
                        fields.map((field, index) => {
                            const dist = distribuidores.find(d => d._id === field.user_id)
                            return (
                                <div key={field.user_id} className='flex flex-col gap-3 min-w-[300px] flex-1'>
                                    <div className='pt-1 pb-5 border-b flex justify-between items-center gap-4 w-full px-6 whitespace-nowrap font-semibold'>
                                        {`${dist?.fullName || "Distribuidor desconocido"} ${dist?.role === 'admin' ? "(Administrador)" : ""}`}

                                        <button type='button' onClick={() => remove(index)}>
                                            <i className='fa fa-x'></i>
                                        </button>
                                    </div>
                                    {
                                        field.percent.map((i, indexPerc) =>
                                            <Input
                                                key={`percent_${field.user_id}_${i.product}`}
                                                containerClassName="w-full px-6 max-h-[40px] h-[40px]"
                                                label=""
                                                isVisibleLable
                                                name={`users.${index}.percent.${indexPerc}.value`}
                                                className='outline-dashed !outline-font-color/30'
                                                numericalOnly
                                                register={register}
                                                validateAmount={(val: number) => val && (val < 0 || val > 100) ? "Ingrese un valor entre 1 y 100" : true}
                                                errors={errors.users?.[index]?.percent?.[indexPerc]?.value}
                                            />
                                        )
                                    }

                                </div>
                            )
                        })
                    }
                </div>
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

export default FormEspecificos