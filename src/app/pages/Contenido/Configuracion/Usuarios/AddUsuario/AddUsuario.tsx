import { useContext, useEffect, useState } from "react";
import "./AddUsuario.css";
import { UsuariosContext } from "../UsuariosContext";
import { SubmitHandler, useForm } from "react-hook-form";
import { IRegisterBody } from "../../../../../../api/types/users";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import * as Yup from "yup";
import { UsersApiConector } from "../../../../../../api/classes";
import Input from "../../../../EntryComponents/Inputs";
import { isValidPhoneNumber } from "libphonenumber-js";
import { Schedule } from "../../../../../../type/Schedule";

interface Props {
    isOpen: boolean;
    isDeactivated?: boolean;
    onCancel?: () => void;
    schedules: Schedule[]
}


const AddUsuario = ({ isOpen, onCancel, schedules, isDeactivated = false }: Props) => {
    const { selectedUser } = useContext(UsuariosContext);
    const [active, setActive] = useState(false);
    const [checkedSchedules, setCheckedSchedules] = useState<string[]>([]);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isValid },
    } = useForm<IRegisterBody['data']>({
        defaultValues: selectedUser._id === "" ? {} : {
            email: selectedUser.email,
            fullName: selectedUser.fullName,
            phoneNumber: selectedUser.phoneNumber,
            password: "",
            role: selectedUser.role,
            deactivated: isDeactivated,
            identification: selectedUser.identification
        },
        mode: 'all'
    });

    const onSubmit: SubmitHandler<IRegisterBody['data']> = async (data) => {
        let res = null
        setActive(true)

        if (selectedUser._id !== "") {
            res = await UsersApiConector.updateUser({
                userId: selectedUser._id,
                data: {
                    ...data,
                    schedules: checkedSchedules
                }
            })
        } else {
            res = await UsersApiConector.registerUser({
                data: {
                    ...data,
                    schedules: checkedSchedules
                }
            })
        }

        if (res) {
            toast.success(`Usuario distribuidor ${selectedUser._id === "" ? "registrado" : "editado"} correctamente`, { position: "bottom-center" });
            window.location.reload();
        } else {
            toast.error("Upps error al crear el usuario distribuidor", { position: "bottom-center" });
            setActive(false)
        }
    };

    const handleScheduleChange = (schedule: string) => {
        if (checkedSchedules.includes(schedule)) {
            setCheckedSchedules((prev) => prev.filter(z => z !== schedule))
        } else {
            setCheckedSchedules((prev) => [...prev, schedule])
        }
    }

    useEffect(() => {
        if (selectedUser) {
            setCheckedSchedules(selectedUser.schedules.map(sc => sc._id) || [])
        } else {
            setCheckedSchedules([])
        }
    }, [selectedUser])

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6 justify-center items-center w-full p-6">

                <Input
                    label="Nombre completo"
                    name="fullName"
                    register={register}
                    errors={errors.fullName}
                    required
                />

                <div className="flex flex-col sm:flex-row gap-6 items-center w-full">
                    <Input
                        label="Identidad"
                        name="identification"
                        register={register}
                        errors={errors.identification}
                        required
                        numericalOnly
                    />
                    <Input
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        validateAmount={(value: string) => {
                            try {
                                Yup.string().email("Dirección de correo incorrecta").validateSync(value)
                                return true
                            } catch (error: any) {
                                console.log(error.message)
                                return error.message as string
                            }
                        }}
                        autoComplete="off"
                        register={register}
                        errors={errors.email}
                        required
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-start w-full">
                    <Input
                        label="Teléfono"
                        name="phoneNumber"
                        register={register}
                        errors={errors.phoneNumber}
                        required
                        validateAmount={(value: string) => { if (!isValidPhoneNumber(value, "BO")) { return "Número de teléfono incorrecto" } return true }}
                    />
                    <div className="flex flex-col gap-2 w-full">
                        <Input
                            label="Contraseña"
                            name="password"
                            type="password"
                            autoComplete="off"
                            register={register}
                            errors={errors.password}
                            required={selectedUser._id === ""}
                        />
                        {
                            selectedUser._id !== "" &&
                            <small className="text-xs pl-1">Dejar en blanco para no modificar la contraseña</small>
                        }
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full flex flex-col gap-2"
                >
                    <label>Cargo</label>
                    <select
                        {...register("role")}
                        className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black"
                    >
                        <option value="user">
                            Distribuidor
                        </option>
                    </select>
                    {errors.role && (
                        <span className="text-red-500 font-normal text-sm font-pricedown">
                            <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                            {errors.role.message}
                        </span>
                    )}
                </motion.div>

                <div className="w-full flex gap-4 flex-col">
                    <div className="AsignarPermisos-tituloinput bg-blue_custom">
                        <span>Horarios de trabajo</span>
                        <button className="AsignarPermisos-tituloinput-btn" type="button">
                            <span className="material-symbols-outlined">
                                expand_less
                            </span>
                        </button>
                    </div>
                    <div className="grid grid-cols-2 w-full px-2 gap-2">
                        {
                            schedules.map(sc =>
                                <div key={sc._id} className="AsignarPermisos-grupo-check">
                                    <input
                                        id={sc._id}
                                        className="input-check accent-blue_custom"
                                        type="checkbox"
                                        checked={checkedSchedules.includes(sc._id)}
                                        onChange={() => handleScheduleChange(sc._id)}
                                    />
                                    <label htmlFor={sc._id} className="AsignarPermisos-text-check text-font-color">{sc.startTime} a {sc.endTime}</label>
                                </div>
                            )
                        }
                    </div>
                </div>

                <div className="w-full flex justify-end items-center gap-2">
                    <span>Estado:</span>
                    <label className="ConfiguracionGeneral-switch-container">
                        <input className="inputSwitch" type="checkbox" checked={!watch('deactivated')} onChange={(e) => {
                            setValue('deactivated', !e.target.checked, { shouldValidate: true })
                        }} />
                        <span className="slider"></span>
                    </label>
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
                            disabled={active || !isValid}
                            className="disabled:bg-gray-400 w-full bg-blue-500 py-2 rounded-full text-white font-black shadow-xl truncate"
                        >
                            {
                                active ?
                                    <i className="fa-solid fa-spinner animate-spin"></i> :
                                    <span>
                                        {
                                            selectedUser._id !== "" ? "Actualizar usuario" : "Registrar usuario"
                                        }
                                    </span>
                            }
                        </button>
                    </div>
                </div>
            </form >
        </>
    )
}

export { AddUsuario }