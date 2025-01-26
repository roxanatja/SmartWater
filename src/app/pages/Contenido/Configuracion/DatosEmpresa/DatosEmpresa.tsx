import { useEffect, useState } from "react"
import { PageTitle } from "../../../components/PageTitle/PageTitle"
import { SubmitHandler, useForm } from "react-hook-form"
import { BussinessApiConector, IBusinessUpdateParams } from "../../../../../api/classes/business"
import Input from "../../../EntryComponents/Inputs"
import ImageUploadField from "../../../EntryComponents/ImageUploadField"
import { isValidPhoneNumber } from "libphonenumber-js"
import * as Yup from "yup"
import { Business } from "../../../../../type/Business"
import toast from "react-hot-toast"

const DatosEmpresa = () => {
    const [dataBusiness, setDataBusiness] = useState<Business | null>(null)
    const [active, setActive] = useState<boolean>(false)

    const { register, watch, setValue, formState: { errors, isValid }, handleSubmit, reset } = useForm<IBusinessUpdateParams['data']>({
        defaultValues: {},
        mode: 'all'
    })

    useEffect(() => {
        BussinessApiConector.information().then(res => {
            if (res) {
                setDataBusiness(res);

                setValue('address', res.address, { shouldValidate: true })
                setValue('city', res.city, { shouldValidate: true })
                setValue('companyName', res.companyName, { shouldValidate: true })
                setValue('email', res.email, { shouldValidate: true })
                setValue('imageUrl', res.imageUrl, { shouldValidate: true })
                setValue('nit', res.nit, { shouldValidate: true })
                setValue('phoneNumber', res.phoneNumber, { shouldValidate: true })
            } else {
                setDataBusiness(null)
                reset()
            }
        })
    }, [reset, setValue])

    const onSubmit: SubmitHandler<IBusinessUpdateParams['data']> = async (data) => {
        setActive(true)

        const res = await BussinessApiConector.updateBusiness({ data: { address: data.address, companyName: data.companyName, email: data.email, imageUrl: data.imageUrl, phoneNumber: data.phoneNumber } })

        if (res) {
            toast.success("Datos de la empresa actualizados con éxito", { duration: 2000 })
            window.location.reload()
        } else {
            toast.error("Upss. Ocurrió un error actualizando los datos de la empresa", { duration: 2000 })
        }

        setActive(false)
    };

    const cancelChanges = () => {
        reset()
    }

    return (
        <div className="px-10 h-screen overflow-y-auto pb-10">
            <PageTitle titulo="Configuración / Datos de la empresa" icon="../../../Configuracion-icon.svg" />

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col md:flex-row gap-6 md:gap-12 w-full mt-10">
                    <div className="flex flex-col gap-6 w-full md:w-1/2">
                        <Input
                            label="Nombre"
                            name="companyName"
                            register={register}
                            errors={errors.companyName}
                            required
                        />
                        <Input
                            label="Número de teléfono"
                            name="phoneNumber"
                            type="tel"
                            validateAmount={(value: string) => { if (!isValidPhoneNumber(value, "BO")) { return "Número de teléfono incorrecto" } return true }}
                            register={register}
                            errors={errors.phoneNumber}
                            required
                        />
                        <Input
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
                            label="Dirección"
                            name="address"
                            register={register}
                            errors={errors.address}
                            required
                        />
                        <Input
                            label="Nit"
                            name="nit"
                            register={register}
                            errors={errors.nit}
                            required
                            disabled
                            className="dark:disabled:bg-zinc-700 disabled:bg-zinc-300"
                        />
                        <Input
                            label="Ciudad donde opera"
                            name="city"
                            register={register}
                            errors={errors.city}
                            required
                            disabled
                            className="dark:disabled:bg-zinc-700 disabled:bg-zinc-300"
                        />
                    </div>

                    <div className="w-full md:w-1/2">
                        <label className="block mb-2">Logo de la empresa</label>
                        <ImageUploadField
                            value={watch('imageUrl')}
                            fieldName={"imageUrl"}
                            label={"Logo de la empresa"}
                            register={register}
                            setValue={setValue}
                            errors={errors.imageUrl}
                            required={true}
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
                                {
                                    !dataBusiness ? "Registrar" : "Actualizar"
                                }
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