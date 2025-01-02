import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./FiltroPrestamos.css";
import { PrestamosContext } from "../PrestamosContext";
import { Contador } from "../../../components/Contador/Contador";
import { ILoansGetParams } from "../../../../../api/types/loans";

interface ILoanFilters {
  withContract: boolean;
  withoutContract: boolean;
  withExpiredContract: boolean;
  withoutExpiredContract: boolean;
  fromDate: string | null;
  toDate: string | null;
  daysToRenew: number;
  daysSinceRenewed: number;
}

const initialState: ILoanFilters = {
  withContract: false,
  withoutContract: false,
  withExpiredContract: false,
  withoutExpiredContract: false,
  fromDate: null,
  toDate: null,
  daysToRenew: 0,
  daysSinceRenewed: 0,
}

const FiltroPrestamos = ({
  onChange,
  initialFilters,
}: {
  onChange: (filters: ILoansGetParams['filters']) => void;
  initialFilters: ILoansGetParams['filters'];
}) => {
  const { setShowFiltro } = useContext(PrestamosContext);
  const { register, handleSubmit, setValue, watch } = useForm<ILoanFilters>({
    defaultValues: initialState || {},
  });

  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.hasOwnProperty('hasContract')) {
        setValue('withContract', !!initialFilters.hasContract, { shouldValidate: true })
        setValue('withoutContract', !initialFilters.hasContract, { shouldValidate: true })
      }
      if (initialFilters.hasOwnProperty('hasExpiredContract')) {
        setValue('withExpiredContract', !!initialFilters.hasExpiredContract, { shouldValidate: true })
        setValue('withoutExpiredContract', !initialFilters.hasExpiredContract, { shouldValidate: true })
      }
      if (initialFilters.initialDate) {
        setValue('fromDate', initialFilters.initialDate, { shouldValidate: true })
      }
      if (initialFilters.finalDate) {
        setValue('toDate', initialFilters.finalDate, { shouldValidate: true })
      }
      if (initialFilters.renewedIn) {
        setValue('daysToRenew', initialFilters.renewedIn, { shouldValidate: true })
      }
      if (initialFilters.renewedAgo) {
        setValue('daysSinceRenewed', initialFilters.renewedAgo, { shouldValidate: true })
      }
    }
  }, [initialFilters, setValue])

  const onSubmit = (data: ILoanFilters) => {
    const filters = filterClients(data);
    onChange(filters);
    setShowFiltro(false);
  };

  const filterClients = (filters: ILoanFilters): ILoansGetParams['filters'] => {
    const result: ILoansGetParams['filters'] = {}

    if (filters.fromDate) { result.initialDate = filters.fromDate.toString() }
    if (filters.toDate) { result.finalDate = filters.toDate.toString() }

    if (filters.daysSinceRenewed > 0) { result.renewedAgo = filters.daysSinceRenewed }
    if (filters.daysToRenew > 0) { result.renewedIn = filters.daysToRenew }

    if (!((!!filters.withContract && !!filters.withoutContract) || (!filters.withContract && !filters.withoutContract))) {
      result.hasContract = filters.withContract
    }

    if (!((!!filters.withExpiredContract && !!filters.withoutExpiredContract) || (!filters.withExpiredContract && !filters.withoutExpiredContract))) {
      result.hasExpiredContract = filters.withExpiredContract
    }

    return result
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row mb-4">
        <div className="flex-1">
          <div className="FiltroClientes-Fechastitulo mb-2">
            <span className="text-blue_custom font-semibold">Fechas</span>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border">
              <span className="text-left text-sm">De</span>
              <input
                max={watch('toDate')?.toString() || new Date().toISOString().split("T")[0]}
                type="date"
                {...register("fromDate")}
                className="border-0 rounded outline-none font-semibold w-full bg-transparent"
              />
            </div>
            <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border">
              <span className="text-left text-sm">A</span>
              <input
                min={watch('fromDate')?.toString()}
                max={new Date().toISOString().split("T")[0]}
                type="date"
                {...register("toDate")}
                className="border-0  rounded outline-none font-semibold w-full bg-transparent"
              />
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="FiltroClientes-RenovaciónTitulo mb-2">
            <span className="text-blue_custom font-semibold">Renovación</span>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <span className="flex-[2]">Por renovar hasta en</span>
              <div className="flex-[3]">
                <Contador
                  initialValue={watch('daysToRenew')}
                  min={0}
                  onIncrementar={(count) => setValue("daysToRenew", count, { shouldValidate: true })}
                  onDecrementar={(count) => setValue("daysToRenew", count, { shouldValidate: true })}
                />
              </div>
              <input
                type="hidden"
                {...register("daysToRenew")}
                defaultValue={0}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="flex-[2]">Renovado hace más de</span>
              <div className="flex-[3]">
                <Contador
                  initialValue={watch('daysSinceRenewed')}
                  min={0}
                  onIncrementar={(count) => setValue("daysSinceRenewed", count, { shouldValidate: true })}
                  onDecrementar={(count) => setValue("daysSinceRenewed", count, { shouldValidate: true })}
                />
              </div>
              <input
                type="hidden"
                {...register("daysSinceRenewed")}
                defaultValue={0}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {/* Contratos */}
        <div className="">
          <div className="FiltroClientes-RenovaciónTitulo mb-2">
            <span className="text-blue_custom font-semibold">Contratos</span>
          </div>
          <div className="FiltroClientes-Cuentas flex flex-col">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col w-full gap-2">
                <div className="flex gap-3 items-center">
                  <input
                    className="input-check accent-blue_custom"
                    type="checkbox"
                    id="check7"
                    {...register("withContract")}
                  />
                  <label htmlFor="check7" className="text-sm" >
                    Con contratos
                  </label>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    className="input-check accent-blue_custom"
                    type="checkbox"
                    id="check8"
                    {...register("withoutContract")}
                  />
                  <label htmlFor="check8" className="text-sm" >
                    Sin contratos
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contratos expirados */}
        <div className="">
          <div className="FiltroClientes-RenovaciónTitulo mb-2">
            <span className="text-blue_custom font-semibold">Contratos expirados</span>
          </div>
          <div className="FiltroClientes-Cuentas flex flex-col">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col w-full gap-2">
                <div className="flex gap-3 items-center">
                  <input
                    className="input-check accent-blue_custom"
                    type="checkbox"
                    id="check9"
                    {...register("withExpiredContract")}
                  />
                  <label htmlFor="check9" className="text-sm" >
                    Con contratos expirados
                  </label>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    className="input-check accent-blue_custom"
                    type="checkbox"
                    id="check10"
                    {...register("withoutExpiredContract")}
                  />
                  <label htmlFor="check10" className="text-sm" >
                    Sin contratos expirados
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full items-center gap-3 px-4">
        <button
          type="button"
          onClick={() => {
            setShowFiltro(false);
            onChange({});
          }}
          className="mt-4 border-blue-500 border-2 rounded-full px-4 py-2.5 shadow-xl text-blue-500 font-bold w-full"
        >
          Quitar Filtros
        </button>
        <button
          type="submit"
          className="mt-4 bg-blue-500 border-2 border-blue-500 shadow-xl text-white rounded-full px-4 py-2.5 w-full font-bold"
        >
          Aplicar Filtros
        </button>
      </div>
    </form >
  );
};

export default FiltroPrestamos;
