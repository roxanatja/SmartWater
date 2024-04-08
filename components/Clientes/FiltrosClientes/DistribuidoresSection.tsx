import { FC, useState } from "react";
import { ShaperonIcon } from "@/components/icons/Icons";
import { Truck } from "lucide-react";
import useAppStore from "@/store/appStore";
import { MapaIcon } from "@/components/icons/Icons";
import CustomCheckbox from "@/components/ui/CustomCheckbox";

export const DistribuidoresSection: FC = () => {
  const { filters, setFilters } = useAppStore();
  const [opcionesVisibles, setOpcionesVisibles] = useState<boolean>(false);

  const dealersMap = {
    "63d955b101f27eac0197bb16": "Edilberto Parraga",
    "63d819b2cd5b272c9f72d5c7": "Yessica Choque Portales",
    "6415a1dd62d3f913ffcab613": "Caleb Zegarra",
    "6327444c7bc295811ec18611": "Roxana Santos",
  };

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
      <div
        className="flex items-center justify-between border-b pb-2"
        onClick={handleOpcionesClick}
      >
        <h2 className="text-lg font-semibold">Distribuidores & Zonas</h2>
        <button
          className={`focus:outline-none transition-transform ${
            opcionesVisibles ? "rotate-180" : ""
          }`}
        >
          <ShaperonIcon />
        </button>
      </div>
      {opcionesVisibles && (
        <div className="space-y-4">
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Distribuidor</h3>
            <div className="space-y-4 ">
              <div className="grid grid-cols-2 mt-4 gap-4">
                {Object.entries(dealersMap).map(([dealerId, dealerName]) => (
                  <div key={dealerId} className="flex items-center">
                    <CustomCheckbox
                      checked={filters.dealers.includes(dealerId)}
                      onCheckedChange={() => handleDealerChange(dealerId)}
                      label={dealerName}
                      icon={<Truck className="text-black" />}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Zonas</h3>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <CustomCheckbox
                    checked={filters.zones.includes("zona1")}
                    onCheckedChange={() => handleZoneChange("zona1")}
                    label="Zona 1"
                    icon={<MapaIcon />}
                  />
                </div>
                <div className="flex items-center">
                  <CustomCheckbox
                    checked={filters.zones.includes("zona2")}
                    onCheckedChange={() => handleZoneChange("zona2")}
                    label="Zona 2"
                    icon={<MapaIcon />}
                  />
                </div>
                <div className="flex items-center">
                  <CustomCheckbox
                    checked={filters.zones.includes("zona3")}
                    onCheckedChange={() => handleZoneChange("zona3")}
                    label="Zona 3"
                    icon={<MapaIcon />}
                  />
                </div>
                <div className="flex items-center">
                  <CustomCheckbox
                    checked={filters.zones.includes("zona4")}
                    onCheckedChange={() => handleZoneChange("zona4")}
                    label="Zona 4"
                    icon={<MapaIcon />}
                  />
                </div>
                <div className="flex items-center">
                  <CustomCheckbox
                    checked={filters.zones.includes("zona5")}
                    onCheckedChange={() => handleZoneChange("zona5")}
                    label="Zona 5"
                    icon={<MapaIcon />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
