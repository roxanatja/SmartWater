// store/appStore.ts

import create from "zustand";
import { Client } from "../type/Cliente/Client";

export interface AppState {
  // Estado relacionado con los clientes
  clients: Client[];
  loadingClients: boolean;
  errorClients: boolean;
  fetchClients: (clients: Client[]) => void;
  addClient: (client: Client) => void;
  updateClient: (client: Client) => void;
  deleteClient: (clientId: string) => void;

  // Estado relacionado con la interfaz de usuario
  showModal: boolean;
  setShowModal: (show: boolean) => void;

  // Estado relacionado con los filtros
  showFiltro: boolean;
  setShowFiltro: (show: boolean) => void;
  filters: {
    searchTerm: string;
    fromDate: string;
    toDate: string;
    withLoans: boolean;
    withoutLoans: boolean;
    withCredit: boolean;
    withoutCredit: boolean;
    dealers: string[];
    zones: string[];
    applicatedFilters: boolean;
    renewInDays: number;
    renewFromDate: string;
    renewToDate: string;
    hasExpiredContracts: boolean;
  };
  setFilters: (filters: Partial<AppState["filters"]>) => void;
  filteredClients: Client[];
  setFilteredClients: (clients: Client[]) => void;

  // Estado relacionado con las zonas
  zones: any[];
  setZones: (zones: any[]) => void;
  zoneAndDistrictNames: Record<string, string>;
  setZoneAndDistrictNames: (
    zoneAndDistrictNames: Record<string, string>
  ) => void;

  // Estado y acciones relacionadas con la carga de la API de Google Maps
  isGoogleMapsApiLoaded: boolean;
  setIsGoogleMapsApiLoaded: (isLoaded: boolean) => void;
  googleMapsApiKey: string;
  setGoogleMapsApiKey: (apiKey: string) => void;
}

const useAppStore = create<AppState>((set) => ({
  // Estado inicial y acciones relacionadas con los clientes
  clients: [],
  loadingClients: true,
  errorClients: false,
  fetchClients: (clients: Client[]) => {
    set({ clients, loadingClients: false, errorClients: false });
  },
  addClient: (client: Client) => {
    set((state) => ({ clients: [...state.clients, client] }));
  },
  updateClient: (client: Client) => {
    set((state) => ({
      clients: state.clients.map((c) => (c._id === client._id ? client : c)),
    }));
  },
  deleteClient: (clientId: string) => {
    set((state) => ({
      clients: state.clients.filter((c) => c._id !== clientId),
    }));
  },

  // Estado inicial y acciones relacionadas con la interfaz de usuario
  showModal: false,
  setShowModal: (show: boolean) => set({ showModal: show }),

  // Estado inicial y acciones relacionadas con los filtros
  showFiltro: false,
  setShowFiltro: (show: boolean) => set({ showFiltro: show }),
  filters: {
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
    renewFromDate: "",
    renewToDate: "",
    hasExpiredContracts: false,
  },
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  filteredClients: [],
  setFilteredClients: (clients) => set({ filteredClients: clients }),

  // Asignar zonas
  zones: [],
  setZones: (zones) => set({ zones }),
  zoneAndDistrictNames: {},
  setZoneAndDistrictNames: (zoneAndDistrictNames) =>
    set({ zoneAndDistrictNames }),

  // Estado inicial y acciones relacionadas con la carga de la API de Google Maps
  isGoogleMapsApiLoaded: false,
  setIsGoogleMapsApiLoaded: (isLoaded: boolean) =>
    set({ isGoogleMapsApiLoaded: isLoaded }),
  googleMapsApiKey: "",
  setGoogleMapsApiKey: (apiKey: string) => set({ googleMapsApiKey: apiKey }),
}));

export default useAppStore;
