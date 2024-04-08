// SearchAndFilterHOC.tsx
"use client";
import React, { useEffect } from "react";
import { OpenIcon } from "../icons/Icons";
import { Search } from "lucide-react";
import { FiltrosClientes } from "./FiltrosClientes";
import useAppStore from "@/store/appStore";
import { Client } from "@/type/Cliente/Client";

interface SearchAndFilterHOCProps {
  children: React.ReactNode;
  clients: Client[];
}

export const SearchAndFilterHOC: React.FC<SearchAndFilterHOCProps> = ({
  children,
  clients,
}) => {
  const { filters, setFilters, showFiltro, setShowFiltro, setFilteredClients } =
    useAppStore();

  const handleOpenFiltros = () => {
    setShowFiltro(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilters({ ...filters, searchTerm: value });
  };

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
        client.fullName
          ?.toLowerCase()
          .includes(filters.searchTerm.toLowerCase())
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
    if (filters.hasExpiredContracts) {
      filtered = filtered.filter((client) => client.hasExpiredContract);
    }
    if (filters.zones.length > 0) {
      filtered = filtered.filter((client) =>
        filters.zones.some((zone) => client.zone === zoneMap[zone])
      );
    }
    if (filters.dealers.length > 0) {
      filtered = filtered.filter((client) =>
        filters.dealers.includes(client.user)
      );
    }

    setFilteredClients(filtered);
  }, [clients, filters, setFilteredClients]);

  const appliedFiltersCount = Object.values(filters).reduce(
    (count: number, value) => {
      if (Array.isArray(value) && value.length > 0) {
        return count + 1;
      } else if (value && !Array.isArray(value)) {
        return count + 1;
      }
      return count;
    },
    0
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4 m-5">
        <div className="flex items-center w-3/4 border border-gray-400 rounded-md px-4 ml-5 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <input
            type="text"
            placeholder="Buscar"
            value={filters.searchTerm}
            onChange={handleSearch}
            className="w-full focus:outline-none"
          />
          <button className="text-black rounded-r-md px-4 py-2">
            <Search size={20} />
          </button>
        </div>
        <button
          className="flex mx-auto content-baseline items-center"
          onClick={handleOpenFiltros}
        >
          <p className="mx-2">Filtrar</p>
          <OpenIcon className="mx-2" />
          {appliedFiltersCount > 0 && (
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex justify-center items-center text-xs">
              {appliedFiltersCount}
            </span>
          )}
        </button>
        {showFiltro && <FiltrosClientes />}
      </div>
      {children}
    </div>
  );
};
