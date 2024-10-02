import toast from "react-hot-toast";
import { BillBody, Bills } from "../type/Bills";
import GetApiMethod from "./api.class";

class ApiMethodBills extends GetApiMethod {
  public async registerBill(devolution: BillBody) {
    try {
      const resp = await this.axiosInstance.post("/bills/create", devolution);

      return resp;
    } catch (e: any) {
      console.error("Error in registerBill:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al salvar el registerBill: ${e}`);
    }
  }

  public async registerBillByClient(devolution: Omit<BillBody, "sale">) {
    try {
      const resp = await this.axiosInstance.post(
        "/bills/by-client",
        devolution
      );
      return resp;
    } catch (e: any) {
      console.error("Error in registerBill:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al salvar el registerBill: ${e}`);
    }
  }

  public async GetBills(params?: { client: string }): Promise<Bills[]> {
    try {
      const response: any = await this.axiosInstance.get(
        "/bills?pageSize=3000",
        { params }
      );
      return response.data.data;
    } catch (e: any) {
      console.error("Error in GetDevolutions:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al obtener GetBills: ${e}`);
    }
  }
}

export default ApiMethodBills;
