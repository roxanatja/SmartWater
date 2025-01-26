import { District } from "../../type/City";
import { QueryMetadata } from "../types/common";
import { IDistricBody, IDistricFilter, IDistricSearchParams, IDistricsGetParams, IDistricUpdateBody } from "../types/districts";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class DistrictsApiConector {
    private static root_path = "/districts"

    static async get(params: IDistricsGetParams): Promise<{ data: District[] } & QueryMetadata | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async findByNamaOrCity(params: IDistricSearchParams): Promise<{ exist: District } | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/findOnChange${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async create(params: IDistricBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/create`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async update(params: IDistricUpdateBody & IDistricFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.districtId}/update`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async delete(params: IDistricFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.districtId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}