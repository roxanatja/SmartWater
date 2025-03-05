import { QueryMetadata } from "../types/common";
import { IDeleteOther, IInitialBalanceBody, IKardexOthersGetParams, IKardexReportsParams, IOthersEntryMoreBody, IOthersOutputMoreBody, KardexOthersReturnMap, KardexReportReturnMap } from "../types/valued-physical";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class ValuedPhysicalApiConector {
    private static root_path = "/valued-physical-inventory"

    static async kardexReports<T extends keyof KardexReportReturnMap>(params: IKardexReportsParams & { type: T }): Promise<KardexReportReturnMap[T] | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/report-${params.type}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async getOthers<T extends keyof KardexOthersReturnMap>(params: IKardexOthersGetParams & { type: T }): Promise<KardexOthersReturnMap[T] & QueryMetadata | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/other-${params.type}${query ? `?${query}` : ''}`)
            return res.data.data
        } catch (error) {
            return null
        }
    }

    static async initialBalance(params: IInitialBalanceBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/initial-balance`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async registerEntryMore(params: { data: IOthersEntryMoreBody }): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/entrys/more`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async registerOutputMore(params: { data: IOthersOutputMoreBody }): Promise<{ id: string } | { error: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/outputs/more`, params.data, {
                validateStatus(status) {
                    if (status === 409 || status === 200) return true
                    return false
                },
            })
            if (res.status === 409) {
                return { error: "conflict" }
            } else {
                return res.data
            }
        } catch (error) {
            return null
        }
    }

    static async deleteInitialBalances(): Promise<{ message: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/initial-balance/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async deleteOther(params: IDeleteOther): Promise<{ message: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.type}/${params.entryId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}