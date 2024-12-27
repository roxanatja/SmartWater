import { useContext, useEffect } from "react";
import { ClientesContext } from "../ClientesContext";
import { Contador } from "../../../components/Contador/Contador";
import { useForm } from "react-hook-form";
import { Zone } from "../../../../../type/City";
import { IClientGetParams } from "../../../../../api/types/clients";

interface IClientFilters {
  withOrder: boolean;
  withoutOrder: boolean;
  withLoans: boolean;
  withoutLoans: boolean;
  withContract: boolean;
  withoutContract: boolean;
  withExpiredContract: boolean;
  withoutExpiredContract: boolean;
  withCredit: boolean;
  withoutCredit: boolean;
  daysToRenew: number;
  daysSinceRenewed: number;
  zones: { [key: string]: string };
  fromDate: string | null;
  toDate: string | null;
}

const initialState: IClientFilters = {
  withOrder: false,
  withoutOrder: false,
  withLoans: false,
  withoutLoans: false,
  withContract: false,
  withoutContract: false,
  withExpiredContract: false,
  withoutExpiredContract: false,
  withCredit: false,
  withoutCredit: false,
  daysToRenew: 0,
  daysSinceRenewed: 0,
  zones: {},
  fromDate: null,
  toDate: null,
}

const FiltroClientes = ({
  onChange,
  initialFilters,
  zones,
}: {
  zones: Zone[];
  onChange: (filters: IClientGetParams['filters']) => void;
  initialFilters: IClientGetParams['filters'];
}) => {
  const { setShowFiltro } = useContext(ClientesContext);
  const { register, handleSubmit, setValue, watch } = useForm<IClientFilters>({
    defaultValues: initialState,
  });

  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.hasOwnProperty('hasOrder')) {
        setValue('withOrder', !!initialFilters.hasOrder, { shouldValidate: true })
        setValue('withoutOrder', !initialFilters.hasOrder, { shouldValidate: true })
      }
      if (initialFilters.hasOwnProperty('hasExpiredContracts')) {
        setValue('withExpiredContract', !!initialFilters.hasExpiredContracts, { shouldValidate: true })
        setValue('withoutExpiredContract', !initialFilters.hasExpiredContracts, { shouldValidate: true })
      }
      if (initialFilters.hasOwnProperty('hasCredit')) {
        setValue('withCredit', !!initialFilters.hasCredit, { shouldValidate: true })
        setValue('withoutCredit', !initialFilters.hasCredit, { shouldValidate: true })
      }
      if (initialFilters.hasOwnProperty('hasLoan')) {
        setValue('withLoans', !!initialFilters.hasLoan, { shouldValidate: true })
        setValue('withoutLoans', !initialFilters.hasLoan, { shouldValidate: true })
      }
      if (initialFilters.hasOwnProperty('hasContract')) {
        setValue('withContract', !!initialFilters.hasContract, { shouldValidate: true })
        setValue('withoutContract', !initialFilters.hasContract, { shouldValidate: true })
      }
      if (initialFilters.renewedIn) {
        setValue('daysToRenew', initialFilters.renewedIn, { shouldValidate: true })
      }
      if (initialFilters.renewedAgo) {
        setValue('daysSinceRenewed', initialFilters.renewedAgo, { shouldValidate: true })
      }
      if (initialFilters.initialDate) {
        setValue('fromDate', initialFilters.initialDate, { shouldValidate: true })
      }
      if (initialFilters.finalDate) {
        setValue('toDate', initialFilters.finalDate, { shouldValidate: true })
      }
      if (initialFilters.zone) {
        initialFilters.zone.split(",").forEach((z) => {
          setValue(`zones.${z}`, z, { shouldValidate: true })
        })
      }
    }
  }, [initialFilters, setValue])

  const onSubmit = (data: IClientFilters) => {
    const filters = filterClients(data);
    onChange(filters);
    setShowFiltro(false);
  };

  const filterClients = (filters: IClientFilters): IClientGetParams['filters'] => {
    const result: IClientGetParams['filters'] = {}

    if (filters.fromDate) { result.initialDate = filters.fromDate.toString() }
    if (filters.toDate) { result.finalDate = filters.toDate.toString() }

    if (filters.zones) {
      const zones = Object.values(filters.zones).filter(z => !!z).join(',')
      if (zones !== "") { result.zone = zones }
    }

    if (filters.daysSinceRenewed > 0) { result.renewedAgo = filters.daysSinceRenewed }
    if (filters.daysToRenew > 0) { result.renewedIn = filters.daysToRenew }

    if (!((!!filters.withContract && !!filters.withoutContract) || (!filters.withContract && !filters.withoutContract))) {
      result.hasContract = filters.withContract
    }

    if (!((!!filters.withCredit && !!filters.withoutCredit) || (!filters.withCredit && !filters.withoutCredit))) {
      result.hasCredit = filters.withCredit
    }

    if (!((!!filters.withExpiredContract && !!filters.withoutExpiredContract) || (!filters.withExpiredContract && !filters.withoutExpiredContract))) {
      result.hasExpiredContracts = filters.withExpiredContract
    }

    if (!((!!filters.withLoans && !!filters.withoutLoans) || (!filters.withLoans && !filters.withoutLoans))) {
      result.hasLoan = filters.withLoans
    }

    if (!((!!filters.withOrder && !!filters.withoutOrder) || (!filters.withOrder && !filters.withoutOrder))) {
      result.hasOrder = filters.withOrder
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
        {/* Prestamos */}
        <div className="">
          <div className="FiltroClientes-RenovaciónTitulo mb-2">
            <span className="text-blue_custom font-semibold">Préstamo</span>
          </div>
          <div className="FiltroClientes-Cuentas flex flex-col">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col w-full gap-2">
                <div className="flex gap-3 items-center">
                  <input
                    className="input-check accent-blue_custom"
                    type="checkbox"
                    id="check1"
                    {...register("withLoans")}
                  />
                  <label htmlFor="check1" className="text-sm" >
                    Con préstamo
                  </label>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    className="input-check accent-blue_custom"
                    type="checkbox"
                    id="check2"
                    {...register("withoutLoans")}
                  />
                  <label htmlFor="check2" className="text-sm" >
                    Sin préstamo
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credit */}
        <div className="">
          <div className="FiltroClientes-RenovaciónTitulo mb-2">
            <span className="text-blue_custom font-semibold">Cuentas por cobrar</span>
          </div>
          <div className="FiltroClientes-Cuentas flex flex-col">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col w-full gap-2">
                <div className="flex gap-3 items-center">
                  <input
                    className="input-check accent-blue_custom"
                    type="checkbox"
                    id="check3"
                    {...register("withCredit")}
                  />
                  <label htmlFor="check3" className="text-sm" >
                    Con crédito
                  </label>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    className="input-check accent-blue_custom"
                    type="checkbox"
                    id="check4"
                    {...register("withoutCredit")}
                  />
                  <label htmlFor="check4" className="text-sm" >
                    Sin crédito
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ordenes */}
        <div className="">
          <div className="FiltroClientes-RenovaciónTitulo mb-2">
            <span className="text-blue_custom font-semibold">Órdernes</span>
          </div>
          <div className="FiltroClientes-Cuentas flex flex-col">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col w-full gap-2">
                <div className="flex gap-3 items-center">
                  <input
                    className="input-check accent-blue_custom"
                    type="checkbox"
                    id="check5"
                    {...register("withOrder")}
                  />
                  <label htmlFor="check5" className="text-sm" >
                    Con órdenes
                  </label>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    className="input-check accent-blue_custom"
                    type="checkbox"
                    id="check6"
                    {...register("withoutOrder")}
                  />
                  <label htmlFor="check6" className="text-sm" >
                    Sin órdenes
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

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


      <div className="w-full flex flex-col gap-2 mb-8">
        <label className="font-semibold text-blue_custom">Zonas</label>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          {zones.map((zone, index) => (
            <div
              key={index}
              className="flex items-center gap-3"
            >
              <input
                className="input-check accent-blue_custom"
                type="checkbox"
                {...register(`zones.${zone._id}`)}
                value={zone._id}
                id={`zone-${zone._id}`}
              />
              <label
                htmlFor={`zone-${zone._id}`}
                className="text-sm"
              >
                {zone.name}
              </label>
            </div>
          ))}
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

export default FiltroClientes;
