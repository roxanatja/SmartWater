import { KardexDetail, KardexInitialBalances, MatchedElement } from "../../type/Kardex";
import { QueryMetadata } from "../types/common";
import { IInitialBalanceBody, IKardexDetailGetParams, IKardexOthersGetParams, IKardexReportsParams, IOtherEntryBody, IOtherOutputBody, IOthersEntryMoreBody, IOthersOutputMoreBody, KardexOthersReturnMap, KardexReportReturnMap } from "../types/kardex";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class KardexApiConector {
    private static root_path = "/kardex"

    static async getInitialBalances(): Promise<KardexInitialBalances | null> {
        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/find/initial-balance`)
            if ('initialBalance' in res.data) {
                return res.data
            } else {
                return null
            }
        } catch (error) {
            return null
        }
    }

    static async getKardexElements(): Promise<{ elements: MatchedElement[] } | null> {
        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/elements-match`)
            return res.data
        } catch (error) {
            return null
        }
    }

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

    static async reportDetails(params: IKardexDetailGetParams): Promise<{ balances: KardexDetail[] } | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/report-detail${query ? `?${query}` : ''}`)
            return res.data
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

    static async registerEntry(params: { data: IOtherEntryBody }): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/entrys`, params.data)
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

    static async registerOutput(params: { data: IOtherOutputBody }): Promise<{ id: string } | { error: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/outputs`, params.data, {
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
}