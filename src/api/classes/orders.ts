import { Order } from "../../type/Order/Order";
import { QueryMetadata } from "../types/common";
import { IOrderBody, IOrderFilter, IOrdersGetParams, IUpdateOrderBody } from "../types/orders";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class OrdersApiConector {
    private static root_path = "/orders"

    static async get(params: IOrdersGetParams): Promise<{ data: Order[] } & QueryMetadata | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async getOne(params: IOrderFilter): Promise<Order | null> {
        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/${params.orderId}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async create(params: IOrderBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/register`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async update(params: IUpdateOrderBody & IOrderFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.orderId}`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async markAsAttended(params: IOrderFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.orderId}/markAttended`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async cancel(params: IOrderFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.orderId}/cancel`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async convertRegistered(params: { data: { client: string; } } & IOrderFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.orderId}/convertRegistered`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async delete(params: IOrderFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.orderId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}