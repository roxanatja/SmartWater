import { Transaction, CashReport, ResultsReport } from "../../type/Cash";
import { IRegistersCloseBody, IRegistersFilter, IRegistersGetParams, IRegistersOpenBody, IRegistersOpenCloseBody, IReportDailyBody } from "../types/cash-registers";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class CashRegisterApiConector {
    private static root_path = "/cashRegisters"

    static async get(params: IRegistersGetParams): Promise<Transaction[] | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async calculateReport(params: IRegistersGetParams): Promise<CashReport | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}/calculate-report${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async open(params: IRegistersOpenBody): Promise<{ cashRegister: string } | { cashRegister: { error: string } } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/create`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async openClose(params: IRegistersOpenCloseBody): Promise<{ arqueo: Transaction, message: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/open-close`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async closeReport(params: IRegistersCloseBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/close-report`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async reportDaily(params: IReportDailyBody): Promise<ResultsReport | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/report-daily`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async delete(params: IRegistersFilter): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.registryId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}