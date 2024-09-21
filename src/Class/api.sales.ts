import Product from "../type/Products/Products";
import { Sale, SaleBody } from "../type/Sale/Sale";
import GetApiMethod from "./api.class";

class ApiMethodSales extends GetApiMethod {
  public async GetSales(): Promise<Sale> {
    try {
      const { data } = await this.axiosInstance.get("/sales?pageSize=3000");
      return data as Sale;
    } catch (e) {
      console.error(e);
      throw new Error(
        `Error al obtener la información extendida de las Ventas: ${e}`
      );
    }
  }

  public async saveSale(dataToSave: SaleBody) {
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
}

export default ApiMethodSales;
