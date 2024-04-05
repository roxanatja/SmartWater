// store/appStore.ts
import create from "zustand";
import { Client } from "../type/Cliente/Client";


interface AppState {
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
  showFiltro: boolean;
  setShowFiltro: (show: boolean) => void;

  // Estado relacionado con los filtros
  applicatedFilters: string[];
  notApplicatedFilters: string[];
  fromDate: string;
  toDate: string;
  withLoans: boolean;
  withoutLoans: boolean;
  withCredit: boolean;
  withoutCredit: boolean;
  dealers: string[];
  zone: string;
  setFilters: (filters: Partial<AppState>) => void;

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
    // Lógica para agregar un nuevo cliente al estado
    set((state) => ({ clients: [...state.clients, client] }));
  },
  updateClient: (client: Client) => {
    // Lógica para actualizar un cliente existente en el estado
    set((state) => ({
      clients: state.clients.map((c) => (c._id === client._id ? client : c)),
    }));
  },
  deleteClient: (clientId: string) => {
    // Lógica para eliminar un cliente del estado
    set((state) => ({
      clients: state.clients.filter((c) => c._id !== clientId),
    }));
  },

  // Estado inicial y acciones relacionadas con la interfaz de usuario
  showModal: false,
  setShowModal: (show: boolean) => set({ showModal: show }),
  showFiltro: false,
  setShowFiltro: (show: boolean) => set({ showFiltro: show }),

  // Estado inicial y acciones relacionadas con los filtros
  applicatedFilters: [],
  notApplicatedFilters: [],
  fromDate: "",
  toDate: "",
  withLoans: false,
  withoutLoans: false,
  withCredit: false,
  withoutCredit: false,
  dealers: [],
  zone: "",
  setFilters: (filters: Partial<AppState>) => set(filters),

  // Asignar zonas
  zones: [],
  setZones: (zones) => set({ zones }),
  zoneAndDistrictNames: {},
  setZoneAndDistrictNames: (zoneAndDistrictNames) =>
    set({ zoneAndDistrictNames }),
 // Estado inicial y acciones relacionadas con la carga de la API de Google Maps
 isGoogleMapsApiLoaded: false,
 setIsGoogleMapsApiLoaded: (isLoaded: boolean) => set({ isGoogleMapsApiLoaded: isLoaded }),
 googleMapsApiKey: "",
 setGoogleMapsApiKey: (apiKey: string) => set({ googleMapsApiKey: apiKey }),
}));


export default useAppStore;
