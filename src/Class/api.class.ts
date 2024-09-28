import axios, { AxiosInstance } from "axios";
import { City, Zone } from "./types.data";
import Product from "../type/Products/Products";
import AuthenticationService from "../services/AuthenService";

class GetApiMethod {
  public axiosInstance: AxiosInstance;

  constructor() {
    const auth = AuthenticationService;
    const authToken =
      auth.getToken() || `${process.env.REACT_APP_API_TOKEN_HEROKU}`;
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

  public async getItems(): Promise<Product[]> {
    try {
      const response = await this.axiosInstance.get("/items?pageSize=3000");
      return response.data.data as Product[];
    } catch (e) {
      console.error(e);
      throw new Error(`Error al obtener los item: ${e}`);
    }
  }
}

export default GetApiMethod;
