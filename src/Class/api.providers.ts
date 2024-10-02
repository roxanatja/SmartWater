import toast from "react-hot-toast";
import { Providers, ProvidersBody } from "../type/providers";
import GetApiMethod from "./api.class";

class ApiMethodProvider extends GetApiMethod {
  public async saveProvider(dataToSave: ProvidersBody) {
    try {
      const response = await this.axiosInstance.post(
        "/providers/create",
        dataToSave
      );
      return response.status;
    } catch (e: any) {
      console.error("Error in saveProvider:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al salvar el proverdor: ${e}`);
    }
  }

  public async updateProvider(dataToSave: Providers) {
    try {
      const response = await this.axiosInstance.post(
        `/providers/${dataToSave._id}/update`,
        dataToSave
      );
      return response.status;
    } catch (e: any) {
      console.error("Error in saveProvider:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al salvar el proverdor: ${e}`);
    }
  }

  public async deleteProvider(id: string) {
    try {
      const response = await this.axiosInstance.delete(
        `/providers/${id}/delete`
      );
      return response.status;
    } catch (e) {
      console.error("Error in deleteProvider:", e);
      throw new Error(`Error al borrar el Provedor: ${e}`);
    }
  }

  public async loadProvider(params?: Providers): Promise<Providers[]> {
    try {
      const response = await this.axiosInstance.get("/providers", { params });
      return response.data.data;
    } catch (e: any) {
      console.error("Error in loadProvider:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al cargar loadProvider: ${e}`);
    }
  }
}

export default ApiMethodProvider;
