import axios, { AxiosInstance } from "axios";
import { City, Zone } from "./types.data";

class GetApiMethod {
  public axiosInstance: AxiosInstance;

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
}

export default GetApiMethod;
