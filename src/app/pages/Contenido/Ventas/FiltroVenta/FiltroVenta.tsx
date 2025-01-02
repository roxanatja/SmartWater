import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { VentasContext } from "../VentasContext";
import { ISalesGetParams } from "../../../../../api/types/sales";
import { Zone } from "../../../../../type/City";

interface ISaleFilters {
  credit: boolean;
  currentAccount: boolean;
  withInvoice: boolean;
  withoutInvoice: boolean;
  withContract: boolean;
  withoutContract: boolean;
  withExpiredContract: boolean;
  withoutExpiredContract: boolean;
  withLoan: boolean;
  withoutLoan: boolean;
  fromDate: string | null;
  toDate: string | null;
  zones: { [key: string]: string };
}

const initialState: ISaleFilters = {
  credit: false,
  currentAccount: false,
  withInvoice: false,
  withoutInvoice: false,
  withContract: false,
  withoutContract: false,
  withExpiredContract: false,
  withoutExpiredContract: false,
  withLoan: false,
  withoutLoan: false,
  fromDate: null,
  toDate: null,
  zones: {},
}

const FiltroVenta = ({
  onChange,
  initialFilters,
  zones,
}: {
  zones: Zone[];
  onChange: (filters: ISalesGetParams['filters']) => void;
  initialFilters: ISalesGetParams['filters'];
}) => {
  const { register, handleSubmit, setValue, watch } = useForm<ISaleFilters>({
    defaultValues: initialState || {},
  });

  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.hasOwnProperty('creditSale')) {
        setValue('credit', !!initialFilters.creditSale, { shouldValidate: true })
        setValue('currentAccount', !initialFilters.creditSale, { shouldValidate: true })
      }
      if (initialFilters.hasOwnProperty('hasInvoice')) {
        setValue('withInvoice', !!initialFilters.hasInvoice, { shouldValidate: true })
        setValue('withoutInvoice', !initialFilters.hasInvoice, { shouldValidate: true })
      }
      if (initialFilters.hasOwnProperty('hasClientContract')) {
        setValue('withContract', !!initialFilters.hasClientContract, { shouldValidate: true })
        setValue('withoutContract', !initialFilters.hasClientContract, { shouldValidate: true })
      }
      if (initialFilters.hasOwnProperty('hasClientLoan')) {
        setValue('withLoan', !!initialFilters.hasClientLoan, { shouldValidate: true })
        setValue('withoutLoan', !initialFilters.hasClientLoan, { shouldValidate: true })
      }
      if (initialFilters.hasOwnProperty('hasClientExpiredContracts')) {
        setValue('withExpiredContract', !!initialFilters.hasClientExpiredContracts, { shouldValidate: true })
        setValue('withoutExpiredContract', !initialFilters.hasClientExpiredContracts, { shouldValidate: true })
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

  const { setShowFiltro } = useContext(VentasContext);

  const onSubmit = (data: ISaleFilters) => {
    const filters = filterClients(data);
    onChange(filters);
    setShowFiltro(false);
  };

  const filterClients = (filters: ISaleFilters): ISalesGetParams['filters'] => {
    const result: ISalesGetParams['filters'] = {}

    if (filters.fromDate) { result.initialDate = filters.fromDate.toString() }
    if (filters.toDate) { result.finalDate = filters.toDate.toString() }

    if (filters.zones) {
      const zones = Object.values(filters.zones).filter(z => !!z).join(',')
      if (zones !== "") { result.zone = zones }
    }

    if (!((!!filters.withContract && !!filters.withoutContract) || (!filters.withContract && !filters.withoutContract))) {
      result.hasClientContract = filters.withContract
    }

    if (!((!!filters.credit && !!filters.currentAccount) || (!filters.credit && !filters.currentAccount))) {
      result.creditSale = filters.credit
    }

    if (!((!!filters.withExpiredContract && !!filters.withoutExpiredContract) || (!filters.withExpiredContract && !filters.withoutExpiredContract))) {
      result.hasClientExpiredContracts = filters.withExpiredContract
    }

    if (!((!!filters.withLoan && !!filters.withoutLoan) || (!filters.withLoan && !filters.withoutLoan))) {
      result.hasClientLoan = filters.withLoan
    }

    if (!((!!filters.withInvoice && !!filters.withoutInvoice) || (!filters.withInvoice && !filters.withoutInvoice))) {
      result.hasInvoice = filters.withInvoice
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
            <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1">
              <span className="text-left text-sm">De</span>
              <input
                max={watch('toDate')?.toString() || new Date().toISOString().split("T")[0]}
                type="date"
                {...register("fromDate")}
                className="border-0 rounded outline-none font-semibold w-full bg-transparent"
              />
            </div>
            <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1">
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
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {/* Credit */}
        <div className="">
          <div className="FiltroClientes-RenovaciónTitulo mb-2">
            <span className="text-blue_custom font-semibold opacity-0">h</span>
          </div>
          <div className="FiltroClientes-Cuentas flex flex-col">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col w-full gap-2">
                <div className="flex gap-3 items-center">
                  <input
                    className="input-check accent-blue_custom"
                    type="checkbox"
                    id="check3"
                    {...register("credit")}
                  />
                  <label htmlFor="check3" className="text-sm" >
                    A crédito
                  </label>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    className="input-check accent-blue_custom"
                    type="checkbox"
                    id="check4"
                    {...register("currentAccount")}
                  />
                  <label htmlFor="check4" className="text-sm" >
                    De contado
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Factura */}
        <div className="">
          <div className="FiltroClientes-RenovaciónTitulo mb-2">
            <span className="text-blue_custom font-semibold">Factura</span>
          </div>
          <div className="FiltroClientes-Cuentas flex flex-col">
            <div className="flex flex-col gap-3 w-full">
              <div className="flex flex-col w-full gap-2">
                <div className="flex gap-3 items-center">
                  <input
                    className="input-check accent-blue_custom"
                    type="checkbox"
                    id="check5"
                    {...register("withInvoice")}
                  />
                  <label htmlFor="check5" className="text-sm" >
                    Con factura
                  </label>
                </div>
                <div className="flex gap-3 items-center">
                  <input
                    className="input-check accent-blue_custom"
                    type="checkbox"
                    id="check6"
                    {...register("withoutInvoice")}
                  />
                  <label htmlFor="check6" className="text-sm" >
                    Sin factura
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                    {...register("withLoan")}
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
                    {...register("withoutLoan")}
                  />
                  <label htmlFor="check2" className="text-sm" >
                    Sin préstamo
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

export default FiltroVenta;
