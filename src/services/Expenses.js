import smartwaterApi from "../api/SmartWaterApi";

export const GetExpenses = async () => {
  try {
    const { data } = await smartwaterApi.get("/expenses?pageSize=3000");
    return data;
  } catch (e) {
    console.error(e);
  }
};
