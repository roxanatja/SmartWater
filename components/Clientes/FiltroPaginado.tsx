"use client";
import React, { useState, useEffect } from "react";
import ClientCard from "./ClientCard";
import { ClientResponse, Client } from "@/type/Cliente/Client";
import { OpenIcon } from "../icons/Icons";
import { FiltrosClientes } from "./FiltrosClientes";
import { Download, Plus, Search, ChevronDown } from "lucide-react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import useAppStore from "@/store/appStore";

interface FiltroPaginadoProps {
  zoneAndDistrictNames: Record<string, string>;
  clients: Client[];
}

export const FiltroPaginado: React.FC<FiltroPaginadoProps> = ({
  zoneAndDistrictNames,
  clients,
}) => {
  const { filters, setFilters, showFiltro, setShowFiltro } = useAppStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState<Client[]>(clients);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const itemsPerPage = 8;

  const handleOpenFiltros = () => {
    setShowFiltro(true);
  };

  useEffect(() => {
    const filtered = clients.filter((client) =>
      client.fullName?.toLowerCase().includes(filters.searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [clients, filters.searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters({ ...filters, searchTerm: value });
  };
//useEffect para filtrar
  useEffect(() => {
    let filtered = clients;

    const zoneMap: Record<string, string> = {
      zona1: "63057bf2e40e0517cf200abc",
      zona2: "6312ae1d62243d2e5daa759d",
      zona3: "63d9548401f27eac0197bb14",
      zona4: "63e6eed01208c7606d9555b6",
      zona5: "65a6f028bf28adc143424acd",
    };
  
    if (filters.searchTerm) {
      filtered = filtered.filter((client) =>
        client.fullName?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }
  
    if (filters.renewInDays > 0) {
      filtered = filtered.filter(
        (client) => client.renewInDays <= filters.renewInDays
      );
    }
  
    if (filters.renewFromDate) {
      const fromDate = new Date(filters.renewFromDate);
      filtered = filtered.filter(
        (client) => new Date(client.renewDate) >= fromDate
      );
    }
  
    if (filters.renewToDate) {
      const toDate = new Date(filters.renewToDate);
      filtered = filtered.filter(
        (client) => new Date(client.renewDate) <= toDate
      );
    }
  
    if (filters.withLoans) {
      filtered = filtered.filter((client) => client.hasLoan);
    }
  
    if (filters.withoutLoans) {
      filtered = filtered.filter((client) => !client.hasLoan);
    }
  
    if (filters.withCredit) {
      filtered = filtered.filter((client) => client.hasLoan);
    }
  
    if (filters.withoutCredit) {
      filtered = filtered.filter((client) => !client.hasLoan);
    }
  //falta para ver si son distribuidores no esta claro en la DB
    // if (filters.dealers.length > 0) {
    //   filtered = filtered.filter((client) =>
    //     filters.dealers.includes(client.dealer)
    //   );
    // }
  
    if (filters.zone.length > 0) {
      filtered = filtered.filter((client) =>
        filters.zone.some((zone) => client.zone === zoneMap[zone])
      );
    }
    
    setFilteredData(filtered);
    setCurrentPage(1);
  }, [clients, filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData =
    filteredData && filteredData.length > 0
      ? filteredData.slice(startIndex, endIndex)
      : [];
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);

  const handleSortOrderChange = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    const sorted = [...filteredData].sort((a, b) => {
      if (newSortOrder === "asc") {
        return new Date(a.created).getTime() - new Date(b.created).getTime();
      } else {
        return new Date(b.created).getTime() - new Date(a.created).getTime();
      }
    });

    setFilteredData(sorted);
  };

  const exportToExcel = () => {
    //TODO Darle formato a los datos y dejar los importantes
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
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

  //count de filtros
  const appliedFiltersCount = Object.values(filters).reduce((count: number, value) => {
    if (Array.isArray(value) && value.length > 0) {
      return count + 1;
    }
    else if (value && !Array.isArray(value)) {
      return count + 1;
    }
    return count;
  }, 0); 
  

  return (
    <div className="bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center w-2/3 border border-gray-400 rounded-md px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <input
            type="text"
            placeholder="Buscar"
            value={filters.searchTerm}
            onChange={handleSearch}
            className="w-full focus:outline-none"
          />
          <button className=" text-black rounded-r-md px-4 py-2">
            <Search size={20} />
          </button>
        </div>
        <button
          className="flex content-baseline items-baseline ml-4"
          onClick={handleOpenFiltros}
        >
          <p className="mx-2">Filtrar</p>
          <OpenIcon className="mx-2" />
          {appliedFiltersCount > 0 && (
            <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
              {appliedFiltersCount}
            </span>
          )}
        </button>
        {showFiltro && <FiltrosClientes />}
        <div className="flex items-center space-x-2">
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
      <div className="flex justify-between items-center mb-4 w-full">
        <div className="flex-1">
          <span>Resultados: {filteredData.length}</span>
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
        <div className="flex-1"></div>
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
