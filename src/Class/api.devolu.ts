import toast from "react-hot-toast";
import GetApiMethod from "./api.class";
import { Devolution } from "../type/Devolution/devolution";

class ApiMethodDevolu extends GetApiMethod {
  public async DevolutionsRegister(devolution: any) {
    try {
      const resp = await this.axiosInstance.post(
        "/devolutions/register",
        devolution
      );

      return resp;
    } catch (e: any) {
      console.error("Error in DevolutionsRegister:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al salvar el DevolutionsRegister: ${e}`);
    }
  }

  public async GetDevolutions(params?: any): Promise<Devolution[]> {
    try {
      const response: any = await this.axiosInstance.get(
        "/devolutions?pageSize=3000",
        { params }
      );
      return response.data.data;
    } catch (e: any) {
      console.error("Error in GetDevolutions:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al salvar el GetDevolutions: ${e}`);
    }
  }
  public async registerDevolutions(devolution: any) {
    try {
      const resp = await this.axiosInstance
        .post("/devolutions/register", devolution)
        .then((respuesta) => {
          return respuesta.status;
        });

      return resp;
    } catch (e: any) {
      console.error("Error in registerDevolutions:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al salvar el registerDevolutions: ${e}`);
    }
  }
}

export default ApiMethodDevolu;
