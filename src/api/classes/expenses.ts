import { Expense } from "../../type/Expenses";
import { QueryMetadata } from "../types/common";
import { IExpenseBody, IExpenseDetailsBody, IExpenseFilter, IExpensesGetParams } from "../types/expenses";
import { generateQueryString } from "../utils/common";
import { ApiConnector } from "./api-conector";

export abstract class ExpensesApiConector {
    private static root_path = "/expenses"

    static async get(params: IExpensesGetParams): Promise<{ data: Expense[] } & QueryMetadata | null> {
        const query = generateQueryString(params)

        try {
            const res = await ApiConnector.getInstance().get(`${this.root_path}${query ? `?${query}` : ''}`)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async create(params: IExpenseBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/create`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async createWithDetails(params: IExpenseDetailsBody): Promise<{ id: string } | null> {
        try {
            const res = await ApiConnector.getInstance().post(`${this.root_path}/hasdetail`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async update(params: IExpenseDetailsBody & IExpenseFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().put(`${this.root_path}/${params.expenseId}/update`, params.data)
            return res.data
        } catch (error) {
            return null
        }
    }

    static async delete(params: IExpenseFilter): Promise<{ mensaje: string } | null> {
        try {
            const res = await ApiConnector.getInstance().delete(`${this.root_path}/${params.expenseId}/delete`)
            return res.data
        } catch (error) {
            return null
        }
    }
}