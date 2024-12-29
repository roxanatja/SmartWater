import React, { useContext, useState } from 'react'
import { BarriosContext } from './BarriosContext';
import { IDistricBody } from '../../../../../api/types/districts';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { DistrictsApiConector, ZonesApiConector } from '../../../../../api/classes';
import Input from '../../../EntryComponents/Inputs';
import { AuthService } from '../../../../../api/services/AuthService';
import { motion } from 'framer-motion'
import { Zone } from '../../../../../type/City';

interface Props {
    isOpen: boolean;
    onCancel?: () => void;
    zonas: Zone[];
}

const BarrioForm = ({ isOpen, onCancel, zonas }: Props) => {
    const { selectedDistrict } = useContext(BarriosContext);
    const [active, setActive] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<IDistricBody['data'] & { zone: string }>({
        defaultValues: selectedDistrict._id === "" ? {} : { name: selectedDistrict.name, description: selectedDistrict.description },
        mode: 'all'
    });

    const onSubmit: SubmitHandler<IDistricBody['data'] & { zone: string }> = async (data) => {
        const cityId = (AuthService.getUser()?.city?.id || "")
        setActive(true)

        if (selectedDistrict._id !== "") {
            const res = await DistrictsApiConector.update({
                districtId: selectedDistrict._id,
                data: {
                    description: data.description,
                    name: data.name
                }
            })

            if (res) {
                toast.success(`Barrio editado correctamente`, { position: "bottom-center" });
                window.location.reload();
                if (onCancel) onCancel()
            } else {
                toast.error("Upps error al editar el barrio", { position: "bottom-center" });
                setActive(false)
            }
        } else {
            const exists = await DistrictsApiConector.findByNamaOrCity({
                filters: { cityId, name: data.name }
            })

            let districtId = ""
            if (exists?.exist && exists.exist.length > 0) {
                districtId = exists.exist[0]._id
            } else {
                const res = await DistrictsApiConector.create({
                    data: {
                        cityId,
                        description: data.description,
                        name: data.name,
                    }
                })

                if (res?.id) {
                    districtId = res.id;
                } else {
                    toast.error("Upps error al crear el barrio", { position: "bottom-center" });
                    setActive(false)
                    return;
                }
            }

            // FIXME: Error when assigning
            const endRes = await ZonesApiConector.assignDistrict({ data: { cityId, district: districtId, zoneId: data.zone } })

            if (endRes) {
                toast.success(exists?.exist && exists.exist.length > 0 ? "El barrio existía y se ha asignado a la zona seleccionada" : `Barrio creado correctamente`, { position: "bottom-center" });
                window.location.reload();
                if (onCancel) onCancel()
            } else {
                toast.error("Upps error al editar el barrio", { position: "bottom-center" });
                setActive(false)
            }
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
            {
                selectedDistrict._id === "" &&
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full flex flex-col gap-2"
                >
                    <label>Barrio</label>
                    <select
                        {...register("zone", {
                            required: selectedDistrict._id !== "" ? undefined : "Debes seleccionar una zona"
                        })}
                        className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black"
                    >
                        {
                            zonas.map((row, index) => (
                                <option value={row._id} key={index}>
                                    {row.name}
                                </option>
                            ))
                        }
                    </select>
                    {errors.zone && (
                        <span className="text-red-500 font-normal text-sm font-pricedown">
                            <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                            {errors.zone.message}
                        </span>
                    )}
                </motion.div>
            }

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
                                {selectedDistrict._id !== "" ? "Editar" : "Registrar"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default BarrioForm