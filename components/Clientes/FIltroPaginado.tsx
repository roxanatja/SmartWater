"use client";
import React, { useState, useEffect } from "react";
import ClientCard from "./ClientCard";
import { ClientResponse, Client } from "@/type/Cliente/Client";
import { OpenIcon } from "../icons/Icons";
import { Download, Plus, Search, ChevronDown } from "lucide-react";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

interface FiltroPaginadoProps {
  zoneAndDistrictNames: Record<string, string>;
  clients: Client[];
}

export const FiltroPaginado: React.FC<FiltroPaginadoProps> = ({
  zoneAndDistrictNames,
  clients,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState<Client[]>(clients);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const itemsPerPage = 8;

  useEffect(() => {
    console.log("Actualizando filteredData con nuevos clientes:", clients);
    setFilteredData(clients);
  }, [clients]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    const filtered = clients.filter((client) =>
      client.fullName?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  console.log("Index", endIndex, startIndex);
  const currentData =
    filteredData && filteredData.length > 0
      ? filteredData.slice(startIndex, endIndex)
      : [];
  console.log("Clientes en la página actual:", currentData);
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
    const worksheet = XLSX.utils.json_to_sheet(currentData);
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
    <div className="bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center w-2/3 border border-gray-400 rounded-md px-4 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <input
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={handleSearch}
            className="w-full focus:outline-none"
          />
          <button className=" text-black rounded-r-md px-4 py-2">
            <Search size={20} />
          </button>
        </div>
        <div className="flex content-baseline items-baseline ml-4">
          <p className="mx-2">Filtrar</p>
          <OpenIcon className="mx-2" />
        </div>
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
