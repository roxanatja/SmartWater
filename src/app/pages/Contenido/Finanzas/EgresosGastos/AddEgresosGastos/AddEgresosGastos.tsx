import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Providers } from '../../../../../../type/providers';
import { Account } from '../../../../../../type/AccountEntry';
import { EgresosGastosContext } from '../EgresosGastosContext';
import { IExpenseBody } from '../../../../../../api/types/expenses';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ExpensesApiConector } from '../../../../../../api/classes';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Input from '../../../../EntryComponents/Inputs';

interface Props {
  onCancel?: () => void;
  accounts: Account[];
  provider: Providers[];
}

const AddEgresosGastos = ({ accounts, provider, onCancel }: Props) => {
  const { selectedExpense } = useContext(EgresosGastosContext);
  const [active, setActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }, watch, setValue
  } = useForm<IExpenseBody['data']>({
    defaultValues: selectedExpense._id === "" ? {} : {
      accountEntry: selectedExpense.accountEntry,
      amount: selectedExpense.amount,
      comment: selectedExpense.comment,
      creditBuy: selectedExpense.creditBuy,
      documentNumber: selectedExpense.documentNumber,
      hasInVoice: selectedExpense.hasInVoice,
      paymentMethodCurrentAccount: selectedExpense.paymentMethodCurrentAccount,
      provider: selectedExpense.provider?._id || "",
      user: selectedExpense.user
    },
    mode: 'all'
  });

  const [selectedPayment, setSelectedPayment] = useState<"credit" | 'cta' | 'cash'>('cash')

  const onSubmit: SubmitHandler<IExpenseBody['data']> = async (data) => {
    let res = null
    setActive(true)

    if (selectedExpense._id !== "") {
      res = await ExpensesApiConector.update({ expenseId: selectedExpense._id, data })
    } else {
      res = await ExpensesApiConector.create({ data })
    }

    if (res) {
      toast.success(`Item ${selectedExpense._id === "" ? "registrado" : "editado"} correctamente`, { position: "bottom-center" });
      window.location.reload();
    } else {
      toast.error("Upps error al crear el item", { position: "bottom-center" });
      setActive(false)
    }
  };

  useEffect(() => {
    if (selectedExpense._id !== "") {
      const credit = selectedExpense.creditBuy
      const cta = selectedExpense.paymentMethodCurrentAccount

      let is: "credit" | 'cta' | 'cash' = 'cash'
      if (!!credit && !cta) { is = 'credit' }
      else if (!credit && !!cta) { is = 'cta' }

      setSelectedPayment(is)
    } else {
      setSelectedPayment('cash')
    }
  }, [selectedExpense])

  const handleChangePayment = (e: ChangeEvent<HTMLSelectElement>) => {
    const selection = e.target.value as typeof selectedPayment
    setSelectedPayment(selection)

    switch (selection) {
      case 'cash':
        setValue('paymentMethodCurrentAccount', false, { shouldValidate: true })
        setValue('creditBuy', false, { shouldValidate: true })
        break;
      case 'credit':
        setValue('paymentMethodCurrentAccount', false, { shouldValidate: true })
        setValue('creditBuy', true, { shouldValidate: true })
        break;
      case 'cta':
        setValue('paymentMethodCurrentAccount', true, { shouldValidate: true })
        setValue('creditBuy', false, { shouldValidate: true })
        break;
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 justify-center items-center w-full p-6"
    >
      <div className="flex gap-6 items-center w-full flex-col sm:flex-row">
        <Input
          label="Importe"
          name="amount"
          register={register}
          numericalOnly
          sufix={<span>Bs</span>}
          errors={errors.amount}
          required
          containerClassName='flex-1'
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full sm:w-1/2 flex flex-col gap-2 flex-1"
        >
          <label>Medio de pago</label>
          <select
            value={selectedPayment}
            onChange={handleChangePayment}
            className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black dark:disabled:bg-zinc-700 disabled:bg-zinc-300"
          >
            <option value="cash">Efectivo</option>
            <option value="credit">Crédito</option>
            <option value="cta">Cuenta corriente</option>
          </select>
        </motion.div>
      </div>

      <div className="flex gap-6 items-center w-full flex-col sm:flex-row">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full sm:w-1/2 flex flex-col gap-2 flex-1"
        >
          <label>Proveedor</label>
          <select
            {...register("provider", {
              required: "Debes seleccionar un proveedor"
            })}
            className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black dark:disabled:bg-zinc-700 disabled:bg-zinc-300"
          >
            <option value={"null"}>Selccione un proveedor</option>
            {
              provider.map((row, index) => (
                <option value={row._id} key={index}>
                  {row.fullName || "Sin nombre"}
                </option>
              ))
            }
          </select>
          {errors.provider && (
            <span className="text-red-500 font-normal text-sm font-pricedown">
              <i className="fa-solid fa-triangle-exclamation"></i>{" "}
              {errors.provider.message}
            </span>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full sm:w-1/2 flex flex-col gap-2"
        >
          <label>Cuenta contable</label>
          <select
            {...register("accountEntry", {
              required: "Debes seleccionar una cuenta"
            })}
            className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black"
          >
            <option value={"null"}>Selccione una cuenta</option>
            {
              accounts.map((row, index) => (
                <option value={row._id} key={index}>
                  {row.name}
                </option>
              ))
            }
          </select>
          {errors.accountEntry && (
            <span className="text-red-500 font-normal text-sm font-pricedown">
              <i className="fa-solid fa-triangle-exclamation"></i>{" "}
              {errors.accountEntry.message}
            </span>
          )}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full flex gap-3 text-md items-center col-span-2 max-sm:col-span-1"
      >
        <input
          type="checkbox"
          {...register("hasInVoice")}
          className="w-5 h-5 text-blue-900 bg-gray-100 border-gray-300 rounded accent-blue-700"
          id="isClient"
        />
        <label htmlFor="isClient" className="mr-4">
          Factura
        </label>
        <input
          type="checkbox"
          className="w-5 h-5 text-blue-900 bg-gray-100 border-gray-300 rounded accent-blue-700"
          id="isAgency"
        />
        <label htmlFor="isAgency">Recibo</label>
      </motion.div>

      <Input
        label="Nº de documento"
        name="documentNumber"
        register={register}
        errors={errors.documentNumber}
        required
      />

      <Input
        textarea
        label="Comentario"
        rows={3}
        name="comment"
        register={register}
        errors={errors.comment}
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
                {selectedExpense._id !== "" ? "Editar" : "Registrar"}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  )
}

export default AddEgresosGastos