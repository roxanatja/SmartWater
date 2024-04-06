// ClientesPaginados.tsx
"use client"
import React, { useState } from "react";
import { Download, Plus, ChevronDown } from "lucide-react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import ClientCard from "./ClientCard";
import useAppStore from "@/store/appStore";

interface ClientesPaginadosProps {
  zoneAndDistrictNames: Record<string, string>;
}

export const ClientesPaginados: React.FC<ClientesPaginadosProps> = ({
  zoneAndDistrictNames,
}) => {
  const filteredClients = useAppStore((state) => state.filteredClients);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const itemsPerPage = 8;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData =
    filteredClients && filteredClients.length > 0
      ? filteredClients.slice(startIndex, endIndex)
      : [];
  const totalPages = Math.ceil((filteredClients?.length || 0) / itemsPerPage);

  const handleSortOrderChange = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sorted = [...filteredClients].sort((a, b) => {
      if (newSortOrder === "asc") {
        return new Date(a.created).getTime() - new Date(b.created).getTime();
      } else {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      }
    });

    // No es necesario actualizar el estado de filteredClients aquí
    // ya que se obtiene directamente del store de Zustand
  };

  const exportToExcel = () => {
    // TODO: Darle formato a los datos y dejar los importantes
    const worksheet = XLSX.utils.json_to_sheet(filteredClients);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "clientes.xlsx");
  };

  return (
    <div className="m-5">
      <div className="flex justify-between items-center mb-4 w-full">
        <div className="flex-1">
          <span>Resultados: {filteredClients.length}</span>
        </div>
        <div className="flex-1 flex justify-center items-center">
          <span>Ordenar por:</span>
          <button
            onClick={handleSortOrderChange}
            className="flex items-center ml-2 text-blue-500"
          >
            {sortOrder === "asc" ? "Más reciente" : "Menos reciente"}
            <ChevronDown size={20} className="ml-1" />
          </button>
        </div>
        <div className="flex-1 flex justify-end items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-800 text-gray-500 hover:bg-blue-400 rounded-md border border-gray-300 px-2 py-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <span className="text-black">
            {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-blue-800 text-gray-500 hover:bg-blue-400 rounded-md border border-gray-300 px-2 py-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid shadow-md rounded-lg grid-cols-1 sm:grid-cols-2 gap-4">
        {currentData.map((client) => (
          <ClientCard
            key={client._id}
            client={client}
            zoneAndDistrictNames={zoneAndDistrictNames}
          />
        ))}
      </div>
      <div className="flex justify-between mt-5 mx-5">
        <button
          onClick={exportToExcel}
          className="bg-blue-800 text-white rounded-full p-4 w-24 h-24 flex flex-col items-center justify-center"
        >
          <Download />
          Exportar
        </button>
        <button className="bg-blue-800 text-white rounded-full p-4 w-24 h-24 flex flex-col items-center justify-center">
          <Plus />
        </button>
      </div>
    </div>
  );
};
