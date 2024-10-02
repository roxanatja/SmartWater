import { useContext } from "react";
import "./AgregarProveedor.css";
import { ProveedoresContext } from "../ProveedoresContext";
import { useForm, SubmitHandler } from "react-hook-form";
import { ProvidersBody, Providers } from "../../../../../../type/providers";
import Input from "../../../../EntryComponents/Inputs";
import ApiMethodProvider from "../../../../../../Class/api.providers";
import { toast } from "react-hot-toast";

const AgregarProveedor = ({ onClose }: { onClose: () => void }) => {
  const { provider } = useContext(ProveedoresContext);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProvidersBody>({ defaultValues: { ...provider } });

  const onSubmit: SubmitHandler<ProvidersBody> = async (data) => {
    const api = new ApiMethodProvider();

    if (provider) {
      try {
        await api.updateProvider({ ...data, _id: provider._id } as Providers);
        toast.success("Provedor actualizado existoxamente");
      } catch (error) {
        toast.error("Upps error al actualizar proverdor");
      }
      return;
    }
    try {
      await api.saveProvider(data);
      toast.success("Provedor creado existoxamente");
      reset();
      onClose();
    } catch (error) {
      toast.error("Upps error al guardar proverdor");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-6">
          <div className="Titulo-Modal">
            <div>
              <span>Registro de proveedor</span>
            </div>
          </div>
        </div>
        <div className="modal-body px-6">
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
          />
          <Input
            register={register}
            errors={errors.phoneNumber}
            icon={<i className="fa-solid fa-phone"></i>}
            name="phoneNumber"
            label="Telefono"
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
          />
        </div>
        <div className="flex justify-between w-full gap-2 px-6 py-4">
          <button type="button" className="btn-cancelar" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn-registrar">
            {provider ? "Editar" : "Registrar"}
          </button>
        </div>
      </form>
    </>
  );
};

export { AgregarProveedor };
