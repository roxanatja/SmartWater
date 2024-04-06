// app/hooks/useZones.ts
"use server";

import smartwaterApi from "@/lib/SmartWaterApi";
import useAppStore from "@/store/appStore";
import { getZoneAndDistrictNames } from "@/lib/utils";

export const useZones = async (): Promise<Record<string, string>> => {
  try {
    const response = await smartwaterApi.get("/zones?pageSize=3000");
    const data = response.data;
    console.log(data)
    const zoneAndDistrictNames = getZoneAndDistrictNames(data.data);
    return zoneAndDistrictNames;
  } catch (error) {
    console.error(error);
    return {};
  }
};
