import { BalanceReport, KardexDetail, MatchedElement } from "../../type/Kardex";
import { IInitialBalanceBody, IKardexDetailGetParams, IOtherEntryBody, IOtherOutputBody, IOthersEntryMoreBody, IOthersOutputMoreBody } from "../types/kardex";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class KardexApiConector {
    private static root_path = "/kardex"

    static async getKardexElements(): Promise<{ elements: MatchedElement[] } | null> {
        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/elements-match`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async reportBalance(): Promise<{ balances: BalanceReport } | null> {
        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/report-balance`)
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

    static async registerOutput(params: { data: IOtherOutputBody }): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/outputs`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async registerOutputMore(params: { data: IOthersOutputMoreBody }): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/outputs/more`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }
}