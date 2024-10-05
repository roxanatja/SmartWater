import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import ApiMethodAccountEntry from "../../../Class/api.entryaco";
import { AccountBody } from "../../../type/AccountEntry";
import Input from "./Inputs";

const RegisterAccount = ({
  handleOnsubmit,
}: {
  handleOnsubmit: () => void;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AccountBody>();
  const onSubmit: SubmitHandler<AccountBody> = async (data) => {
    const api = new ApiMethodAccountEntry();
    try {
      await api.saveAccount(data);
      toast.success("Cuenta Creada");
      reset();
      handleOnsubmit();
    } catch (error) {
      toast.error("Upps error al crear Cuenta");
      console.log(error);
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <h2 className="text-blue_custom font-bold mb-3">Registrar una Cuenta</h2>
      <div className="flex flex-col gap-4">
        <Input
          label="Nombre"
          register={register}
          name="name"
          errors={errors.name}
          required
        />
        <Input
          label="Descripcion"
          register={register}
          name="description"
          errors={errors.description}
          required
        />
        <div className="w-full flex justify-center items-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 rounded-full py-2 px-8 text-white"
          >
            Registrar
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterAccount;
