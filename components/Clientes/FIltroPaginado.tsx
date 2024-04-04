"use client";

import React, { useState, useEffect } from "react";
import ClientCard from "./ClientCard";
import { Client } from "@/type/Cliente/Client";
import { loadClients } from "@/lib/services/ClientsService";

interface FiltroPaginadoProps {}

export const FiltroPaginado: React.FC<FiltroPaginadoProps> = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredData, setFilteredData] = useState<Client[]>([]);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const data = await loadClients();
        setClients(data.data);
        setFilteredData(data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClients();
  }, []);

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
  const currentData =
    filteredData && filteredData.length > 0
      ? filteredData.slice(startIndex, endIndex)
      : [];
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);

  return (
    <div className="bg-white p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Buscar clientes"
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="bg-blue-500 text-white rounded-r-md px-4 py-2">
            Buscar
          </button>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-white text-gray-500 hover:bg-gray-100 rounded-md border border-gray-300 px-2 py-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <span className="text-gray-500">
              {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-white text-gray-500 hover:bg-gray-100 rounded-md border border-gray-300 px-2 py-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
      </div>
      <div className="grid shadow-md rounded-lg grid-cols-1 sm:grid-cols-2 gap-4">
        {currentData.map((client) => (
          <ClientCard key={client._id} client={client} />
        ))}
      </div>
      <div className="flex justify-between mt-5">
        <button className="bg-green-500 text-white rounded-md px-4 py-2">
          Exportar Excel
        </button>
        <button className="bg-blue-500 text-white rounded-md px-4 py-2">
          Añadir Cliente
        </button>
      </div>
    </div>
  );
};
