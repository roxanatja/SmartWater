import toast from "react-hot-toast";
import { Account, AccountBody } from "../type/AccountEntry";
import GetApiMethod from "./api.class";

class ApiMethodAccountEntry extends GetApiMethod {
  public async saveAccount(dataToSave: AccountBody) {
    try {
      const response = await this.axiosInstance.post(
        "/account-entry/create",
        dataToSave
      );
      return response.status;
    } catch (e: any) {
      console.error("Error in saveAccount:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al salvar saveAccount: ${e}`);
    }
  }

  public async loadAccounts(params?: Account): Promise<Account[]> {
    try {
      const response = await this.axiosInstance.get("/account-entry", {
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
}

export default ApiMethodAccountEntry;
