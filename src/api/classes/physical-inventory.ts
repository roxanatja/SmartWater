import { MatchedElementRoot } from "../../type/Kardex";
import { IDeleteBody, IInitialBalanceBody, IInitialBalanceUpdateBody, IInventoryFilter, IPhysicalGetParams, ISaveReportBody, PhysicalGetReturnMap } from "../types/physical-inventory";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class PhysicalInventoryApiConector {
    private static root_path = "/physical-inventory"

    static async getElements(): Promise<MatchedElementRoot[] | null> {
        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/elements-match`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async get<T extends keyof PhysicalGetReturnMap>(params: IPhysicalGetParams & { type: T }): Promise<PhysicalGetReturnMap[T] | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/${params.type}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async createBalance(params: IInitialBalanceBody): Promise<{ id: string } | { message: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/initial-balance/create`, params.data, {
                validateStatus(status) {
                    if (status === 400 || status === 200) return true
                    return false
                },
            })
            return res.data
        } catch (error) {
            return null
        }
    }

    static async saveReport(params: ISaveReportBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/save-report`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async update(params: IInitialBalanceUpdateBody): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/update/initial-balance`, params.data, {
                validateStatus(status) {
                    if (status === 400 || status === 200) return true
                    return false
                },
            })
            return res.data
        } catch (error) {
            return null
        }
    }

    static async deleteReport(params: IInventoryFilter): Promise<{ message: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.inventoryId}/delete-report`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async delete(params: IDeleteBody): Promise<{ message: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/initial-balance/delete`, {
                data: params.data
            })
            return res.data
        } catch (error) {
            return null
        }
    }
}