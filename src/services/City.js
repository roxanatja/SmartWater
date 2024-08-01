import smartwaterApi from "../api/SmartWaterApi";

export const citySave = async (city) => {
  try {
    // Realizar la solicitud GET para obtener el cityId
    const response = await smartwaterApi.get(`/city/${city}`);

    // Extraer el cityId de la respuesta
    const cityId = response.data.cityId;

    // Retornar el cityId obtenido
    return cityId;
  } catch (error) {
    console.error("Error fetching cityId:", error);
    return null; // Retornar null en caso de error
  }
};
