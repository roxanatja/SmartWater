import { FC, useState, useEffect } from "react";
import { AppState } from "@/store/appStore";
import { EnviosIcon, MapaIcon, ShaperonIcon } from "@/components/icons/Icons";
import { Truck } from "lucide-react";

export const DistribuidoresSection: FC<{
  selectedFilters: AppState["filters"];
  setSelectedFilters: (filters: AppState["filters"]) => void;
}> = ({ selectedFilters, setSelectedFilters }) => {
  const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(false);
  const [selectedDealers, setSelectedDealers] = useState<string[]>(selectedFilters.dealers);
  const [selectedZones, setSelectedZones] = useState<string[]>(selectedFilters.zone);

  useEffect(() => {
    setSelectedDealers(selectedFilters.dealers);
    setSelectedZones(selectedFilters.zone);
  }, [selectedFilters]);

  const handleOpcionesClick = () => {
    setOpcionesVisibles(!opcionesVisibles);
  };

  const handleDealerChange = (dealer: string) => {
    const updatedDealers = selectedDealers.includes(dealer)
      ? selectedDealers.filter((d) => d !== dealer)
      : [...selectedDealers, dealer];
    setSelectedDealers(updatedDealers);
    updateSelectedFilters(updatedDealers, selectedZones);
  };

  const handleZoneChange = (zone: string) => {
    const updatedZones = selectedZones.includes(zone)
      ? selectedZones.filter((z) => z !== zone)
      : [...selectedZones, zone];
    setSelectedZones(updatedZones);
    updateSelectedFilters(selectedDealers, updatedZones);
  };

  const updateSelectedFilters = (dealers: string[], zones: string[]) => {
    setSelectedFilters({
      ...selectedFilters,
      dealers,
      zone: zones,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b pb-2"           onClick={handleOpcionesClick}
>
        <h2 className="text-lg font-semibold">Distribuidores & Zonas</h2>
        <button
          className={`focus:outline-none transition-transform ${
            opcionesVisibles ? "rotate-180" : ""
          }`}
        >
        <ShaperonIcon/>
        </button>
      </div>
      {opcionesVisibles && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Distribuidor</h3>
            <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4"> 
              <div className="flex items-center">
                <div className="flex justify-center items-center w-14 h-14">
                  <Truck className="text-black" />
                </div>
                <label className="ml-3">
                  <input
                    type="checkbox"
                    checked={selectedDealers.includes("distribuidor1")}
                    onChange={() => handleDealerChange("distribuidor1")}
                    className="mr-3"
                  />
                  Distribuidor 1
                </label>
              </div>
              <div className="flex items-center">
                <div className="flex justify-center items-center w-14 h-14">
                  <Truck className="text-black" />
                </div>
                <label className="ml-3">
                  <input
                    type="checkbox"
                    checked={selectedDealers.includes("distribuidor2")}
                    onChange={() => handleDealerChange("distribuidor2")}
                    className="mr-3"
                  />
                  Distribuidor 2
                </label>
              </div>
              <div className="flex items-center">
                <div className="flex justify-center items-center w-14 h-14">
                  <Truck className="text-black" />
                </div>
                <label className="ml-3">
                  <input
                    type="checkbox"
                    checked={selectedDealers.includes("distribuidor3")}
                    onChange={() => handleDealerChange("distribuidor3")}
                    className="mr-3"
                  />
                  Distribuidor 3
                </label>
              </div>
              <div className="flex items-center">
                <div className="flex justify-center items-center w-14 h-14">
                  <Truck className="text-black" />
                </div>
                <label className="ml-3">
                  <input
                    type="checkbox"
                    checked={selectedDealers.includes("distribuidor4")}
                    onChange={() => handleDealerChange("distribuidor4")}
                    className="mr-3"
                  />
                  Distribuidor 4
                </label>
              </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Zonas</h3>
            <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4"> 
              <div className="flex items-center">
                <div className="flex justify-center items-center w-14 h-14">
                  <MapaIcon />
                </div>
                <label className="ml-3">
                  <input
                    type="checkbox"
                    checked={selectedZones.includes("zona1")}
                    onChange={() => handleZoneChange("zona1")}
                    className="mr-3"
                  />
                  Zona 1
                </label>
              </div>
              <div className="flex items-center">
                <div className="flex justify-center items-center w-14 h-14">
                  <MapaIcon />
                </div>
                <label className="ml-3">
                  <input
                    type="checkbox"
                    checked={selectedZones.includes("zona2")}
                    onChange={() => handleZoneChange("zona2")}
                    className="mr-3"
                  />
                  Zona 2
                </label>
              </div>
              <div className="flex items-center">
                <div className="flex justify-center items-center w-14 h-14">
                  <MapaIcon />
                </div>
                <label className="ml-3">
                  <input
                    type="checkbox"
                    checked={selectedZones.includes("zona3")}
                    onChange={() => handleZoneChange("zona3")}
                    className="mr-3"
                  />
                  Zona 3
                </label>
              </div>
              <div className="flex items-center">
                <div className="flex justify-center items-center w-14 h-14">
                  <MapaIcon />
                </div>
                <label className="ml-3">
                  <input
                    type="checkbox"
                    checked={selectedZones.includes("zona4")}
                    onChange={() => handleZoneChange("zona4")}
                    className="mr-3"
                  />
                  Zona 4
                </label>
              </div>
              <div className="flex items-center">
                <div className="flex justify-center items-center w-14 h-14">
                  <MapaIcon />
                </div>
                <label className="ml-3">
                  <input
                    type="checkbox"
                    checked={selectedZones.includes("zona5")}
                    onChange={() => handleZoneChange("zona5")}
                    className="mr-3"
                  />
                  Zona 5
                </label>
              </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};