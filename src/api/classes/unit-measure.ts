import { AxiosError } from "axios";
import { UnitMeasure } from "../../type/Products/UnitMeasure";
import { IUnitBody, IUnitFilter, IUnitGetParams } from "../types/unit-measure";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class UnitMeasureApiConector {
    private static root_path = "/unit-measure"

    static async get(params: IUnitGetParams): Promise<UnitMeasure[] | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async create(params: IUnitBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/register`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async update(params: IUnitBody & IUnitFilter): Promise<{ message: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.unitId}/update`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async delete(params: IUnitFilter): Promise<{ message: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.unitId}/delete`)
            return res.data
        } catch (error) {
            const err = error as AxiosError
            const data = err.response?.data as any

            if (data && data.message) {
                return data
            } else {
                return null
            }
        }
    }
}