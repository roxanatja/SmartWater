import toast from "react-hot-toast";
import { InvoceExpenseBody } from "../type/InvoceExpense";
import GetApiMethod from "./api.class";

class ApiMethodInvoceExpense extends GetApiMethod {
  public async saveInvoce(dataToSave: InvoceExpenseBody) {
    try {
      const response = await this.axiosInstance.post(
        "/orders/register",
        dataToSave
      );
      return response.status;
    } catch (e: any) {
      console.error("Error in saveInvoce:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al salvar la Gasto: ${e}`);
    }
  }

  public async loadOrders(
    params: InvoceExpenseBody
  ): Promise<InvoceExpenseBody> {
    try {
      const response = await this.axiosInstance.get("/orders", { params });
      return response.data;
    } catch (e: any) {
      console.error("Error in saveOrder:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al borrar la Orden: ${e}`);
    }
  }
}

export default ApiMethodInvoceExpense;
