import { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Providers } from '../../../../../../type/providers';
import { Account } from '../../../../../../type/AccountEntry';
import { IExpenseDetailsBody } from '../../../../../../api/types/expenses';
import { SubmitHandler, useForm } from 'react-hook-form';
import { ExpensesApiConector } from '../../../../../../api/classes';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Input from '../../../../EntryComponents/Inputs';
import { MatchedElement } from '../../../../../../type/Kardex';
import InventoriesForm from './InventoriesForm';
import { AuthService } from '../../../../../../api/services/AuthService';
import moment from 'moment-timezone';
import { EgresosGastosContext } from '../EgresosGastosContext';

interface Props {
  onCancel?: () => void;
  accounts: Account[];
  provider: Providers[];
  elements: MatchedElement[]
}

const AddEgresosGastos = ({ accounts, provider, onCancel, elements }: Props) => {
  const [active, setActive] = useState(false);
  const { selectedExpense } = useContext(EgresosGastosContext)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid }, watch, setValue
  } = useForm<IExpenseDetailsBody['data']>({
    defaultValues: selectedExpense._id !== "" ? {
      accountEntry: selectedExpense.accountEntry._id,
      amount: selectedExpense.amount,
      comment: selectedExpense.comment,
      creditBuy: selectedExpense.creditBuy,
      documentNumber: selectedExpense.documentNumber,
      hasInVoice: selectedExpense.hasInVoice,
      hasReceipt: selectedExpense.hasReceipt,
      paymentMethodCurrentAccount: selectedExpense.paymentMethodCurrentAccount,
      provider: selectedExpense.provider?._id || "",
      user: selectedExpense.user._id
    } : {
      creditBuy: false,
      paymentMethodCurrentAccount: false
    },
    mode: 'all'
  });

  const [selectedPayment, setSelectedPayment] = useState<"credit" | 'cta' | 'cash'>('cash')
  const [inventories, setInventories] = useState<IExpenseDetailsBody['data']['details']>([])

  const onSubmit: SubmitHandler<IExpenseDetailsBody['data']> = async (data) => {
    let res = null
    setActive(true)

    const userData = AuthService.getUser()

    if (selectedExpense._id !== "") {
      res = await ExpensesApiConector.update({
        expenseId: selectedExpense._id,
        data: {
          ...data,
          user: userData?._id || "",
          details: inventories.map(i => ({
            ...i,
            inputImport: i.inputImport * i.quantity
          }))
        }
      })
    } else {
      res = await ExpensesApiConector.createWithDetails({
        data: {
          ...data,
          user: userData?._id || "",
          details: inventories.map(i => ({
            ...i,
            inputImport: i.inputImport * i.quantity
          })),
          registerDate: moment.tz("America/La_Paz").format("YYYY-MM-DDTHH:mm:ss")
        }
      })
    }

    if (res) {
      toast.success(`Item ${selectedExpense._id === "" ? "registrado" : "editado"} correctamente`, { position: "bottom-center" });
      window.location.reload();
    } else {
      toast.error("Upps error al crear el gasto", { position: "bottom-center" });
      setActive(false)
    }
  };

  useEffect(() => {
    if (selectedExpense._id !== "") {
      if (selectedExpense.creditBuy) { setSelectedPayment('credit') }
      else if (selectedExpense.paymentMethodCurrentAccount) { setSelectedPayment('cta') }
      else { setSelectedPayment('cash') }

      const aux: IExpenseDetailsBody['data']['details'] = []
      console.log(selectedExpense)

      aux.push(...selectedExpense.items.map(i => {
        console.log(i.item._id)
        const el = elements.find(e => e._id === i.item._id || (e.matchingItems && e.matchingItems.some(mi => mi._id === i.item._id)))
        console.log(el)
        const res: IExpenseDetailsBody['data']['details'][0] = {
          inputImport: i.unitPrice,
          quantity: i.quantity
        }

        if (el?.isProduct) { res.product = el._id }
        else if (el?.isItem) { res.item = el._id }

        return res
      }))
      aux.push(...selectedExpense.products.map(i => {
        const el = elements.find(e => e._id === i.product._id || (e.matchingItems && e.matchingItems.some(mi => mi._id === i.product._id)))
        const res: IExpenseDetailsBody['data']['details'][0] = {
          inputImport: i.unitPrice,
          quantity: i.quantity
        }

        if (el?.isProduct) { res.product = el._id }
        else if (el?.isItem) { res.item = el._id }

        return res
      }))

      console.log(aux)

      setInventories(aux)
    }
  }, [selectedExpense, elements])

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

  const onAddElements = (val: IExpenseDetailsBody['data']['details'][0], index: number = -1) => {
    if (index > -1) {
      const updateElements = [...inventories]
      updateElements[index] = val
      setInventories(updateElements)
    } else {
      const idx = inventories.findIndex(i => val.product ? i.product === val.product : i.item === val.item);
      if (idx !== -1) {
        setInventories(prev => prev.map(i => {
          if ((!!val.product && i.product === val.product) || (!!val.item && i.item === val.item)) {
            return { ...i, inputImport: val.inputImport, quantity: val.quantity }
          } else {
            return i
          }
        }))
      } else {
        setInventories([...inventories, val])
      }
    }
  }

  const handleDeleteElement = (index: number) => {
    setInventories(inventories.filter((_, i) => i !== index));
  };

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
            <option value={""}>Seleccione un proveedor</option>
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
          <label>Tipo de gasto</label>
          <select
            {...register("accountEntry", {
              required: "Debes seleccionar una cuenta"
            })}
            className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black"
          >
            <option value={""}>Seleccione una cuenta</option>
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
          checked={watch("hasInVoice")}
          onChange={() => {
            const check = watch("hasInVoice")
            setValue("hasInVoice", !check, { shouldValidate: true })
            setValue("hasReceipt", false, { shouldValidate: true })
          }}
          className="w-5 h-5 text-blue-900 bg-gray-100 border-gray-300 rounded accent-blue-700"
          id="isClient"
        />
        <label htmlFor="isClient" className="mr-4">
          Factura
        </label>
        <input
          type="checkbox"
          checked={watch("hasReceipt")}
          onChange={() => {
            const check = watch("hasReceipt")
            setValue("hasReceipt", !check, { shouldValidate: true })
            setValue("hasInVoice", false, { shouldValidate: true })
          }}
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
        required={(!!watch('hasInVoice') || !!watch('hasReceipt'))}
      />

      <Input
        textarea
        label="Comentario"
        rows={2}
        name="comment"
        register={register}
        errors={errors.comment}
      />

      <InventoriesForm elements={elements} handleDeleteElement={handleDeleteElement} updateDetails={onAddElements} inventories={inventories} />

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