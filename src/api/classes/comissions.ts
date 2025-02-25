import { IComissionGeneralBody, IComissionFilter, IComissionGetParams, ComissionGetReturnMap, IComissionUserBody, IComissionSpecificBody, IComissionByUserUpdateBody, IComissionSpecificUpdateBody } from "../types/comissions";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class ComissionsApiConector {
    private static root_path = "/comission"

    static async get<T extends keyof ComissionGetReturnMap>(params: IComissionGetParams & { type: T }): Promise<ComissionGetReturnMap[T] | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/${params.type}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async createGeneral(params: IComissionGeneralBody): Promise<{ id: string } | { error: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/general-comission/generate`, params.data, {
                validateStatus(status) {
                    if (status === 200 || status === 404) {
                        return true
                    }
                    return false;
                },
            })
            return res.data
        } catch (error) {
            return null
        }
    }

    static async createByUser(params: IComissionUserBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/distributor-comission/generate`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async createSpecific(params: IComissionSpecificBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/specific-comission/generate`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async updateByUser(params: IComissionByUserUpdateBody & IComissionFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/byuser/general/${params.comissionId}`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async updateSpecific(params: IComissionSpecificUpdateBody & IComissionFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/specific-update/${params.comissionId}`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async delete(params: IComissionFilter): Promise<{ message: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.comissionId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}