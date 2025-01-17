import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./FiltroPrestamos.css";
import { PrestamosContext } from "../PrestamosContext";
import { Contador } from "../../../components/Contador/Contador";
import { ILoansGetParams } from "../../../../../api/types/loans";
import { Zone } from "../../../../../type/City";
import { User } from "../../../../../type/User";

interface ILoanFilters {
  withContract: boolean;
  withoutContract: boolean;
  withExpiredContract: boolean;
  withoutExpiredContract: boolean;
  fromDate: string | null;
  toDate: string | null;
  daysToRenew: number;
  daysSinceRenewed: number;

  distributor: { [key: string]: string };
  zones: { [key: string]: string };
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

  distributor: {},
  zones: {},
}

const FiltroPrestamos = ({
  onChange,
  initialFilters,
  zones,
  distribuidores
}: {
  zones: Zone[];
  distribuidores: User[];
  onChange: (filters: ILoansGetParams['filters']) => void;
  initialFilters: ILoansGetParams['filters'];
}) => {
  const { setShowFiltro } = useContext(PrestamosContext);
  const { register, handleSubmit, setValue, watch } = useForm<ILoanFilters>({
    defaultValues: initialState || {},
  });

  const [selectedDists, setSelectedDists] = useState<User[]>([])

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

    if (filters.zones) {
      const zones = Object.values(filters.zones).filter(z => !!z).join(',')
      if (zones !== "") { result.zone = zones }
    }

    if (selectedDists.length > 0) {
      const dists = selectedDists.map(z => z._id).join(',')
      if (dists !== "") { result.user = dists }
    }

    return result
  };



  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-8">
      <div className="flex-1 flex flex-col">
        <div className="FiltroClientes-RenovaciónTitulo mb-2">
          <span className="text-blue_custom font-semibold">Renovación</span>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center gap-3 justify-between">
            <span className="text-sm">Se renovarán hasta en</span>
            <div>
              <Contador
                initialValue={watch('daysToRenew')}
                min={0}
                onIncrementar={(count) => setValue("daysToRenew", count, { shouldValidate: true })}
                onDecrementar={(count) => setValue("daysToRenew", count, { shouldValidate: true })}
                iconsClassname="text-blue_bright"
                numberClassname="border border-blue_bright px-4 rounded-md tabular-nums text-sm"
              />
            </div>
            <input
              type="hidden"
              {...register("daysToRenew")}
              defaultValue={0}
            />
          </div>
          <div className="flex items-center gap-3 justify-between">
            <span className="text-sm">Renovado hace más de</span>
            <div>
              <Contador
                initialValue={watch('daysSinceRenewed')}
                min={0}
                onIncrementar={(count) => setValue("daysSinceRenewed", count, { shouldValidate: true })}
                onDecrementar={(count) => setValue("daysSinceRenewed", count, { shouldValidate: true })}
                iconsClassname="text-blue_bright"
                numberClassname="border border-blue_bright px-4 rounded-md tabular-nums text-sm"
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

      <div className="flex-1">
        <div className="FiltroClientes-Fechastitulo mb-2">
          <span className="text-blue_custom font-semibold">Fechas</span>
        </div>
        <div className="flex gap-3 w-full">
          <div className="shadow-xl rounded-3xl px-4 py-2 border-gray-100 border flex-1 relative">
            <span className="text-left text-sm">De</span>
            <img src="/desde.svg" alt="" className="w-[20px] h-[20px] absolute bottom-3 left-4 invert-0 dark:invert" />
            <input
              max={watch('toDate')?.toString() || new Date(new Date().toLocaleDateString()).toISOString().split("T")[0]}
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
              max={new Date(new Date().toLocaleDateString()).toISOString().split("T")[0]}
              type="date"
              {...register("toDate")}
              className="border-0  rounded outline-none font-semibold w-full bg-transparent text-sm full-selector pl-10"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 ml-4">
        <p className="font-semibold text-blue_custom -ml-4">Préstamos y Contratos</p>

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

export default FiltroPrestamos;
