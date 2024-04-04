import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import useAppStore from "@/store/appStore";

export const getZoneAndDistrictNames = (
  zones: any[]
): Record<string, string> => {
  const zoneAndDistrictNames: Record<string, string> = {};

  zones.forEach((zone) => {
    zone.districts.forEach((district: any) => {
      const districtId = district._id;
      const zoneName = zone.name;
      const districtName = district.name;
      const zoneAndDistrictNameValue = `${zoneName} - ${districtName}`;
      zoneAndDistrictNames[districtId] = zoneAndDistrictNameValue;
    });
  });

  console.log("zoneAndDistrictNames:", zoneAndDistrictNames);
  return zoneAndDistrictNames;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
