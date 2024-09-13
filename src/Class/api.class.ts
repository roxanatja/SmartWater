import axios, { AxiosInstance } from "axios";
import { City, Client } from "./types.data";

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
}

export default GetApiMethod;
