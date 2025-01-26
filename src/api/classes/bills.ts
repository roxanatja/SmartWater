import { Bills } from "../../type/Bills";
import { QueryMetadata } from "../types/common";
import { IBillByClientBody, IBillsBody, IBillsFilter, IBillsGetParams } from "../types/bills";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class BillsApiConector {
    private static root_path = "/bills"

    static async get(params: IBillsGetParams): Promise<{ data: Bills[] } & QueryMetadata | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async create(params: IBillsBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/create`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async createByClient(params: IBillByClientBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/by-client`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async update(params: IBillsBody & IBillsFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.billsId}/update`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async delete(params: IBillsFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.billsId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}