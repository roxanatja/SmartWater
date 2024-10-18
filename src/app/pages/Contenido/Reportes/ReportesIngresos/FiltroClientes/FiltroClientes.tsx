import { useContext, useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import GetApiMethod from "../../../../../../Class/api.class";
import { Zone } from "../../../../../../Class/types.data";
import { Client } from "../../../../../../type/Cliente/Client";
import { Contador } from "../../../../components/Contador/Contador";
import { ReportesIngresosContext } from "../ReportesIngresosContext";
import "./FiltroClientes.css";

const FiltroClientes = ({
  clients,
  onChange,
  initialFilters,
}: {
  clients?: Client[] | undefined;
  onChange: (value: Client[], filter: any) => void;
  initialFilters: any;
}) => {
  const { setClientes } = useContext(ReportesIngresosContext);
  const [data, setData] = useState<{ zones: Zone[] }>();
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: initialFilters || {},
  });

  const getData = useCallback(async () => {
    const api = new GetApiMethod();
    return setData({
      zones: await api.getZone(),
    });
  }, []);

  const onSubmit = (data: any) => {
    setClientes(false);
    if (!clients) {
      return;
    }
    const filtered = filterClients(clients, data);
    onChange(filtered, data);
  };

  const filterClients = (clients: Client[], filters: any) => {
    return clients.filter((client) => {
      // Check loans
      if (filters.withLoans && !client.hasLoan) return false;
      if (filters.withoutLoans && client.hasLoan) return false;

      // Check credit
      if (filters.withCredit && client.credit <= 0) return false;
      if (filters.withoutCredit && client.credit > 0) return false;

      // Check days to renew
      if (filters.daysToRenew > 0 && client.renewInDays > filters.daysToRenew)
        return false;

      // Check days since renewed
      if (
        filters.daysSinceRenewed > 0 &&
        client.renewInDays < filters.daysSinceRenewed
      )
        return false;

      // Check zones (multiple selected)
      if (
        filters.zones &&
        !Object.values(filters.zones).some(
          (checked) => checked && client.zone === checked
        )
      ) {
        return false;
      }
      if (
        filters.fromDate &&
        new Date(client.created) < new Date(filters.fromDate)
      )
        return false;
      if (filters.toDate && new Date(client.created) > new Date(filters.toDate))
        return false;

      return true; // Passed all checks
    });
  };

  const distribu = [
    { _id: "1", name: "Distribuidor 1" },
    { _id: "2", name: "Distribuidor 2" },
  ];

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6">
      <h2 className="text-blue_custom font-bold">Filtros</h2>

      <div className="FiltroClientes-Renovación">
        <div className="FiltroClientes-RenovaciónTitulo">
          <span>Renovación</span>
        </div>
        <div className="lineagris"></div>
        <div className="FiltroClientes-RenovaciónOption">
          <div className="FiltroClientes-Renovadoinicio">
            <span>Por renovar hasta en</span>
            <Contador
              onIncrementar={(count) => setValue("daysToRenew", count)}
              onDecrementar={(count) => setValue("daysToRenew", count)}
            />
            <input
              type="hidden"
              {...register("daysToRenew")}
              defaultValue={0}
            />
          </div>
          <div className="FiltroClientes-Renovadoinicio">
            <span>Renovado hace más de</span>
            <Contador
              onIncrementar={(count) => setValue("daysSinceRenewed", count)}
              onDecrementar={(count) => setValue("daysSinceRenewed", count)}
            />
            <input
              type="hidden"
              {...register("daysSinceRenewed")}
              defaultValue={0}
            />
          </div>
          <div className="FiltroClientes-Fechastitulo">
            <span>Fechas</span>
          </div>
          <div className="FiltroClientes-Fechascontainer">
            <div className="FiltroClientes-Fecha">
              <span className="text-left">De</span>
              <input
                type="date"
                {...register("fromDate")}
                className="border-0 rounded p-2 outline-none font-semibold w-full text-right"
              />
            </div>
            <div className="FiltroClientes-Fecha">
              <span className="text-left">A</span>
              <input
                type="date"
                {...register("toDate")}
                className="border-0  rounded p-2 outline-none font-semibold w-full text-right"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="FiltroClientes-Renovación">
        <div className="FiltroClientes-RenovaciónTitulo">
          <span>Préstamo</span>
        </div>
        <div className="lineagris"></div>
        <div className="FiltroClientes-Cuentas flex flex-col">
          <div className="flex flex-col gap-3 w-full">
            <div className="flex justify-between w-full">
              <div className="FiltroClientes-CuentasOptionInput">
                <input
                  className="input-check"
                  type="checkbox"
                  {...register("withLoans")}
                />
                <img src="/presta.svg" alt="/presta.svg" />
                <span className="text-blue_custom font-semibold text-sm">
                  Con préstamo
                </span>
              </div>
              <div className="FiltroClientes-CuentasOptionInput">
                <input
                  className="input-check"
                  type="checkbox"
                  {...register("iscredicv")}
                />
                <span className="text-blue_custom font-semibold text-sm text-nowrap">
                  Contratos vencido
                </span>
              </div>
            </div>

            <div className="FiltroClientes-CuentasOptionInput">
              <input
                className="input-check"
                type="checkbox"
                {...register("withoutLoans")}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="11"
                  stroke="#F40101"
                  strokeWidth="2"
                />
                <image
                  xlinkHref="../../Dispensador-iconsvg.svg"
                  x="5"
                  y="6"
                  width="14"
                  height="14"
                />
                <line
                  x1="6"
                  y1="6"
                  x2="18"
                  y2="18"
                  stroke="#FF0000"
                  strokeWidth="3"
                />
              </svg>
              <span className="text-blue_custom font-semibold text-sm">
                Sin préstamo
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-sm text-black font-semibold">
              Cuentas por cobrar
            </h4>
            <div className="FiltroClientes-CuentasOptionInput">
              <input
                className="input-check"
                type="checkbox"
                {...register("withCredit")}
              />
              <img src="/saldo.svg" alt="/saldo.svg" />
              <span className="text-blue_custom font-semibold text-sm">
                Con saldo
              </span>
            </div>
            <div className="FiltroClientes-CuentasOptionInput">
              <input
                className="input-check"
                type="checkbox"
                {...register("withoutCredit")}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="11"
                  stroke="#F40101"
                  strokeWidth="2"
                />
                <image
                  xlinkHref="../../monedadenegada-icon.svg"
                  x="5"
                  y="6"
                  width="14"
                  height="14"
                />
                <line
                  x1="6"
                  y1="6"
                  x2="18"
                  y2="18"
                  stroke="#FF0000"
                  strokeWidth="3"
                />
              </svg>
              <span className="text-blue_custom font-semibold text-sm">
                Sin saldo
              </span>
            </div>
          </div>
        </div>
        <div className="FiltroClientes-RenovaciónTitulo">
          <span>Distribuidores</span>
        </div>
        <div className="lineagris"></div>
        <div className="w-full flex flex-col gap-2">
          <label className="font-medium text-blue_custom text-sm">
            Distribuidores
          </label>
          <div className="flex flex-col gap-3">
            {distribu?.map((zone, index) => (
              <div
                key={index}
                className="flex items-center gap-2 w-1/2 text-black"
              >
                <input
                  type="checkbox"
                  {...register(`dist.${zone._id}`)}
                  value={zone._id}
                  id={`dist-${zone._id}`}
                />
                <label
                  htmlFor={`dist-${zone._id}`}
                  className="font-medium text-sm"
                >
                  {zone.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full flex flex-col gap-2">
          <label className="font-bold">Zonas</label>
          <div className="flex flex-col gap-3">
            {data?.zones?.map((zone, index) => (
              <div
                key={index}
                className="flex items-center gap-2 w-1/2 text-blue_custom"
              >
                <input
                  type="checkbox"
                  {...register(`zones.${zone._id}`)}
                  value={zone._id}
                  id={`zone-${zone._id}`}
                />
                <label
                  htmlFor={`zone-${zone._id}`}
                  className="font-bold text-sm"
                >
                  {zone.name}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between w-full items-center gap-3 px-4">
        <button
          type="button"
          onClick={() => {
            setClientes(false);
            if (clients) onChange(clients, "quit");
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
    </form>
  );
};

export default FiltroClientes;
