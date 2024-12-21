import toast from "react-hot-toast";
import {
  InvoceExpense,
  InvoceExpenseBody,
} from "../type/InvoceExpense";
import GetApiMethod from "./api.class";

class ApiMethodInvoceExpense extends GetApiMethod {
  public async saveInvoce(dataToSave: InvoceExpenseBody) {
    try {
      const response = await this.axiosInstance.post(
        "/invoice-expenses/register",
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

  public async loadInvoce(params?: InvoceExpense): Promise<InvoceExpense[]> {
    try {
      const response = await this.axiosInstance.get("/invoice-expenses", {
        params,
      });
      return response.data;
    } catch (e: any) {
      console.error("Error in saveOrder:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al borrar la Orden: ${e}`);
    }
  }

  public async saveExpense(dataToSave: any) {
    try {
      const response = await this.axiosInstance.post(
        "/expenses/create",
        dataToSave
      );
      return response.status;
    } catch (e: any) {
      console.error("Error in saveExpense:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al salvar la saveExpense: ${e}`);
    }
  }

  public async loadExpense(params?: any): Promise<any[]> {
    try {
      const response = await this.axiosInstance.get("/expenses", {
        params,
      });
      return response.data.data;
    } catch (e: any) {
      console.error("Error in loadExpense:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al borrar la loadExpense: ${e}`);
    }
  }
}

export default ApiMethodInvoceExpense;
