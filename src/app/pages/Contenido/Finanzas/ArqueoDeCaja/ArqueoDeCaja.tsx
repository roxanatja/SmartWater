import { FC, useState } from "react";
import "./ArqueoDeCaja.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { TableArqueoCaja } from "./TableArqueoCaja/TableArqueoCaja";
import { useForm, SubmitHandler } from "react-hook-form";
import { CashOpen, Transaction } from "../../../../../type/Cash";
import Input from "../../../EntryComponents/Inputs";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useCallback, useEffect } from "react";
import { CashRegisterApiConector, UsersApiConector } from "../../../../../api/classes";
import { User } from "../../../../../type/User";
import moment from "moment";
import momentTz from "moment-timezone";

const ArqueoDeCaja: FC = () => {
  const [data, setData] = useState<Transaction[]>([]);

  const [dist, setDist] = useState<User[]>([]);

  const getData = useCallback(async () => {
    const res = await CashRegisterApiConector.get({}) || []
    return setData(res);
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    UsersApiConector.get({ pagination: { page: 1, pageSize: 3000 } }).then(res => setDist(res?.data || []))
  }, [])

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    watch
  } = useForm<CashOpen>({
    mode: 'all'
  });

  const onSubmit: SubmitHandler<CashOpen> = async (data) => {
    let res: any | null = null

    if (data.endDate) {
      res = await CashRegisterApiConector.openClose({
        data: {
          initialAmount: data.initialAmount,
          startDate: momentTz.tz(data.startDate, "America/La_Paz").format(),
          user: data.user,
          endDate: momentTz.tz(data.endDate, "America/La_Paz").format()
        }
      });
    } else {
      res = await CashRegisterApiConector.open({
        data: {
          initialAmount: data.initialAmount,
          startDate: momentTz.tz(data.startDate, "America/La_Paz").format(),
          user: data.user
        }
      });
    }

    if (res) {
      toast.success("Arqueo de caja creado");
      window.location.reload()
    } else {
      toast.error("Upps error al guardar el arqueo de caja");
    }
  };

  const validateHours = (val: string, type: 'init' | 'end'): string | boolean => {
    if (type === 'init') {
      const hasEnd = watch('endDate')
      const init = moment(val)
      const end = hasEnd ? moment(watch('endDate')) : moment()

      if (init.isSameOrAfter(end)) {
        return `La fecha de apertura debe ser menor que la fecha y hora ${hasEnd ? "de cierre" : "actual"}`
      }

      return true
    }

    if (type === 'end') {
      const hasStart = watch('startDate')
      const check = moment(val)
      const init = hasStart ? moment(watch('startDate')) : undefined
      const end = moment()

      if (check.isAfter(end)) {
        return `La fecha de cierre debe ser menor que la fecha y hora actual`
      }
      if (init && check.isSameOrBefore(init)) {
        return `La fecha de cierre debe ser mayor que la fecha y hora de apertura`
      }

      return true
    }

    return true
  }

  return (
    <>
      <div className="px-10 h-screen overflow-y-auto pb-10">
        <PageTitle titulo="Arqueo De Cajas" icon="../Finanzas-icon.svg" />
        <div className="w-full p-6">
          <TableArqueoCaja cash={data} distrib={dist} />

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="ArqueoCaja-containerform w-full lg:w-1/2 mt-10">
              <div className="ArqueoCaja-tituloform">
                <span>Nuevo arqueo de caja</span>
              </div>
              <div className="ArqueoCaja-bodyform">
                <Input
                  label="Fecha y hora de apertura"
                  name="startDate"
                  type="datetime-local"
                  errors={errors.startDate}
                  register={register}
                  required
                  className="full-selector"
                  max={watch('endDate') ? moment(watch('endDate')!.toString()).format("YYYY-MM-DDTHH:mm") : moment().format("YYYY-MM-DDTHH:mm")}
                  validateAmount={(val) => validateHours(val, 'init')}
                />
                <Input
                  label="Fecha y hora de cierre"
                  name="endDate"
                  type="datetime-local"
                  errors={errors.endDate}
                  register={register}
                  className="full-selector"
                  min={watch('startDate') ? moment(watch('startDate')!.toString()).format("YYYY-MM-DDTHH:mm") : undefined}
                  max={moment().format("YYYY-MM-DDTHH:mm")}
                  validateAmount={(val) => validateHours(val, 'end')}
                />
                <Input
                  label="Monto inicial BS."
                  name="initialAmount"
                  type="number"
                  errors={errors.initialAmount}
                  register={register}
                  required
                  min={0}
                  validateAmount={((val: number) => {
                    return val < 0 ? "No debe ser un número negativo" : true
                  })}
                />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.3 }}
                  className="w-full flex flex-col gap-2"
                >
                  <label>Distribuidor</label>
                  <select
                    {...register("user", { required: "Selecciona un distribuidor" })}
                    className="p-2 py-2.5 rounded-md font-pricedown focus:outline-4 bg-main-background outline outline-2 outline-black"
                  >
                    <option value="null">Seleccione un proveedor</option>
                    {dist.length > 0 &&
                      dist.map((city, index) => (
                        <option value={city._id} key={index} className="text-font-color">
                          {city.fullName || "Sin nombre"}
                        </option>
                      ))}
                  </select>
                  {errors.user && (
                    <span className="text-red-500 font-normal text-sm font-pricedown">
                      <i className="fa-solid fa-triangle-exclamation"></i>{" "}
                      {errors.user.message}
                    </span>
                  )}
                </motion.div>
              </div>
              <div className="flex justify-center items-center">
                <button type="submit" className="ArqueoCaja-btn disabled:bg-gray-400 disabled:outline-none disabled:border-none" disabled={!isValid || !watch('user') || watch('user') === "null"}>
                  {!!watch('endDate') ? "Calcular" : "Iniciar"} arqueo
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export { ArqueoDeCaja };
