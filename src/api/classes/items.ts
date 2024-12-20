import { Item } from "../../type/Item";
import { QueryMetadata } from "../types/common";
import { IItemBody, IItemFilter, IItemsGetParams } from "../types/items";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class ItemsApiConector {
    private static root_path = "/items"

    static async get(params: IItemsGetParams): Promise<{ data: Item[] } & QueryMetadata | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async create(params: IItemBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/create`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async update(params: IItemBody & IItemFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.productId}/update`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async delete(params: IItemFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.productId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}