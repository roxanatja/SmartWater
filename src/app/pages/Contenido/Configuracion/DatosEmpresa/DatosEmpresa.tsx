import { useEffect, useState } from "react"
import { PageTitle } from "../../../components/PageTitle/PageTitle"
import { SubmitHandler, useForm } from "react-hook-form"
import { IBusinessUpdateParams } from "../../../../../api/classes/business"
import Input from "../../../EntryComponents/Inputs"
import { City } from "../../../../../type/City"
import { motion } from "framer-motion"
import { CitiesApiConector } from "../../../../../api/classes"
import ImageUploadField from "../../../EntryComponents/ImageUploadField"
import { isValidPhoneNumber } from "libphonenumber-js"
import * as Yup from "yup"

const DatosEmpresa = () => {
    // const [user] = useState<UserData | null>(AuthService.getUser())
    const [cities, setCities] = useState<City[]>([])

    const [active, setActive] = useState<boolean>(false)

    const { register, watch, setValue, formState: { errors, isValid }, handleSubmit, reset } = useForm<IBusinessUpdateParams['data']>({
        defaultValues: {},
        mode: 'all'
    })

    useEffect(() => {
        CitiesApiConector.getAll().then(res => { setCities(res || []) })
    })

    const onSubmit: SubmitHandler<IBusinessUpdateParams['data']> = async (data) => {
        setActive(true)
        console.log(data)
        setActive(false)
    };

    const cancelChanges = () => {
        reset()
    }

    return (
        <div className="px-10">
            <PageTitle titulo="Configuración / Datos de la empresa" icon="../../../Configuracion-icon.svg" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-full mt-10">
                    <div className="flex flex-col gap-6 w-full md:w-1/2">
                        <Input
                            max={watch("companyName")}
                            label="Nombre"
                            name="companyName"
                            register={register}
                            errors={errors.companyName}
                            required
                        />
                        <Input
                            max={watch("phoneNumber")}
                            label="Número de teléfono"
                            name="phoneNumber"
                            type="tel"
                            validateAmount={(value: string) => { if (!isValidPhoneNumber(value, "BO")) { return "Número de teléfono incorrecto" } return true }}
                            register={register}
                            errors={errors.phoneNumber}
                            required
                        />
                        <Input
                            max={watch("email")}
                            label="Correo electrónico"
                            name="email"
                            type="email"
                            register={register}
                            errors={errors.email}
                            required
                            validateAmount={(value: string) => {
                                try {
                                    Yup.string().email("Dirección de correo incorrecta").validateSync(value)
                                    return true
                                } catch (error: any) {
                                    console.log(error.message)
                                    return error.message as string
                                }
                            }}
                        />
                        <Input
                            max={watch("address")}
                            label="Dirección"
                            name="address"
                            register={register}
                            errors={errors.address}
                            required
                        />
                        <Input
                            max={watch("nit")}
                            label="Nit"
                            name="nit"
                            register={register}
                            errors={errors.nit}
                            required
                        />

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.3 }}
                            className="w-full flex flex-col gap-2"
                        >
                            <label>Ciudad donde opera</label>
                            <select
                                {...register("city", {
                                    required: "Debes seleccionar una ciudad"
                                })}
                                className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black"
                            >
                                {
                                    cities.map((row, index) => (
                                        <option value={row._id} key={index}>
                                            {row.name}
                                        </option>
                                    ))
                                }
                            </select>
                            {errors.city && (
                                <span className="text-red-500 font-normal text-sm font-pricedown">
                                    <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                                    {errors.city.message}
                                </span>
                            )}
                        </motion.div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <label className="block mb-2">Logo de la empresa</label>
                        <ImageUploadField
                            watchField={watch}
                            fieldName={"imageUrl"}
                            label={"Logo de la empresa"}
                            register={register}
                            setValue={setValue}
                            errors={errors}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-center md:justify-start flex-col sm:flex-row-reverse mt-10 w-full gap-8">
                    <button
                        type="submit"
                        disabled={(!isValid || !watch('imageUrl')) || active}
                        className="disabled:bg-gray-400 bg-blue-500 py-2 rounded-full text-white font-black shadow-xl truncate w-full sm:w-[200px]"
                    >
                        {active ? (
                            <i className="fa-solid fa-spinner animate-spin"></i>
                        ) : (
                            <>
                                Registrar
                            </>
                        )}
                    </button>
                    <button
                        onClick={cancelChanges}
                        className="outline outline-2 outline-blue-500 py-2 rounded-full text-blue-600 font-black shadow-xl w-full sm:w-[200px]"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div >
    )
}

export default DatosEmpresa