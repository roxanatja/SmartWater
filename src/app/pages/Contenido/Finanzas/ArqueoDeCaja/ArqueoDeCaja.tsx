import { FC, useState } from "react";
import "./ArqueoDeCaja.css";
import { PageTitle } from "../../../components/PageTitle/PageTitle";
import { TableArqueoCaja } from "./TableArqueoCaja/TableArqueoCaja";
import { FinalizarArqueoCaja } from "./FinalizarArqueoCaja/FinalizarArqueoCaja";
import { useForm, SubmitHandler } from "react-hook-form";
import { CashOpen, Transaction } from "../../../../../type/Cash";
import Input from "../../../EntryComponents/Inputs";
import ApiMethodCash from "../../../../../Class/api.cash";
import { toast } from "react-hot-toast";
import { UserData } from "../../../../../type/UserData";
import AuthenticationService from "../../../../../services/AuthenService";
import { useCallback, useEffect } from "react";

const ArqueoDeCaja: FC = () => {
  const [finalizarArqueo, setFinalizarArqueo] = useState<boolean>(false);
  const [data, setData] = useState<{ cash?: Transaction[] }>();

  const getData = useCallback(async () => {
    let res;
    const api = new ApiMethodCash();
    res = await api.getCashRegister({ open: true });
    if (res?.[0]?.state) {
      setFinalizarArqueo(true);
    } else {
      res = await api.getCashRegister();
      res = res.sort(
        (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
      );
    }

    return setData({
      cash: res,
    });
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<CashOpen>();

  const onSubmit: SubmitHandler<CashOpen> = async (data) => {
    const date = watch("startDate");
    const time = watch("startTime");
    const startDateTime = `${date}T${time}:00.000Z`;
    const api = new ApiMethodCash();
    const user: UserData = AuthenticationService.getUser();
    try {
      await api.openCash({ ...data, startDate: startDateTime, user: user._id });
      toast.success("Caja Abierta");
      setFinalizarArqueo(true);
    } catch (error) {
      toast.error("Upps error al abrir caja");
    }
  };
  return (
    <>
      <div>
        <PageTitle titulo="Arqueo De Cajas" icon="../Finanzas-icon.svg" />
        {finalizarArqueo === false ? (
          <div className="w-full p-6">
            <TableArqueoCaja cash={data?.cash} />
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="ArqueoCaja-containerform">
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
                  />
                  <Input
                    label="Hora"
                    name="startTime"
                    type="time"
                    errors={errors.startDate}
                    register={register}
                    required
                  />
                  <Input
                    label="Monto inicial BS."
                    name="initialMount"
                    type="number"
                    errors={errors.initialMount}
                    register={register}
                    required
                  />
                  <Input
                    label="Distribuidor 1"
                    name="distribui"
                    type="text"
                    register={register}
                  />
                </div>
                <div className="flex justify-center items-center">
                  <button type="submit" className="ArqueoCaja-btn">
                    Iniciar arqueo
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <FinalizarArqueoCaja
            cash={data?.cash?.[0]}
            handleOnSubmit={() => {
              setFinalizarArqueo(false);
              getData();
            }}
          />
        )}
      </div>
    </>
  );
};

export { ArqueoDeCaja };
