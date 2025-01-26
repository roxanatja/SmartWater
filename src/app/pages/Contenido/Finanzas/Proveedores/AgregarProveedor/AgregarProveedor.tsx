import { useContext, useState } from "react";
import "./AgregarProveedor.css";
import { ProveedoresContext } from "../ProveedoresContext";
import { useForm, SubmitHandler } from "react-hook-form";
import Input from "../../../../EntryComponents/Inputs";
import { toast } from "react-hot-toast";
import { ProvidersApiConector } from "../../../../../../api/classes";
import { IProviderBody } from "../../../../../../api/types/providers";
import { isValidPhoneNumber } from "libphonenumber-js";
import * as Yup from "yup";

const AgregarProveedor = ({ onClose }: { onClose: () => void }) => {
  const { provider } = useContext(ProveedoresContext);
  const [active, setActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IProviderBody['data']>({
    defaultValues: provider._id === "" ? {} : { address: provider.address, email: provider.email, fullName: provider.fullName, NIT: provider.NIT, phoneNumber: provider.phoneNumber },
    mode: 'all'
  });

  const onSubmit: SubmitHandler<IProviderBody['data']> = async (data) => {
    let res = null
    setActive(true)

    if (provider._id !== "") {
      res = await ProvidersApiConector.update({ providerId: provider._id, data })
    } else {
      res = await ProvidersApiConector.create({ data })
    }

    if (res) {
      toast.success(`Proveedor ${provider._id === "" ? "registrado" : "editado"} correctamente`, { position: "bottom-center" });
      window.location.reload();
    } else {
      toast.error(`Upps error al ${provider._id === "" ? "crear" : "editar"} el proveedor`, { position: "bottom-center" });
      setActive(false)
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 justify-center items-center w-full p-6">
        <Input
          register={register}
          errors={errors.fullName}
          name="fullName"
          label="Nombre"
          required
        />
        <Input
          register={register}
          errors={errors.email}
          name="email"
          label="Correo"
          required
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
        />
        <Input
          register={register}
          errors={errors.phoneNumber}
          icon={<i className="fa-solid fa-phone"></i>}
          name="phoneNumber"
          label="Teléfono"
          validateAmount={(value: string) => { if (!isValidPhoneNumber(value, "BO")) { return "Número de teléfono incorrecto" } return true }}
          required
        />
        <Input
          register={register}
          errors={errors.address}
          name="address"
          label="Dirección"
          required
        />
        <Input
          register={register}
          errors={errors.NIT}
          name="NIT"
          label="Nit"
          required
          numericalOnly
        />

        <div className="w-full  sticky bottom-0 bg-main-background h-full z-50">
          <div className="py-4 flex flex-row gap-4 items-center justify-center px-6">
            <button
              onClick={onClose}
              className="w-full outline outline-2 outline-blue-500 py-2 rounded-full text-blue-600 font-black shadow-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={active || !isValid}
              className="disabled:bg-gray-400 w-full outline outline-2 outline-blue-500 bg-blue-500 py-2 rounded-full text-white font-black shadow-xl truncate"
            >
              {
                active ?
                  <i className="fa-solid fa-spinner animate-spin"></i> :
                  <span>{
                    provider._id === "" ? "Registrar" : "Actualizar"
                  }</span>
              }
            </button>
          </div>
        </div>
      </form >
    </>
  );
};

export { AgregarProveedor };
