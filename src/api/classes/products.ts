import Product from "../../type/Products/Products";
import { QueryMetadata } from "../types/common";
import { IProductBody, IProductBodyNoCategory, IProductFilter, IProductsGetParams } from "../types/products";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class ProductsApiConector {
    private static root_path = "/products"

    static async get(params: IProductsGetParams): Promise<{ data: Product[] } & QueryMetadata | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async create(params: IProductBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/create`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async update(params: IProductBodyNoCategory & IProductFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.productId}/update`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async delete(params: IProductFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.productId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}