import { InvoceExpense } from "../../type/InvoceExpense";
import { QueryMetadata } from "../types/common";
import { IInvExpensesBody, IInvExpensesFilter, IInvExpensesGetParams, IInvExpensesUpdateBody } from "../types/invoice-expenses";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class InvoiceExpensesApiConector {
    private static root_path = "/invoice-expenses"

    static async get(params: IInvExpensesGetParams): Promise<{ data: InvoceExpense[] } & QueryMetadata | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async create(params: IInvExpensesBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/register`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async update(params: IInvExpensesUpdateBody & IInvExpensesFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.invExpensesId}`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async delete(params: IInvExpensesFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.invExpensesId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}