import React, { useContext, useEffect, useState } from 'react'
import { User } from '../../../../../../type/User';
import { MatchedElementRoot } from '../../../../../../type/Kardex';
import { InventariosFisicosContext } from '../InventariosFisicosProvider';
import { useFieldArray, useForm } from 'react-hook-form';
import moment from 'moment';
import { motion } from 'framer-motion';
import Input from '../../../../EntryComponents/Inputs';
import { IInitialBalanceBody } from '../../../../../../api/types/physical-inventory';
import toast from 'react-hot-toast';
import { PhysicalInventoryApiConector } from '../../../../../../api/classes/physical-inventory';

interface Props {
    onCancel?: () => void;
    distribuidores: User[];
    elements: MatchedElementRoot[];
}

type FormType = {
    registerDate: string;
    user: string;
    role: 'admin' | 'user';
    code?: string;  // For edit
    forceCreation?: boolean; // For create
    elements: {
        product?: string;
        item?: string;
        initialBalance: number;
    }[]
}

const SaldosInicialesForm = ({ distribuidores, elements, onCancel }: Props) => {
    const [active, setActive] = useState(false);
    const { selectedBalance } = useContext(InventariosFisicosContext)

    const { control, register, formState: { errors, isValid }, handleSubmit, watch, setValue } = useForm<FormType>({
        defaultValues: selectedBalance.code !== "" ? {
            registerDate: selectedBalance.showDate.format("YYYY-MM-DDTHH:mm"),
            code: selectedBalance.code,
            forceCreation: true,
            role: selectedBalance.user.isAdmin ? 'admin' : "user",
            user: selectedBalance.user._id,
            elements: selectedBalance.saldo.map(s => ({ product: s.product?._id, item: s.item?._id, initialBalance: s.initialBalance }))
        } : {},
        mode: 'all'
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'elements',
        rules: { required: "Debes agregar al menos un producto" }
    });

    const onSubmit = async (data: FormType) => {
        console.log(data)
        let res = null
        setActive(true)

        const formData: IInitialBalanceBody['data'] = {
            registerDate: data.registerDate,
            users: [{
                role: data.role,
                user: data.user,
                forceCreation: true,
                elements: data.elements.map(d => {
                    const res: IInitialBalanceBody['data']['users'][0]['elements'][0] = { initialBalance: Number(String(d.initialBalance)), }
                    if (d.item) { res.item = d.item }
                    if (d.product) { res.product = d.product }
                    return res
                })
            }]
        }

        // if (selectedBalance.code !== "") {
        //     res = await PhysicalInventoryApiConector.update({ data})
        // } else {
        res = await PhysicalInventoryApiConector.createBalance({ data: formData });
        // }

        if (res) {
            // toast.success(`Item ${selectedItem._id === "" ? "registrado" : "editado"} correctamente`, { position: "bottom-center" });
            if ('message' in res) {
                if ('results' in res) {
                    toast.success(`Ingreso registrado correctamente`, { position: "bottom-center" });
                    window.location.reload();
                } else {
                    toast.error(res.message, { position: "bottom-right", duration: 2000 });
                    setActive(false)
                }
            } else {
                toast.error("Upps error al registrar el ingreso", { position: "bottom-right" });
                setActive(false)
            }
        } else {
            toast.error("Upps error al registrar el ingreso", { position: "bottom-right" });
            setActive(false)
        }
    }

    const validateHours = (val: string): string | boolean => {
        const check = moment(val)
        const end = moment()

        if (check.isAfter(end)) {
            return `La fecha de cierre debe ser menor que la fecha y hora actual`
        }

        return true
    }

    const user = watch('user')
    useEffect(() => {
        if (user) {
            const dist = distribuidores.find(d => d._id === user)

            if (dist) {
                setValue('role', dist.role === 'admin' ? 'admin' : 'user')
            }
        }
    }, [user, distribuidores, setValue])

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6 justify-center items-center w-full p-6"
        >
            <div className="flex gap-4 justify-between text-sm flex-wrap w-full">
                <Input
                    label="Fecha y hora final"
                    name="registerDate"
                    type="datetime-local"
                    errors={errors.registerDate}
                    register={register}
                    required
                    className="full-selector"
                    max={moment().format("YYYY-MM-DDTHH:mm")}
                    validateAmount={(val) => validateHours(val)}
                />

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full flex flex-col gap-2"
                >
                    <label htmlFor='user'>Distribuidores</label>
                    <select id='user' {...register('user', { required: "Debes seleccionar un distribuidor" })} className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black">
                        <option value="">Sin selección</option>
                        {
                            distribuidores.map(d =>
                                <option key={d._id} value={d._id}>{d.fullName || "Sin nombre"} {d.role === 'admin' ? "(Administrador)" : ""}</option>
                            )
                        }
                    </select>
                    {errors.user && (
                        <span className="text-red-500 font-normal text-sm font-pricedown">
                            <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                            {errors.user.message}
                        </span>
                    )}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full flex flex-col gap-2"
                >
                    <label htmlFor='element'>Productos</label>
                    <select id='element' onChange={e => {
                        const prod = elements.find(d => d._id === e.target.value)

                        if (prod) {
                            const elem: FormType['elements'][0] = { initialBalance: 0 }

                            if (prod.isProduct) {
                                elem.product = prod._id

                                if (prod.isItem && prod.matchingItems && prod.matchingItems.length > 0) {
                                    elem.item = prod.matchingItems[0]._id
                                }
                            } else {
                                elem.item = prod._id
                            }

                            append(elem)
                        }
                    }} className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black">
                        <option value="">Sin selección</option>
                        {
                            elements
                                .filter(d => !(watch('elements') || []).some(u => d._id === (u.product ? u.product : u.item)))
                                .map(d =>
                                    <option key={d._id} value={d._id}>{d.name || "Sin nombre"}</option>
                                )
                        }
                    </select>
                    {errors.elements?.root && (
                        <span className="text-red-500 font-normal text-sm font-pricedown">
                            <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                            {errors.elements.root.message}
                        </span>
                    )}
                </motion.div>

                {
                    fields.map((field, index) => {
                        const prod = elements.find(d => d._id === (field.product ? field.product : field.item))
                        return (
                            <div key={field.id} className='flex justify-between items-center gap-4 w-full'>
                                <Input
                                    containerClassName="w-full"
                                    label={prod?.name || "Producto desconocido"}
                                    name={`elements.${index}.initialBalance`}
                                    numericalOnly
                                    required
                                    register={register}
                                    validateAmount={(val: number) => (val <= 0) ? "Ingrese un valor mayor que 0" : true}
                                    errors={errors.elements?.[index]?.initialBalance}
                                />

                                <button type='button' className='mt-6' onClick={() => remove(index)}>
                                    <i className='fa fa-x'></i>
                                </button>
                            </div>
                        )
                    })
                }
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
                                {selectedBalance.code !== "" ? "Editar" : "Generar"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default SaldosInicialesForm