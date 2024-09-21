import toast from "react-hot-toast";
import GetApiMethod from "./api.class";
import { DevolutionBody } from "../type/Devolution/devolution";

class ApiMethodDevolu extends GetApiMethod {
  public async DevolutionsRegister(devolution: DevolutionBody) {
    try {
      const resp = this.axiosInstance.post("/devolutions/register", devolution);

      return resp;
    } catch (e: any) {
      console.error("Error in DevolutionsRegister:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al salvar el DevolutionsRegister: ${e}`);
    }
  }

  public async GetDevolutions(): Promise<DevolutionBody[]> {
    try {
      const response: any = this.axiosInstance.get<DevolutionBody[]>(
        "/devolutions?pageSize=3000"
      );
      return response.data;
    } catch (e: any) {
      console.error("Error in GetDevolutions:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al salvar el GetDevolutions: ${e}`);
    }
  }

  public async GetDevolutionsByUser(userId: string): Promise<DevolutionBody> {
    try {
      const response: any = this.axiosInstance.get(
        `/devolutions?client=${userId}`
      );
      return response.data as DevolutionBody;
    } catch (e: any) {
      console.error("Error in GetDevolutionsByUser:", e);
      if (e?.response?.data?.msg) {
        toast.error(e.response.data.msg);
      }
      throw new Error(`Error al salvar el GetDevolutionsByUser: ${e}`);
    }
  }

  public async registerDevolutions(devolution: DevolutionBody) {
    try {
      const resp = this.axiosInstance
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
