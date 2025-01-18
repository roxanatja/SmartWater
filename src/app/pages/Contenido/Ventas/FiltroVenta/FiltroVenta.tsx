import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { VentasContext } from "../VentasContext";
import { ISalesGetParams } from "../../../../../api/types/sales";
import { Zone } from "../../../../../type/City";
import { User } from "../../../../../type/User";
import moment from "moment";

interface ISaleFilters {
  cash: boolean;
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
  distributor: { [key: string]: string };
}

const initialState: ISaleFilters = {
  cash: false,
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
  distributor: {}
}

const FiltroVenta = ({
  onChange,
  initialFilters,
  zones,
  distribuidores
}: {
  zones: Zone[];
  distribuidores: User[];
  onChange: (filters: ISalesGetParams['filters']) => void;
  initialFilters: ISalesGetParams['filters'];
}) => {
  const { register, handleSubmit, setValue, watch } = useForm<ISaleFilters>({
    defaultValues: initialState || {},
  });

  const [selectedDists, setSelectedDists] = useState<User[]>([])

  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.hasOwnProperty('creditSale')) {
        setValue('credit', !!initialFilters.creditSale, { shouldValidate: true })
      }
      if (initialFilters.hasOwnProperty('paymentMethodCash')) {
        setValue('cash', !!initialFilters.paymentMethodCash, { shouldValidate: true })
      }
      if (initialFilters.hasOwnProperty('paymentMethodCurrentAccount')) {
        setValue('currentAccount', !!initialFilters.paymentMethodCurrentAccount, { shouldValidate: true })
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
      if (initialFilters.user) {
        setSelectedDists(distribuidores.filter(d => initialFilters.user!.includes(d._id)))
      }
    }
  }, [initialFilters, setValue, distribuidores])

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

    if (!(!filters.credit && !filters.currentAccount && !filters.cash)) {
      result.creditSale = filters.credit
      result.paymentMethodCurrentAccount = filters.currentAccount
      result.paymentMethodCash = filters.cash
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

    if (selectedDists.length > 0) {
      const dists = selectedDists.map(z => z._id).join(',')
      if (dists !== "") { result.user = dists }
    }

    return result
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row mb-4">
        <div className="flex-1">
          <div className="FiltroClientes-Fechastitulo mb-2">
            <span className="text-blue_custom font-semibold">Fechas</span>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1 relative">
              <span className="text-left text-sm">De</span>
              <img src="/desde.svg" alt="" className="w-[20px] h-[20px] absolute bottom-3 left-4 invert-0 dark:invert" />
              <input
                max={watch('toDate')?.toString() || moment().format("YYYY-MM-DD")}
                type="date"
                {...register("fromDate")}
                className="border-0 rounded outline-none font-semibold w-full bg-transparent text-sm full-selector pl-10"
              />
            </div>
            <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1 relative">
              <span className="text-left text-sm">A</span>
              <img src="/hasta.svg" alt="" className="w-[20px] h-[20px] absolute bottom-3 left-4 invert-0 dark:invert" />
              <input
                min={watch('fromDate')?.toString()}
                max={moment().format("YYYY-MM-DD")}
                type="date"
                {...register("toDate")}
                className="border-0  rounded outline-none font-semibold w-full bg-transparent text-sm full-selector pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <div className="FiltroClientes-RenovaciónTitulo mb-2">
          <span className="text-blue_custom font-semibold">Ventas</span>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex gap-3 items-center">
            <input
              className="input-check accent-blue_custom"
              type="checkbox"
              id="check4"
              checked={watch('credit')}
              onChange={() => {
                const credit = watch("credit")
                setValue("credit", !credit);
                setValue("currentAccount", false);
                setValue("cash", false);
              }}
            />
            <label htmlFor="check4" className="text-sm" >
              A crédito
            </label>
          </div>
          <div className="flex gap-3 items-center">
            <input
              className="input-check accent-blue_custom"
              type="checkbox"
              id="check19"
              checked={watch('currentAccount')}
              onChange={() => {
                const credit = watch("currentAccount")
                setValue("currentAccount", !credit);
                setValue("credit", false);
                setValue("cash", false);
              }}
            />
            <label htmlFor="check19" className="text-sm" >
              Cta. Cte.
            </label>
          </div>
          <div className="flex gap-3 items-center">
            <input
              className="input-check accent-blue_custom"
              type="checkbox"
              id="check20"
              checked={watch('cash')}
              onChange={() => {
                const credit = watch("cash")
                setValue("cash", !credit);
                setValue("currentAccount", false);
                setValue("credit", false);
              }}
            />
            <label htmlFor="check20" className="text-sm" >
              Efectivo
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col mb-4">
        <div className="FiltroClientes-RenovaciónTitulo mb-2">
          <span className="text-blue_custom font-semibold">Factura</span>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex gap-3 items-center">
            <input
              className="input-check accent-blue_custom"
              type="checkbox"
              id="check5"
              checked={watch('withInvoice')}
              onChange={() => {
                const credit = watch("withInvoice")
                setValue("withInvoice", !credit);
                setValue("withoutInvoice", false);
              }}
            />
            <img src="/ConFactura.svg" alt="" />
            <label htmlFor="check5" className="text-sm" >
              Con factura
            </label>
          </div>
          <div className="flex gap-3 items-center">
            <input
              className="input-check accent-blue_custom"
              type="checkbox"
              id="check6"
              checked={watch('withoutInvoice')}
              onChange={() => {
                const credit = watch("withoutInvoice")
                setValue("withoutInvoice", !credit);
                setValue("withInvoice", false);
              }}
            />
            <img src="/nofactura.svg" alt="" />
            <label htmlFor="check6" className="text-sm" >
              Sin factura
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 ml-4">
        <p className="font-semibold text-blue_custom -ml-4">De clientes</p>

        <div className="flex gap-3 items-center">
          <input
            className="input-check accent-blue_custom"
            type="checkbox"
            id="check1"
            checked={watch('withLoan')}
            onChange={() => {
              const credit = watch("withLoan")
              setValue("withLoan", !credit);
              setValue("withoutLoan", false);

              setValue("withContract", false);
              setValue("withoutContract", false);
              setValue("withExpiredContract", false);
              setValue("withoutExpiredContract", false);
            }}
          />
          <img src="/ConContrato.svg" alt="" />
          <label htmlFor="check1" className="text-sm" >
            Con préstamo
          </label>
        </div>
        <div className="flex flex-col gap-3 ml-6">
          <div className="flex gap-3 items-center">
            <input
              className="input-check accent-blue_custom"
              type="checkbox"
              id="check7"
              checked={watch('withContract')}
              onChange={() => {
                const credit = watch("withContract")
                setValue("withContract", !credit);
                setValue("withoutContract", false);
                setValue("withLoan", true);
                setValue("withoutLoan", false);
                setValue("withExpiredContract", false);
                setValue("withoutExpiredContract", false);
              }}
            />
            <img src="/ConContrato.svg" alt="" />
            <label htmlFor="check7" className="text-sm" >
              Con contratos
            </label>
          </div>

          <div className="flex flex-col gap-3 ml-6">
            <div className="flex gap-3 items-center">
              <input
                className="input-check accent-blue_custom"
                type="checkbox"
                id="check9"
                checked={watch('withExpiredContract')}
                onChange={() => {
                  const expired = watch("withExpiredContract")
                  setValue("withContract", true);
                  setValue("withoutContract", false);
                  setValue("withLoan", true);
                  setValue("withoutLoan", false);
                  setValue("withExpiredContract", !expired);
                  setValue("withoutExpiredContract", false);
                }}
              />
              <img src="/ContratoVencido.svg" alt="" />
              <label htmlFor="check9" className="text-sm" >
                Vencidos
              </label>
            </div>
            <div className="flex gap-3 items-center">
              <input
                className="input-check accent-blue_custom"
                type="checkbox"
                id="check10"
                checked={watch('withoutExpiredContract')}
                onChange={() => {
                  const expired = watch("withoutExpiredContract")
                  setValue("withContract", true);
                  setValue("withoutContract", false);
                  setValue("withLoan", true);
                  setValue("withoutLoan", false);
                  setValue("withoutExpiredContract", !expired);
                  setValue("withExpiredContract", false);
                }}
              />
              <img src="/ConContrato.svg" alt="" />
              <label htmlFor="check10" className="text-sm" >
                Vigentes
              </label>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <input
              className="input-check accent-blue_custom"
              type="checkbox"
              id="check8"
              checked={watch('withoutContract')}
              onChange={() => {
                const credit = watch("withoutContract")
                setValue("withoutContract", !credit);
                setValue("withLoan", true);
                setValue("withoutLoan", false);

                setValue("withContract", false);
                setValue("withoutExpiredContract", false);
                setValue("withExpiredContract", false);
              }}
            />
            <img src="/SinContrato.svg" alt="" />
            <label htmlFor="check8" className="text-sm" >
              Sin contratos
            </label>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <input
            className="input-check accent-blue_custom"
            type="checkbox"
            id="check2"
            checked={watch('withoutLoan')}
            onChange={() => {
              const credit = watch("withoutLoan")
              setValue("withoutLoan", !credit);
              setValue("withLoan", false);
              setValue("withContract", false);
              setValue("withoutContract", false);
              setValue("withoutExpiredContract", false);
              setValue("withExpiredContract", false);
            }}
          />
          <img src="/SinContrato.svg" alt="" />
          <label htmlFor="check2" className="text-sm" >
            Sin préstamo
          </label>
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 mb-8">
        <label className="font-semibold text-blue_custom">Distribuidores</label>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          {distribuidores.map((dists, index) => (
            <div
              key={index}
              className="flex items-center gap-3"
            >
              <input
                className="input-check accent-blue_custom"
                type="checkbox"
                onChange={() => {
                  if (selectedDists.some(s => s._id === dists._id)) {
                    setSelectedDists(prev => prev.filter(s => s._id !== dists._id))
                  } else {
                    setSelectedDists(prev => [...prev, dists])
                  }

                  zones.forEach(z => setValue(`zones.${z._id}`, "", { shouldValidate: true }))
                }}
                checked={selectedDists.some(sd => sd._id === dists._id)}
                id={`distrib-${dists._id}`}
              />
              <label
                htmlFor={`distrib-${dists._id}`}
                className="text-sm"
              >
                {dists.fullName || "Sin nombre"}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full flex flex-col gap-2 mb-8">
        <label className="font-semibold text-blue_custom">Zonas</label>
        <div className="flex flex-wrap gap-x-6 gap-y-4">
          {zones
            .filter(zone => selectedDists.length > 0 ? selectedDists.some(d => d.zones?.includes(zone._id)) : true)
            .map((zone, index) => (
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
