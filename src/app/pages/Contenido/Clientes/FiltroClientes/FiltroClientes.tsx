import { useContext, useEffect, useState, useCallback } from "react";
import { ClientesContext } from "../ClientesContext";
import { Contador } from "../../../components/Contador/Contador";
import { useForm } from "react-hook-form";
import { Zone } from "../../../../../Class/types.data";
import GetApiMethod from "../../../../../Class/api.class";
import { Client } from "../../../../../type/Cliente/Client";

const FiltroClientes = ({
  clients,
  onChange,
}: {
  clients: Client[];
  onChange: (value: Client[]) => void;
}) => {
  const { setShowFiltro } = useContext(ClientesContext);
  const [data, setData] = useState<{ zones: Zone[] }>();
  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = (data: any) => {
    setShowFiltro(false);
    const filtered = filterClients(clients, data);
    onChange(filtered);
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

      // Check zones
      if (filters.zones && filters.zones !== client.zone) return false;

      // Additional date range checks if needed
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

  const getData = useCallback(async () => {
    const api = new GetApiMethod();
    return setData({
      zones: await api.getZone(),
    });
  }, []);

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
          <span>Préstamo / Cuentas por cobrar</span>
        </div>
        <div className="lineagris"></div>
        <div className="FiltroClientes-Cuentas grid grid-cols-2">
          <div className="FiltroClientes-CuentasOptionInput">
            <input
              className="input-check"
              type="checkbox"
              {...register("withLoans")}
            />
            <img src="/presta.svg" alt="/presta.svg" />
            <span className="text-blue_custom font-semibold">Con préstamo</span>
          </div>
          <div className="FiltroClientes-CuentasOptionInput">
            <input
              className="input-check"
              type="checkbox"
              {...register("withoutLoans")}
            />
            <img src="/nopresta.svg" alt="/nopresta.svg" />
            <span className="text-blue_custom font-semibold">Sin préstamo</span>
          </div>
          <div className="FiltroClientes-CuentasOptionInput">
            <input
              className="input-check"
              type="checkbox"
              {...register("withCredit")}
            />
            <img src="/saldo.svg" alt="/saldo.svg" />
            <span className="text-blue_custom font-semibold">Con crédito</span>
          </div>
          <div className="FiltroClientes-CuentasOptionInput">
            <input
              className="input-check"
              type="checkbox"
              {...register("withoutCredit")}
            />
            <img src="/nopresta.svg" alt="/nopresta.svg" />
            <span className="text-blue_custom font-semibold">Sin crédito</span>
          </div>
        </div>
        <div className="w-full flex justify-between items-center gap-2">
          <label htmlFor="zones">Zonas</label>
          <select
            {...register("zones")}
            className="border border-black rounded p-2 w-full text-right"
          >
            {data?.zones?.map((zone, index) => (
              <option value={zone._id} key={index}>
                {zone.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-between w-full items-center">
        <button
          type="button"
          onClick={() => {
            setShowFiltro(false);
            onChange(clients);
          }}
          className="mt-4 border-blue-500 border-2 rounded-full px-4 py-2 text-blue_custom font-bold"
        >
          Quitar Filtros
        </button>
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white rounded-full px-4 py-2"
        >
          Aplicar Filtros
        </button>
      </div>
    </form>
  );
};

export default FiltroClientes;
