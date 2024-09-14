import GetApiMethod from "./api.class";
import { Client } from "./types.data";

class ApiMethodClient extends GetApiMethod {
  public async getClientById(id: string): Promise<Client> {
    try {
      const { data } = await this.axiosInstance.get(`/clients/extended/${id}`);
      return data as Client;
    } catch (e) {
      console.error(e);
      throw new Error(
        `Error al obtener la información extendida del cliente: ${e}`
      );
    }
  }

  public async registerClient(clientData: Client): Promise<Client> {
    try {
      const response = await this.axiosInstance.post(
        "/clients/register",
        clientData
      );
      return response.data as Client;
    } catch (error) {
      console.error(error);
      throw new Error(`Error al registrar el cliente: ${error}`);
    }
  }

  public async updateClient(id: string, client: Client) {
    try {
      await this.axiosInstance.put(`/clients/${id}`, client);
      return 200;
    } catch (e) {
      console.error(e);
      throw new Error(`Error al registrar el cliente: ${e}`);
    }
  }
}

export default ApiMethodClient;
