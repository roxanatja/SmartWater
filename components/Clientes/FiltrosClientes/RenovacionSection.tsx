import { FC, useState } from "react";
import Contador from "@/components/ui/Contador";
import { ShaperonIcon, DesdeIcon, HastaIcon } from "@/components/icons/Icons";
import useAppStore from "@/store/appStore";

export const RenovacionSection: FC = () => {
  const { filters, setFilters } = useAppStore();
  const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(true);

  const handleOpcionesClick = () => {
    setOpcionesVisibles(!opcionesVisibles);
  };

  const handleRenewInDaysChange = (value: number) => {
    setFilters({ ...filters, renewInDays: value });
  };

  const handleFromDateChange = (date: string) => {
    setFilters({ ...filters, renewFromDate: date });
  };

  const handleToDateChange = (date: string) => {
    setFilters({ ...filters, renewToDate: date });
  };

  return (
    <div className="space-y-4">
      <div
        className="flex items-center justify-between border-b pb-2 "
        onClick={handleOpcionesClick}
      >
        <h2 className="text-lg font-semibold ">Renovación</h2>
        <button
          className={`focus:outline-none transition-transform ${
            opcionesVisibles ? "rotate-180" : ""
          }`}
        >
          <ShaperonIcon />
        </button>
      </div>

      {opcionesVisibles && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Renovado hasta en</span>
            <Contador
              count={filters.renewInDays}
              setCount={handleRenewInDaysChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <span>Renovado hace mas de</span>
            <Contador
              count={filters.renewInDays}
              setCount={handleRenewInDaysChange}
            />
          </div>

          <div className="text-sm text-blue-500">Fechas</div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="renewFromDate" className="text-sm block mb-1">
                De
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DesdeIcon />
                </div>
                <input
                  type="date"
                  id="renewFromDate"
                  className="bg-white border border-gray-300 rounded-md shadow-sm pl-10 pr-4 py-2 block w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters.renewFromDate}
                  onChange={(e) => handleFromDateChange(e.target.value)}
                />
              </div>
            </div>

            <div className="w-1/2">
              <label htmlFor="renewToDate" className="text-sm block mb-1">
                A
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HastaIcon />
                </div>
                <input
                  type="date"
                  id="renewToDate"
                  className="bg-white border border-gray-300 rounded-md shadow-sm pl-10 pr-4 py-2 block w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters.renewToDate}
                  onChange={(e) => handleToDateChange(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
