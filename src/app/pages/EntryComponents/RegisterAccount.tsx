import React, { useContext, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import Input from "./Inputs";
import { EgresosGastosContext } from "../Contenido/Finanzas/EgresosGastos/EgresosGastosContext";
import { IAccountBody } from "../../../api/types/account-entry";
import { AccountEntryApiConector } from "../../../api/classes";

const RegisterAccount = ({
  onCancel
}: {
  onCancel?: () => void
}) => {
  const { selectedAccount } = useContext(EgresosGastosContext);
  const [active, setActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IAccountBody['data']>({
    defaultValues: selectedAccount._id === "" ? {} : { description: selectedAccount.description, name: selectedAccount.name },
    mode: 'all'
  });

  const onSubmit: SubmitHandler<IAccountBody['data']> = async (data) => {
    let res = null
    setActive(true)

    if (selectedAccount._id !== "") {
      res = await AccountEntryApiConector.update({ accountId: selectedAccount._id, data })
    } else {
      res = await AccountEntryApiConector.create({ data })
    }

    if (res) {
      toast.success(`Cuenta contable ${selectedAccount._id === "" ? "registrada" : "editada"} correctamente`, { position: "bottom-center" });
      window.location.reload();
    } else {
      toast.error("Upps error al crear la cuenta contable", { position: "bottom-center" });
      setActive(false)
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 justify-center items-center w-full p-6">
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
                {selectedAccount._id !== "" ? "Editar" : "Registrar"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegisterAccount;
