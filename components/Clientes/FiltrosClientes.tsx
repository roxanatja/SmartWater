import { useEffect, useState } from "react";
import { RenovacionSection } from "./FiltrosClientes/RenovacionSection";
import { PrestamoSection } from "./FiltrosClientes/PrestamoSection";
import { DistribuidoresSection } from "./FiltrosClientes/DistribuidoresSection";
import useAppStore from "@/store/appStore";
import { X } from "lucide-react";

export const FiltrosClientes = () => {
  const { filters, setFilters, showFiltro, setShowFiltro } = useAppStore();
  const [selectedFilters, setSelectedFilters] = useState(filters);

  useEffect(() => {
    const handleCloseOnEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowFiltro(false);
      }
    };

    window.addEventListener("keydown", handleCloseOnEsc);

    return () => {
      window.removeEventListener("keydown", handleCloseOnEsc);
    };
  }, [setShowFiltro]);

  useEffect(() => {
    setSelectedFilters(filters);
  }, [filters]);

  const handleCloseModal = () => {
    setSelectedFilters(filters);
    setShowFiltro(false);
  };

  const saveFilters = () => {
    setFilters(selectedFilters);
    setShowFiltro(false);
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: "",
      fromDate: "",
      toDate: "",
      withLoans: false,
      withoutLoans: false,
      withCredit: false,
      withoutCredit: false,
      dealers: [],
      zones: [],
      applicatedFilters: false,
      renewInDays: 0,
      renewFromDays: 0,
      renewFromDate: "",
      renewToDate: "",
      hasExpiredContracts: false,
    });
  };

  if (!showFiltro) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={handleCloseModal}
      ></div>
      <div className="bg-white rounded-xl p-6 z-10 w-11/12 md:w-2/3 lg:w-1/3 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-blue-800">Filtros</h2>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
            onClick={handleCloseModal}
          >
            <span className="sr-only">Cerrar</span>
            <X />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto max-h-[60vh] space-y-8 p-4">
          <RenovacionSection />
          <PrestamoSection />
          <DistribuidoresSection />
        </div>
        <div className="flex justify-around space-x-4 mt-8">
          <button
            type="button"
            className="shadow-md border text-blue-600 font-semibold border-blue-500 px-14 py-2 rounded-full"
            onClick={resetFilters}
          >
            Quitar filtros
          </button>
          <button
            type="button"
            className="shadow-md bg-blue-500 font-semibold text-white px-14 py-2 rounded-full"
            onClick={saveFilters}
          >
            Aplicar filtros
          </button>
        </div>
      </div>
    </div>
  );
};
