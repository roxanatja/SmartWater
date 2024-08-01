import smartwaterApi from "../api/SmartWaterApi";

export const saveOrder = async (dataToSave) => {
  try {
    const response = await smartwaterApi.post("/orders/register", dataToSave);
    return response.status;
  } catch (e) {
    console.error(
      "Error in saveOrder:",
      e.response ? e.response.data : e.message
    );
    if (e.response && e.response.status) {
      console.error("Response Status Code:", e.response.status);
    }
    if (e.response && e.response.data) {
      console.error("Response Data:", e.response.data);
    }
    return null; // Devuelve null en caso de error
  }
};

export const deleteOrders = async (id) => {
  try {
    const response = await smartwaterApi.delete(`/orders/${id}/delete`);
    return response.status;
  } catch (e) {
    console.error(e);
    return null; // Devuelve null en caso de error
  }
};

// OrdersService.js
export const loadOrders = async (params) => {
  try {
    const response = await smartwaterApi.get("/orders", { params });
    return response.data;
  } catch (e) {
    console.error(
      "Error in loadOrders:",
      e.response ? e.response.data : e.message
    );
    return [];
  }
};
