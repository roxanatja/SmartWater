import Product from "../type/Products/Products";
import { Sale } from "../type/Sale/Sale";
import GetApiMethod from "./api.class";

class ApiMethodSales extends GetApiMethod {
  public async GetSales(params?: { client: string }): Promise<Sale[]> {
    try {
      const { data } = await this.axiosInstance.get("/sales?pageSize=3000", {
        params,
      });
      return data.data as Sale[];
    } catch (e) {
      console.error(e);
      throw new Error(
        `Error al obtener la información extendida de las Ventas: ${e}`
      );
    }
  }

  public async saveSale(dataToSave: any) {
    try {
      const respose = await this.axiosInstance.post(
        "/sales/register",
        dataToSave
      );

      return respose.status;
    } catch (e) {
      console.error(e);
      throw new Error(
        `Error al obtener la información extendida de las Ventas: ${e}`
      );
    }
  }

  public async GetProducts(): Promise<Product[]> {
    try {
      const { data } = await this.axiosInstance.get("/products?pageSize=3000");
      return data.data as Product[];
    } catch (e) {
      console.error(e);
      throw new Error(
        `Error al obtener la información extendida de las Ventas: ${e}`
      );
    }
  }

  public async DeleteSale(id: string) {
    try {
      const { data } = await this.axiosInstance.get(`/sales/${id}/delete`);
      return data.data as Product[];
    } catch (e) {
      console.error(e);
      throw new Error(
        `Error al obtener la información extendida de las Ventas: ${e}`
      );
    }
  }
}

export default ApiMethodSales;
