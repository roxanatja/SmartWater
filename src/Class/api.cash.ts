import toast from "react-hot-toast";
import { CashOpen, CashClose, Transaction } from "../type/Cash";
import GetApiMethod from "./api.class";

class ApiMethodCash extends GetApiMethod {
  public async openCash(data: CashOpen) {
    try {
      const resp = await this.axiosInstance.post("/cashRegisters/create", data);
      return resp;
    } catch (e: any) {
      console.error("Error in openCash:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al salvar el openCash: ${e}`);
    }
  }

  public async closeCash(data: CashClose) {
    try {
      const resp = await this.axiosInstance.post(
        "/cashRegisters/close-report",
        data
      );
      return resp;
    } catch (e: any) {
      console.error("Error in closeCash:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al salvar el closeCash: ${e}`);
    }
  }

  public async getCashRegister(params?: {
    open?: boolean;
    user?: string;
    year?: string;
    month?: string;
    hour?: string;
  }): Promise<Transaction[]> {
    try {
      const response: any = await this.axiosInstance.get(
        "/cashRegisters?pageSize=20",
        {
          params,
        }
      );
      return response.data;
    } catch (e: any) {
      console.error("Error in getCashRegister:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al obtener getCashRegister: ${e}`);
    }
  }
}

export default ApiMethodCash;
