import { Devolution, DevolutionConsolidated } from "../../type/Devolution/devolution";
import { QueryMetadata } from "../types/common";
import { IDevolutionBody, IDevolutionConsolidatedGetParams, IDevolutionGetParams } from "../types/devolutions";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class DevolutionsApiConector {
    private static root_path = "/devolutions"

    static async get(params: IDevolutionGetParams): Promise<{ data: Devolution[] } & QueryMetadata | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async getConsolidated(params: IDevolutionConsolidatedGetParams): Promise<DevolutionConsolidated[] | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async create(params: IDevolutionBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/register`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }
}