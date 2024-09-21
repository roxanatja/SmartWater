import toast from "react-hot-toast";
import { Loans, LoansBody } from "../type/Loans/Loans";

import GetApiMethod from "./api.class";

class ApiMethodLoans extends GetApiMethod {
  public async saveLoans(dataToSave: LoansBody) {
    try {
      const response = await this.axiosInstance.post(
        "/loans/register",
        dataToSave
      );
      return response.status;
    } catch (e: any) {
      console.error("Error in saveLoans:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al salvar el Prestamo: ${e}`);
    }
  }

  public async deleteLoans(id: string) {
    try {
      const response = await this.axiosInstance.delete(`/loans/${id}/delete`);
      return response.status;
    } catch (e) {
      console.error("Error in saveOrder:", e);
      throw new Error(`Error al borrar la Prestamo: ${e}`);
    }
  }

  public async loadLoans(params: LoansBody): Promise<LoansBody> {
    try {
      const response = await this.axiosInstance.get("/loans", { params });
      return response.data;
    } catch (e: any) {
      console.error("Error in loadLoans:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al obtener el Prestamo: ${e}`);
    }
  }

  public async GetLoansByClientId(id: string) {
    try {
      const response = await this.axiosInstance.get(`/loans?client=${id}`);
      return response.data.data as Loans[];
    } catch (e: any) {
      console.error("Error in GetLoansByClientId:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al obtener el GetLoansByClientId: ${e}`);
    }
  }
}

export default ApiMethodLoans;
