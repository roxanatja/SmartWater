import { Providers } from "../../type/providers";
import { QueryMetadata } from "../types/common";
import { IProviderBody, IProviderFilter, IProvidersGetParams } from "../types/providers";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class ProvidersApiConector {
    private static root_path = "/providers"

    static async get(params: IProvidersGetParams): Promise<{ data: Providers[] } & QueryMetadata | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async create(params: IProviderBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/create`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async update(params: IProviderBody & IProviderFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.providerId}/update`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async delete(params: IProviderFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.providerId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}