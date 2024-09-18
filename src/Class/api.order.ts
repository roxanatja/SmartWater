import { OrdenBody, Order } from "../type/Order/Order";
import GetApiMethod from "./api.class";

class ApiMethodOrder extends GetApiMethod {
  public async saveOrder(dataToSave: OrdenBody) {
    try {
      const response = await this.axiosInstance.post(
        "/orders/register",
        dataToSave
      );
      return response.status;
    } catch (e) {
      console.error("Error in saveOrder:", e);
      throw new Error(`Error al obtener salvar la Orden: ${e}`);
    }
  }

  public async deleteOrders(id: string) {
    try {
      const response = await this.axiosInstance.delete(`/orders/${id}/delete`);
      return response.status;
    } catch (e) {
      console.error("Error in saveOrder:", e);
      throw new Error(`Error al borrar la Orden: ${e}`);
    }
  }

  public async loadOrders(params: Order): Promise<Order> {
    try {
      const response = await this.axiosInstance.get("/orders", { params });
      return response.data;
    } catch (e) {
      console.error("Error in saveOrder:", e);
      throw new Error(`Error al borrar la Orden: ${e}`);
    }
  }
}

export default ApiMethodOrder;
