import { FC, useState } from "react";
import "./ArqueoDeCaja.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { TableArqueoCaja } from "./TableArqueoCaja/TableArqueoCaja";
import { FinalizarArqueoCaja } from "./FinalizarArqueoCaja/FinalizarArqueoCaja";
import { useForm, SubmitHandler } from "react-hook-form";
import { CashOpen, Transaction } from "../../../../../type/Cash";
import Input from "../../../EntryComponents/Inputs";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useCallback, useEffect } from "react";
import { CashRegisterApiConector, UsersApiConector } from "../../../../../api/classes";
import { User } from "../../../../../type/User";
import moment from "moment-timezone";

const ArqueoDeCaja: FC = () => {
  const [finalizarArqueo, setFinalizarArqueo] = useState<boolean>(false);
  const [data, setData] = useState<Transaction[]>();

  const [dist, setDist] = useState<User[]>([]);

  const getData = useCallback(async () => {
    let res = await CashRegisterApiConector.get({ filters: { open: true } }) || []

    if (res.length > 0) {
      setFinalizarArqueo(true);
    } else {
      res = await CashRegisterApiConector.get({}) || []
    }

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
  } = useForm<CashOpen>();

  const onSubmit: SubmitHandler<CashOpen> = async (data) => {
    const date = data.startDate;
    const time = data.startTime
    const timeSplit = time?.split(":") || ["0", "0"];
    const startDateTime = moment.tz(date, 'America/La_Paz').set({ hour: parseInt(timeSplit[0]), minute: parseInt(timeSplit[1]) });

    console.log({
      initialMount: data.initialMount,
      startDate: startDateTime.format(),
      user: data.user
    })

    const res = await CashRegisterApiConector.open({
      data: {
        initialMount: data.initialMount,
        startDate: startDateTime.toDate().toISOString(),
        user: data.user
      }
    });

    if (res) {
      toast.success("Caja Abierta");
      setFinalizarArqueo(true);
    } else {
      toast.error("Upps error al abrir caja");
    }
  };
  return (
    <>
      <div className="px-10 h-screen overflow-y-auto pb-10">
        <PageTitle titulo="Arqueo De Cajas" icon="../Finanzas-icon.svg" />
        <div className="w-full p-6">
          {finalizarArqueo === false ? (
            <>
              <TableArqueoCaja cash={data} distrib={dist} />

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="ArqueoCaja-containerform w-full lg:w-1/2">
                  <div className="ArqueoCaja-tituloform">
                    <span>Nuevo arqueo de caja</span>
                  </div>
                  <div className="ArqueoCaja-bodyform">
                    <Input
                      label="Fecha"
                      name="startDate"
                      type="date"
                      errors={errors.startDate}
                      register={register}
                      required
                      className="full-selector"
                    />
                    <Input
                      label="Hora"
                      name="startTime"
                      type="time"
                      errors={errors.startTime}
                      register={register}
                      required
                      className="full-selector"
                    />
                    <Input
                      label="Monto inicial BS."
                      name="initialMount"
                      type="number"
                      errors={errors.initialMount}
                      register={register}
                      required
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
                      Iniciar arqueo
                    </button>
                  </div>
                </div>
              </form>
            </>
          ) : (
            <FinalizarArqueoCaja
              distrib={dist}
              cash={data?.[0]}
              handleOnSubmit={() => {
                setFinalizarArqueo(false);
                getData();
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};

export { ArqueoDeCaja };
