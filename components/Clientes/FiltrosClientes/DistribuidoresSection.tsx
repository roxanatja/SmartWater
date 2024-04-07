import { FC, useState } from "react";
import { ShaperonIcon } from "@/components/icons/Icons";
import { Truck } from "lucide-react";
import useAppStore from "@/store/appStore";
import { MapaIcon } from "@/components/icons/Icons";

export const DistribuidoresSection: FC = () => {
  const { filters, setFilters } = useAppStore();
  const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(false);

  const handleOpcionesClick = () => {
    setOpcionesVisibles(!opcionesVisibles);
  };

  const handleDealerChange = (dealer: string) => {
    const updatedDealers = filters.dealers.includes(dealer)
      ? filters.dealers.filter((d) => d !== dealer)
      : [...filters.dealers, dealer];
    setFilters({
      ...filters,
      dealers: updatedDealers,
    });
  };

  const handleZoneChange = (zone: string) => {
    const updatedZones = filters.zones.includes(zone)
      ? filters.zones.filter((z) => z !== zone)
      : [...filters.zones, zone];
    setFilters({
      ...filters,
      zones: updatedZones,
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
                    checked={filters.dealers.includes("distribuidor1")}
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
                    checked={filters.dealers.includes("distribuidor2")}
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
                    checked={filters.dealers.includes("distribuidor3")}
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
                    checked={filters.dealers.includes("distribuidor4")}
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
                    checked={filters.zones.includes("zona1")}
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
                    checked={filters.zones.includes("zona2")}
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
                    checked={filters.zones.includes("zona3")}
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
                    checked={filters.zones.includes("zona4")}
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
                    checked={filters.zones.includes("zona5")}
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