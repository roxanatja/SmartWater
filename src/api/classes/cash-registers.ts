import { Transaction, CashReport } from "../../type/Cash";
import { IRegistersCloseBody, IRegistersGetParams, IRegistersOpenBody } from "../types/cash-registers";
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

    static async open(params: IRegistersOpenBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/create`, params.data)
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
}