import { KardexDetail, KardexInitialBalances, MatchedElement } from "../../type/Kardex";
import { IKardexDetailGetParams, IKardexReportsParams, KardexReportReturnMap } from "../types/kardex";
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

    static async reportDetails(params: IKardexDetailGetParams): Promise<{ balances: KardexDetail[] } | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/report-detail${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }
}