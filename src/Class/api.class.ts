import axios, { AxiosInstance } from "axios";
import { City, Client, Zone } from "./types.data";

class GetApiMethod {
  private axiosInstance: AxiosInstance;

  constructor() {
    const authToken = `${process.env.REACT_APP_API_TOKEN_HEROKU}`;
    this.axiosInstance = axios.create({
      baseURL: process.env.REACT_APP_API_HEROKU,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  // Register client
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

  public async getCities(): Promise<City[]> {
    try {
      const response = await this.axiosInstance.get("/cities/");
      return response.data as City[];
    } catch (error) {
      console.error(error);
      throw new Error(`Error al obtener las ciudades: ${error}`);
    }
  }

  public async getZone(): Promise<Zone[]> {
    try {
      const response = await this.axiosInstance.get("/zones?pageSize=3000");
      return response.data.data as Zone[];
    } catch (e) {
      console.error(e);
      throw new Error(`Error al obtener las ciudades: ${e}`);
    }
  }

  public async GetClientById(id: string): Promise<Client> {
    try {
      const { data } = await this.axiosInstance.get(`/clients/${id}`);
      return data as Client;
    } catch (e) {
      console.error(e);
      throw new Error(`Error al obtener las ciudades: ${e}`);
    }
  }
}

export default GetApiMethod;
